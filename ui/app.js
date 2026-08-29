const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const pad = (value) => String(value).padStart(2, "0");
const storageKey = "english-content-pipeline-study-v1";
const answersStorageKey = `${storageKey}-answers`;
const completionStorageKey = `${storageKey}-completion`;
const lessonDatesStorageKey = `${storageKey}-lesson-dates`;
const studyTimeStorageKey = `${storageKey}-study-time`;

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value && typeof value === "object" ? value : fallback;
  } catch (_error) {
    return fallback;
  }
}

const legacyAnswers = readStorage(storageKey, {});
const savedAnswers = readStorage(answersStorageKey, {});
const completionByDate = readStorage(completionStorageKey, {});
const lessonIdByDate = readStorage(lessonDatesStorageKey, {});
const studyTimeByDate = readStorage(studyTimeStorageKey, {});
const today = new Date();
const dateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const todayKey = dateKey(today);
const courseStartKey = `${storageKey}-start-date`;
const courseStartDateKey = localStorage.getItem(courseStartKey) || todayKey;
localStorage.setItem(courseStartKey, courseStartDateKey);

let lessons = [];
let activeLesson = null;
let ttsCues = [];
let saveAnswersTimer = null;
let studyTimerStartedAt = null;
let studyTimerDateKey = null;
let designCalendarSelectedDate = todayKey;
const state = { current: 0, activeDate: todayKey, answers: {}, revealed: false };

function dateFromKey(key) {
  const [year, month, day] = String(key).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dayDifference(fromKey, toKey) {
  return Math.round((dateFromKey(toKey) - dateFromKey(fromKey)) / 86400000);
}

function lessonForDate(key) {
  const day = dayDifference(courseStartDateKey, key) + 1;
  return lessons.find((lesson) => lesson.day === day) || null;
}

function lessonDate(lesson) {
  const result = dateFromKey(courseStartDateKey);
  result.setDate(result.getDate() + lesson.day - 1);
  return dateKey(result);
}

function currentSentences() {
  return activeLesson?.sentences || [];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeLesson(entry) {
  const content = entry.content || {};
  const rawSentences = Array.isArray(content.sentence_interpretations) ? content.sentence_interpretations : [];
  const rules = Array.isArray(content.review_rules) ? content.review_rules : [];
  const sentences = rawSentences.map((item, index) => {
    const rule = rules.find((candidate) => candidate.sentence_index === index + 1) || {};
    return {
      section: item.section || "READING PRACTICE",
      subheading: item.subheading || `Sentence ${String(index + 1).padStart(2, "0")}`,
      text: item.sentence || "",
      translation: item.translation || "",
      learningNote: item.learning_note || "Review the key meaning in this sentence.",
      focusTerms: Array.isArray(item.focus_terms) ? item.focus_terms : [],
      concepts: (rule.concepts || []).map((concept) => ({
        label: concept.name || "Key structure",
        keywords: Array.isArray(concept.keywords) ? concept.keywords : [],
        warnings: Array.isArray(concept.wrong_patterns) ? concept.wrong_patterns : [],
        note: concept.feedback || "Review this expression in context."
      }))
    };
  });
  const title = entry.title || content.title || entry.topic;
  return {
    ...entry,
    title,
    tag: `READING · ${entry.category || entry.topic || "LESSON"}`,
    description: `Practice sentence-by-sentence English with ${entry.topic || title}.`,
    sentences,
    article: Array.isArray(content.article) ? content.article : [],
    vocabulary: Array.isArray(content.vocabulary) ? content.vocabulary : [],
    audioUrl: entry.audio_url,
    cuesUrl: entry.cues_url,
    metadata: content.metadata || {}
  };
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function loadLessons() {
  const catalog = await fetchJson("/api/lessons");
  const details = await Promise.all(catalog.map((lesson) => fetchJson(`/api/lessons/${encodeURIComponent(lesson.id)}`)));
  lessons = details.map(normalizeLesson);
  lessons.forEach((lesson) => {
    if (!savedAnswers[lesson.id] && savedAnswers[lesson.day]) savedAnswers[lesson.id] = savedAnswers[lesson.day];
  });
  const firstLesson = lessonForDate(todayKey) || lessons[0];
  if (!firstLesson) throw new Error("No lessons are registered in the catalog.");
  activeLesson = firstLesson;
  state.activeDate = lessonForDate(todayKey) ? todayKey : lessonDate(firstLesson);
  state.answers = loadStudyProgress(firstLesson);
  renderLessonHeader();
  renderStudy();
  renderReading();
  renderCalendar();
  await loadTtsForLesson();
  renderDesignCalendar();
  renderDesignDashboard();
  renderDesignProgress();
}

function loadStudyProgress(lesson = activeLesson) {
  if (!lesson) return {};
  const stored = savedAnswers[lesson.id] || savedAnswers[lesson.day] || {};
  return { ...stored };
}

function persistStudyTime() {
  localStorage.setItem(studyTimeStorageKey, JSON.stringify(studyTimeByDate));
}

function startStudyTimer() {
  if (document.hidden || $("#studyWorkspace")?.hidden !== false || !activeLesson) return;
  if (!studyTimerStartedAt) {
    studyTimerStartedAt = Date.now();
    studyTimerDateKey = state.activeDate || todayKey;
  }
}

function flushStudyTimer() {
  if (!studyTimerStartedAt || !studyTimerDateKey) return;
  const elapsed = Math.max(0, (Date.now() - studyTimerStartedAt) / 1000);
  studyTimeByDate[studyTimerDateKey] = Number(studyTimeByDate[studyTimerDateKey] || 0) + elapsed;
  studyTimerStartedAt = Date.now();
  persistStudyTime();
  renderDesignDashboard();
  renderDesignCalendar();
  renderDesignProgress();
}

function stopStudyTimer() {
  flushStudyTimer();
  studyTimerStartedAt = null;
  studyTimerDateKey = null;
}

function isLessonComplete() {
  return currentSentences().length > 0 && currentSentences().every((_, index) => Boolean((state.answers[index] || "").trim()));
}

function saveStudyProgress() {
  if (!activeLesson) return;
  savedAnswers[activeLesson.id] = { ...state.answers };
  localStorage.setItem(answersStorageKey, JSON.stringify(savedAnswers));
  localStorage.setItem(storageKey, JSON.stringify(state.answers));
  if (isLessonComplete()) {
    completionByDate[state.activeDate] = true;
    lessonIdByDate[state.activeDate] = activeLesson.id;
  } else {
    delete completionByDate[state.activeDate];
    delete lessonIdByDate[state.activeDate];
  }
  localStorage.setItem(completionStorageKey, JSON.stringify(completionByDate));
  localStorage.setItem(lessonDatesStorageKey, JSON.stringify(lessonIdByDate));
  if ($("#saveStatus")) $("#saveStatus").textContent = "Saved locally · just now";
  renderCalendar();
  renderDesignDashboard();
  renderDesignProgress();
  renderDesignCalendar();
}

function updateCompletion() {
  saveStudyProgress();
}

function flushPendingAnswerSave() {
  if (!saveAnswersTimer) return;
  window.clearTimeout(saveAnswersTimer);
  saveAnswersTimer = null;
  saveStudyProgress();
}

function selectDate(key) {
  const lesson = lessonForDate(key);
  if (!lesson) return;
  stopStudyTimer();
  activeLesson = lesson;
  state.activeDate = key;
  state.current = 0;
  state.revealed = false;
  state.answers = loadStudyProgress(lesson);
  renderLessonHeader();
  renderStudy();
  renderReading();
  loadTtsForLesson();
  showView("study");
}

function renderCalendar() {
  const panel = $("#calendarPanel");
  if (!panel || !activeLesson) return;
  const cursor = dateFromKey(state.activeDate);
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let index = 0; index < firstDay; index += 1) cells.push('<span class="calendar-day"></span>');
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${year}-${pad(month + 1)}-${pad(day)}`;
    const lesson = lessonForDate(key);
    const classes = ["calendar-day"];
    if (lesson) classes.push("has-lesson");
    if (key === state.activeDate) classes.push("is-selected");
    if (key === todayKey) classes.push("is-today");
    if (completionByDate[key]) classes.push("is-complete");
    const label = lesson ? `${key} · ${getDesignLessonTitle(lesson)}` : key;
    cells.push(lesson
      ? `<button class="${classes.join(" ")}" data-date="${key}" title="${escapeHtml(label)}" type="button"><span>${day}</span><span class="calendar-check">${completionByDate[key] ? "✓" : ""}</span></button>`
      : `<span class="${classes.join(" ")}"><span>${day}</span></span>`);
  }
  panel.innerHTML = `<div class="calendar-header"><span class="calendar-month">${cursor.toLocaleDateString("en-US", { year: "numeric", month: "long" })}</span><span class="calendar-caption">${state.activeDate === todayKey ? "Today · " : "Selected · "}${escapeHtml(getDesignLessonTitle(lessonForDate(state.activeDate) || activeLesson))}</span></div><div class="calendar-grid">${cells.join("")}</div>`;
  panel.querySelectorAll("[data-date]").forEach((button) => button.addEventListener("click", () => selectDate(button.dataset.date)));
}

function renderLessonHeader() {
  if (!activeLesson) return;
  $("#lessonDay").textContent = `DAY ${pad(activeLesson.day)}`;
  $("#lessonTag").textContent = activeLesson.tag;
  $("#lessonTitle").textContent = activeLesson.title;
  $("#lessonDescription").textContent = activeLesson.description;
}

function renderTtsTranscript(words, fallbackText) {
  const target = $("#ttsTranscript");
  if (!target) return;
  const transcriptWords = words.length ? words : String(fallbackText || "").match(/\S+/g)?.map((text, index) => ({ text, start: index, end: index + 1 })) || [];
  target.innerHTML = transcriptWords.length
    ? transcriptWords.map((cue, index) => `<span class="tts-word" data-cue-index="${index}" data-start="${Number(cue.start) || 0}" data-end="${Number(cue.end) || 0}">${escapeHtml(cue.text)}</span>`).join(" ")
    : `<p class="tts-empty">No TTS script is available for this lesson yet.</p>`;
}

async function loadTtsForLesson() {
  const lessonAtRequest = activeLesson;
  const audio = $("#lessonAudio");
  if (!audio || !lessonAtRequest) return;
  ttsCues = [];
  const fallbackText = lessonAtRequest.sentences.map((sentence) => sentence.text).join(" ");
  if (!lessonAtRequest.audioUrl) {
    audio.removeAttribute("src");
    audio.load();
    renderTtsTranscript([], fallbackText);
    return;
  }
  audio.src = lessonAtRequest.audioUrl;
  audio.load();
  try {
    const payload = lessonAtRequest.cuesUrl ? await fetchJson(lessonAtRequest.cuesUrl) : {};
    if (lessonAtRequest !== activeLesson) return;
    ttsCues = Array.isArray(payload.words) ? payload.words : [];
    if (payload.voice && $("#ttsVoiceLabel")) $("#ttsVoiceLabel").textContent = payload.voice.replace("en-US-", "").replace("Neural", " Neural");
    renderTtsTranscript(ttsCues, payload.transcript || fallbackText);
  } catch (_error) {
    renderTtsTranscript([], fallbackText);
  }
}

function updateTtsHighlight() {
  const audio = $("#lessonAudio");
  if (!audio) return;
  const activeIndex = ttsCues.findIndex((cue) => audio.currentTime >= Number(cue.start) && audio.currentTime <= Number(cue.end));
  $$(".tts-word").forEach((word, index) => word.classList.toggle("is-active", index === activeIndex));
  $(".tts-word.is-active")?.scrollIntoView({ block: "nearest", inline: "nearest" });
}

function highlightOriginal(text, terms = []) {
  if (!terms.length) return escapeHtml(text);
  const escapedTerms = terms.slice().sort((a, b) => b.length - a.length).map((term) => String(term).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escapedTerms.join("|")})`, "gi");
  let result = "";
  let lastIndex = 0;
  String(text).replace(pattern, (match, _group, offset) => {
    result += escapeHtml(String(text).slice(lastIndex, offset));
    result += `<mark class="important-word">${escapeHtml(match)}</mark>`;
    lastIndex = offset + match.length;
    return match;
  });
  return result + escapeHtml(String(text).slice(lastIndex));
}

function renderNavigation() {
  const target = $("#sentenceNav");
  if (!target) return;
  target.innerHTML = currentSentences().map((sentence, index) => {
    const complete = Boolean((state.answers[index] || "").trim());
    return `<button type="button" class="${index === state.current ? "is-active " : ""}${complete ? "is-complete" : ""}" data-index="${index}"><span class="nav-index">${String(index + 1).padStart(2, "0")}</span><span class="nav-title">${escapeHtml(sentence.subheading)}</span><span class="nav-check">${complete ? "✓" : ""}</span></button>`;
  }).join("");
  target.querySelectorAll("[data-index]").forEach((button) => button.addEventListener("click", () => {
    state.current = Number(button.dataset.index);
    state.revealed = false;
    renderStudy();
  }));
}

function renderProgress() {
  const total = currentSentences().length;
  const completed = currentSentences().filter((_, index) => Boolean((state.answers[index] || "").trim())).length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;
  if ($("#progressText")) $("#progressText").textContent = `${percentage}%`;
  if ($("#progressBar")) $("#progressBar").style.width = `${percentage}%`;
}

function analyzeAnswer(sentence, answer) {
  const normalized = String(answer || "").trim().toLowerCase();
  if (!normalized) return { understood: [], issues: ["Write your interpretation to receive feedback."], learn: [sentence.learningNote] };
  const understood = [];
  const issues = [];
  const learn = [];
  sentence.concepts.forEach((concept) => {
    const found = concept.keywords.some((keyword) => normalized.includes(String(keyword).toLowerCase()));
    const warning = concept.warnings.find((keyword) => normalized.includes(String(keyword).toLowerCase()));
    if (warning) issues.push(`${concept.label}: review the meaning around “${warning}”.`);
    else if (found) understood.push(`${concept.label}: key meaning included.`);
    else issues.push(`${concept.label}: this key meaning is not visible yet.`);
    learn.push(concept.note);
  });
  return { understood, issues, learn: [...new Set(learn)] };
}

function renderFeedback(sentence, answer) {
  const feedback = analyzeAnswer(sentence, answer);
  const list = (items, empty) => items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : `<p class="feedback-empty">${escapeHtml(empty)}</p>`;
  return `<div class="feedback-section is-good"><p class="feedback-heading">Understood</p>${list(feedback.understood, "No key meaning detected yet.")}</div><div class="feedback-section is-warning"><p class="feedback-heading">Review</p>${list(feedback.issues, "No review points yet.")}</div><div class="feedback-section is-learn"><p class="feedback-heading">Learning note</p>${list(feedback.learn, "No additional note.")}</div>`;
}

function renderStudy() {
  const sentence = currentSentences()[state.current];
  if (!sentence) return;
  const answer = state.answers[state.current] || "";
  const indexLabel = String(state.current + 1).padStart(2, "0");
  $("#sentenceCounter").textContent = `SENTENCE ${indexLabel} / ${String(currentSentences().length).padStart(2, "0")}`;
  $("#sectionLabel").textContent = sentence.subheading;
  $("#sentenceNumber").textContent = indexLabel;
  $("#originalSentence").innerHTML = highlightOriginal(sentence.text, sentence.focusTerms);
  $("#interpretationInput").value = answer;
  $("#characterCount").textContent = `${answer.length} chars`;
  $("#correctTranslation").textContent = sentence.translation;
  $("#reviewFeedback").innerHTML = renderFeedback(sentence, answer);
  $("#answerPreview").hidden = !state.revealed;
  $("#revealButton").textContent = state.revealed ? "Hide reference" : "Show reference";
  $("#previousButton").disabled = state.current === 0;
  $("#nextButton").textContent = state.current === currentSentences().length - 1 ? "Review" : "Next sentence";
  const status = $("#sentenceStatus");
  status.textContent = answer.trim() ? "Complete" : "In progress";
  status.classList.toggle("is-complete", Boolean(answer.trim()));
  renderNavigation();
  renderProgress();
}

function renderReading() {
  const target = $("#readingText");
  if (!target) return;
  target.innerHTML = currentSentences().map((sentence, index) => `<article class="reading-sentence-item"><div class="reading-sentence-heading"><span class="reading-number">${String(index + 1).padStart(2, "0")}</span><div><p class="reading-section-label">${escapeHtml(sentence.section)}</p><h4>${escapeHtml(sentence.subheading)}</h4></div></div><p class="reading-paragraph">${highlightOriginal(sentence.text, sentence.focusTerms)}</p>${index < currentSentences().length - 1 ? "<hr />" : ""}</article>`).join("");
}

function renderReview() {
  const target = $("#reviewList");
  if (!target) return;
  target.innerHTML = currentSentences().map((sentence, index) => {
    const answer = (state.answers[index] || "").trim();
    return `<article class="review-item"><div class="review-item-header"><span class="review-item-number">${String(index + 1).padStart(2, "0")}</span><span class="review-item-status">${answer ? "Interpretation complete" : "Not answered"}</span></div><div class="review-row review-original"><p class="review-row-label">Original</p><p>${highlightOriginal(sentence.text, sentence.focusTerms)}</p></div><div class="review-row"><p class="review-row-label">Your interpretation</p><p>${escapeHtml(answer || "Not answered")}</p></div><div class="review-row"><p class="review-row-label">Reference</p><p>${escapeHtml(sentence.translation)}</p></div><div class="review-row review-key"><p class="review-row-label">Key meaning coverage</p>${renderFeedback(sentence, answer)}</div></article>`;
  }).join("");
}

function showView(view) {
  $("#studyView").hidden = view !== "study";
  $("#readingView").hidden = view !== "reading";
  $("#reviewView").hidden = view !== "review";
  $$(".view-tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === view));
  if (view === "reading") renderReading();
  if (view === "review") renderReview();
  if (view === "study") startStudyTimer();
}

function calculateCurrentStreak(records, referenceDate = new Date()) {
  const completed = new Set(Object.keys(records || {}).filter((key) => records[key]));
  if (!completed.size) return 0;
  const cursor = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  if (!completed.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (completed.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function getLessonAnswers(lesson) {
  return lesson === activeLesson ? state.answers : loadStudyProgress(lesson);
}

function getDesignLessonStats(lesson) {
  const answers = getLessonAnswers(lesson);
  let answered = 0;
  let covered = 0;
  let conceptCount = 0;
  lesson.sentences.forEach((sentence, index) => {
    const answer = String(answers[index] || "").trim();
    if (!answer) return;
    answered += 1;
    const feedback = analyzeAnswer(sentence, answer);
    covered += feedback.understood.length;
    conceptCount += sentence.concepts.length;
  });
  return { answered, total: lesson.sentences.length, percent: lesson.sentences.length ? Math.round((answered / lesson.sentences.length) * 100) : 0, coverage: conceptCount ? Math.round((covered / conceptCount) * 100) : 0 };
}

function getDesignProgressSummary() {
  const stats = lessons.map(getDesignLessonStats);
  const answered = stats.reduce((sum, item) => sum + item.answered, 0);
  const available = stats.reduce((sum, item) => sum + item.total, 0);
  const covered = stats.filter((item) => item.answered > 0);
  const coverage = covered.length ? Math.round(covered.reduce((sum, item) => sum + item.coverage, 0) / covered.length) : 0;
  const seconds = Object.values(studyTimeByDate).reduce((sum, value) => sum + Number(value || 0), 0);
  return { stats, answered, available, coverage, completedLessons: stats.filter((item) => item.percent === 100).length, streak: calculateCurrentStreak(completionByDate), minutes: Math.round(seconds / 60) };
}

function getDesignLessonTitle(lesson) {
  return String(lesson?.title || "").replace(/<br\s*\/?\s*>/gi, " ").replace(/\s+/g, " ").trim();
}

function getDesignVocabulary(lesson) {
  const terms = lesson.vocabulary.map((item) => item.expression).concat(lesson.sentences.flatMap((sentence) => sentence.focusTerms || []));
  return [...new Map(terms.map((term) => [String(term).toLowerCase(), term])).values()].slice(0, 10);
}

function getDesignMilestoneData(summary) {
  return [["First Step", "Answer your first sentence", summary.answered >= 1], ["Lesson Complete", "Finish one full lesson", summary.completedLessons >= 1], ["Ten Sentences", "Study ten sentences", summary.answered >= 10], ["Three-Day Streak", "Complete three study days", summary.streak >= 3], ["Focused 30", "Study for thirty minutes", summary.minutes >= 30], ["Week Explorer", "Complete all seven lessons", summary.completedLessons >= 7]];
}

function renderDesignMilestones(target, summary, compact = false) {
  if (!target) return;
  target.innerHTML = getDesignMilestoneData(summary).map(([title, description, earned]) => `<div class="design-milestone-item ${earned ? "is-earned" : "is-locked"}"><span class="design-milestone ${earned ? "mint" : "locked"}">${earned ? "✓" : "·"}</span><b>${title}</b><small>${earned ? "Earned" : description}</small></div>`).join("");
  target.classList.toggle("is-compact", compact);
}

function renderDesignDashboard() {
  if (!lessons.length) return;
  const summary = getDesignProgressSummary();
  const ordered = [...lessons].sort((a, b) => a.day - b.day);
  const recommended = ordered.find((lesson) => getDesignLessonStats(lesson).percent < 100) || ordered[0];
  $("#designDailyStreak").textContent = `${summary.streak} Days`;
  $("#designSentencesStudied").textContent = `${summary.answered} Sentences`;
  $("#designAccuracy").textContent = `${summary.coverage}% Coverage`;
  const headerDate = $("#designTodayLabel");
  if (headerDate) headerDate.textContent = `${today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · Ready for your daily English challenge?`;
  renderDesignMilestones($("#designDashboardMilestones"), summary, true);
  if (recommended) {
    const stats = getDesignLessonStats(recommended);
    $("#designRecommendedTitle").textContent = getDesignLessonTitle(recommended);
    $("#designRecommendedDescription").textContent = `Day ${recommended.day} · ${recommended.category || recommended.topic}`;
    $("#designRecommendedLevel").textContent = stats.answered ? "In progress" : (recommended.level || "Intermediate");
    $("#designRecommendedSentences").textContent = `${stats.total} sentences · ${stats.percent}% complete`;
    $("#designRecommendedTime").textContent = `~${Math.max(10, stats.total * 2)} min session`;
    $("#designStartStudy").dataset.lessonDay = String(recommended.day);
    $("#designVocabularyList").innerHTML = getDesignVocabulary(recommended).map((term) => `<li><strong>${escapeHtml(term)}</strong></li>`).join("");
  }
  const chart = $("#designWeeklyChart");
  if (chart) chart.innerHTML = Array.from({ length: 7 }, (_, index) => {
    const day = dateFromKey(todayKey);
    day.setDate(day.getDate() - (6 - index));
    const minutes = Math.round(Number(studyTimeByDate[dateKey(day)] || 0) / 60);
    return `<div class="${dateKey(day) === todayKey ? "today" : ""}" style="--h:${minutes ? Math.min(100, Math.max(8, minutes * 5)) : 3}%" title="${minutes} minutes"><i></i><span>${day.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1)}</span></div>`;
  }).join("");
  const topicList = $("#designTopicList");
  if (topicList) {
    topicList.innerHTML = ordered.map((lesson) => {
      const stats = getDesignLessonStats(lesson);
      return `<button class="design-topic-item${lesson.id === activeLesson?.id ? " is-current" : ""}" type="button" data-lesson-day="${lesson.day}"><span class="design-topic-day">DAY ${lesson.day}</span><strong>${escapeHtml(getDesignLessonTitle(lesson))}</strong><span class="design-topic-progress">${stats.percent}% complete</span></button>`;
    }).join("");
    topicList.querySelectorAll("[data-lesson-day]").forEach((item) => item.addEventListener("click", () => openDesignLesson(Number(item.dataset.lessonDay))));
  }
}

function renderDesignCalendar() {
  const grid = $("#designCalendarGrid");
  if (!grid || !lessons.length) return;
  const cursor = dateFromKey(designCalendarSelectedDate);
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  $("#designCalendarTitle").textContent = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const cells = [];
  for (let i = 0; i < firstDayOffset; i += 1) cells.push('<span class="design-calendar-day muted"></span>');
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${year}-${pad(month + 1)}-${pad(day)}`;
    const lesson = lessonForDate(key);
    const stats = lesson ? getDesignLessonStats(lesson) : null;
    const minutes = Math.round(Number(studyTimeByDate[key] || 0) / 60);
    const score = stats?.answered ? `${stats.percent}%` : (minutes ? `${minutes}m` : "");
    cells.push(`<button class="design-calendar-day${lesson ? " has-lesson" : ""}${key === designCalendarSelectedDate ? " selected" : ""}${key === todayKey ? " today" : ""}" type="button" data-design-date="${key}"><span class="design-calendar-number">${day}</span>${score ? `<span class="design-calendar-score">${score}</span>` : ""}</button>`);
  }
  grid.innerHTML = cells.join("");
  grid.querySelectorAll("[data-design-date]").forEach((button) => button.addEventListener("click", () => { designCalendarSelectedDate = button.dataset.designDate; renderDesignCalendar(); }));
  const selectedLesson = lessonForDate(designCalendarSelectedDate);
  const selectedStats = selectedLesson ? getDesignLessonStats(selectedLesson) : { answered: 0, coverage: 0 };
  $("#designCalendarSelectedLabel").textContent = dateFromKey(designCalendarSelectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  $("#designCalendarCompletedLessons").innerHTML = selectedLesson && selectedStats.percent === 100 ? `<li>${escapeHtml(getDesignLessonTitle(selectedLesson))}</li>` : "<li>No completed lesson</li>";
  $("#designCalendarDetailSentences").textContent = `${selectedStats.answered} sentences`;
  $("#designCalendarDetailAccuracy").textContent = `${selectedStats.coverage}%`;
  $("#designCalendarDetailTime").textContent = `${Math.round(Number(studyTimeByDate[designCalendarSelectedDate] || 0) / 60)} min`;
  const monthKeys = Array.from({ length: daysInMonth }, (_, index) => dateKey(new Date(year, month, index + 1)));
  const activeDays = monthKeys.filter((key) => Number(studyTimeByDate[key] || 0) > 0 || completionByDate[key]).length;
  const monthStats = monthKeys.map(lessonForDate).filter(Boolean).map(getDesignLessonStats);
  const answered = monthStats.reduce((sum, stats) => sum + stats.answered, 0);
  const samples = monthStats.filter((stats) => stats.answered);
  const coverage = samples.length ? Math.round(samples.reduce((sum, stats) => sum + stats.coverage, 0) / samples.length) : 0;
  $("#designCalendarStudyDays").textContent = `${activeDays} active days`;
  $("#designCalendarSentences").textContent = `${answered} sentences`;
  $("#designCalendarAccuracy").textContent = `${coverage}%`;
}

function renderDesignProgress() {
  if (!lessons.length) return;
  const summary = getDesignProgressSummary();
  $("#designProgressTotal").textContent = String(summary.answered);
  $("#designProgressTotalNote").textContent = `${summary.answered} / ${summary.available} studied`;
  $("#designProgressAccuracy").textContent = `${summary.coverage}%`;
  $("#designProgressAccuracyNote").textContent = summary.answered ? "Based on key meaning coverage" : "Answer a sentence to begin";
  $("#designProgressStreak").textContent = `${summary.streak} Days`;
  $("#designProgressStreakNote").textContent = `${summary.completedLessons} lessons completed`;
  $("#designProgressTime").textContent = `${summary.minutes} min`;
  $("#designProgressTimeNote").textContent = "Active Study time";
  const dailyBars = $("#designDailyBars");
  if (dailyBars) {
    const values = Array.from({ length: 7 }, (_, index) => {
      const day = dateFromKey(todayKey);
      day.setDate(day.getDate() - (6 - index));
      const lesson = lessonForDate(dateKey(day));
      return { label: day.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1), value: lesson ? getDesignLessonStats(lesson).answered : 0 };
    });
    const max = Math.max(1, ...values.map((item) => item.value));
    dailyBars.innerHTML = values.map((item) => `<div style="--h:${item.value ? Math.max(8, Math.round((item.value / max) * 100)) : 3}%"><i></i><span>${item.label}</span></div>`).join("");
  }
  const weakList = $("#designWeakList");
  if (weakList) {
    const missed = new Map();
    lessons.forEach((lesson) => lesson.sentences.forEach((sentence, index) => {
      const answer = String(getLessonAnswers(lesson)[index] || "").trim();
      if (!answer) return;
      analyzeAnswer(sentence, answer).issues.forEach((issue) => missed.set(issue, (missed.get(issue) || 0) + 1));
    }));
    const weakItems = [...missed.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    weakList.innerHTML = weakItems.length ? weakItems.map(([label, count]) => `<div class="design-weak-item"><div><strong>${escapeHtml(label)}</strong><span>Review this structure in Study</span></div><b>Missed ${count} time${count === 1 ? "" : "s"}</b></div>`).join("") : '<p class="design-progress-empty">No missed areas yet. Complete a sentence to generate feedback.</p>';
  }
  renderDesignMilestones($("#designMilestones"), summary);
}

function openDesignLesson(day) {
  const lesson = lessons.find((item) => item.day === day);
  if (!lesson) return;
  stopStudyTimer();
  activeLesson = lesson;
  state.activeDate = lessonDate(lesson);
  state.current = 0;
  state.revealed = false;
  state.answers = loadStudyProgress(lesson);
  renderLessonHeader();
  renderStudy();
  renderReading();
  loadTtsForLesson();
  returnToStudy();
}

const designPanels = [...document.querySelectorAll("[data-design-panel]")];
const designNavItems = [...document.querySelectorAll("[data-design-screen]")];
const designWorkspace = $("#designWorkspace");
const studyWorkspace = $("#studyWorkspace");

function openDesignScreen(name) {
  const panel = document.querySelector(`[data-design-panel="${name}"]`);
  if (!panel) return;
  stopStudyTimer();
  if (studyWorkspace) studyWorkspace.hidden = true;
  if (designWorkspace) designWorkspace.hidden = false;
  designPanels.forEach((item) => item.classList.toggle("is-visible", item === panel));
  designNavItems.forEach((item) => item.classList.toggle("is-active", item.dataset.designScreen === name));
  if (name === "calendar") renderDesignCalendar();
  if (name === "progress") renderDesignProgress();
  window.location.hash = name;
}

function returnToStudy() {
  if (designWorkspace) designWorkspace.hidden = true;
  if (studyWorkspace) studyWorkspace.hidden = false;
  designNavItems.forEach((item) => item.classList.remove("is-active"));
  window.location.hash = "study";
  startStudyTimer();
}

function bindEvents() {
  $("#lessonAudio")?.addEventListener("timeupdate", updateTtsHighlight);
  $("#interpretationInput")?.addEventListener("input", (event) => {
    const wasComplete = Boolean((state.answers[state.current] || "").trim());
    state.answers[state.current] = event.target.value;
    $("#characterCount").textContent = `${event.target.value.length} chars`;
    if (wasComplete !== Boolean(event.target.value.trim())) renderNavigation();
    renderProgress();
    $("#sentenceStatus").textContent = event.target.value.trim() ? "Complete" : "In progress";
    $("#sentenceStatus").classList.toggle("is-complete", Boolean(event.target.value.trim()));
    if (state.revealed) $("#reviewFeedback").innerHTML = renderFeedback(currentSentences()[state.current], event.target.value);
    window.clearTimeout(saveAnswersTimer);
    saveAnswersTimer = window.setTimeout(() => { saveAnswersTimer = null; saveStudyProgress(); }, 250);
  });
  $("#interpretationInput")?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    state.answers[state.current] = event.currentTarget.value;
    window.clearTimeout(saveAnswersTimer);
    saveAnswersTimer = null;
    saveStudyProgress();
    if (state.current < currentSentences().length - 1) { state.current += 1; state.revealed = false; renderStudy(); $("#interpretationInput").focus(); }
    else showView("review");
  });
  $("#revealButton")?.addEventListener("click", () => { state.revealed = !state.revealed; $("#answerPreview").hidden = !state.revealed; $("#revealButton").textContent = state.revealed ? "Hide reference" : "Show reference"; });
  $("#previousButton")?.addEventListener("click", () => { if (state.current > 0) { state.current -= 1; state.revealed = false; renderStudy(); } });
  $("#nextButton")?.addEventListener("click", () => { if (state.current < currentSentences().length - 1) { state.current += 1; state.revealed = false; renderStudy(); } else showView("review"); });
  $("#resetButton")?.addEventListener("click", () => { if (!window.confirm("Clear this lesson's answers?")) return; state.answers = {}; state.current = 0; state.revealed = false; saveStudyProgress(); renderStudy(); showView("study"); });
  $$(".view-tab").forEach((tab) => tab.addEventListener("click", () => showView(tab.dataset.view)));
  designNavItems.forEach((item) => item.addEventListener("click", () => item.dataset.designScreen === "study" ? returnToStudy() : openDesignScreen(item.dataset.designScreen)));
  $("#designStartStudy")?.addEventListener("click", () => openDesignLesson(Number($("#designStartStudy").dataset.lessonDay)));
  $(".brand-mark")?.addEventListener("click", (event) => { event.preventDefault(); openDesignScreen("dashboard"); });
  $("#designPreviousMonth")?.addEventListener("click", () => { const date = dateFromKey(designCalendarSelectedDate); date.setMonth(date.getMonth() - 1); designCalendarSelectedDate = dateKey(date); renderDesignCalendar(); });
  $("#designNextMonth")?.addEventListener("click", () => { const date = dateFromKey(designCalendarSelectedDate); date.setMonth(date.getMonth() + 1); designCalendarSelectedDate = dateKey(date); renderDesignCalendar(); });
}

document.addEventListener("visibilitychange", () => { if (document.hidden) stopStudyTimer(); else startStudyTimer(); });
window.addEventListener("beforeunload", () => { flushPendingAnswerSave(); stopStudyTimer(); });
window.setInterval(() => { if (!document.hidden && !studyTimerStartedAt) startStudyTimer(); if (studyTimerStartedAt) flushStudyTimer(); }, 15000);

bindEvents();
loadLessons().then(() => {
  const initialScreen = window.location.hash.slice(1);
  if (initialScreen.startsWith("lesson=")) {
    const lesson = lessons.find((item) => item.id === decodeURIComponent(initialScreen.slice("lesson=".length)));
    if (lesson) openDesignLesson(lesson.day);
    else openDesignScreen("dashboard");
  } else if (initialScreen === "study") returnToStudy();
  else openDesignScreen(["calendar", "progress"].includes(initialScreen) ? initialScreen : "dashboard");
}).catch((error) => {
  console.error(error);
  if ($("#saveStatus")) $("#saveStatus").textContent = "Connect the UI through FastAPI to load lessons";
});
