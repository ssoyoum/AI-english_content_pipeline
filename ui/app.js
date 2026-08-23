const sentences = [
  {
    section: "INTRODUCTION",
    text: "Climate change is no longer a distant threat—it is a present reality that affects ecosystems, communities, and the availability of vital resources.",
    translation: "기후 변화는 더 이상 먼 미래의 위협이 아니다. 기후 변화는 생태계와 공동체, 그리고 필수 자원의 이용 가능성에 영향을 미치는 현재의 현실이다.",
    learningNote: "no longer A는 ‘더 이상 A가 아니다’라는 뜻입니다.",
    concepts: [
      { label: "현재 일어나고 있는 문제", keywords: ["현재", "현실", "지금", "오늘"], warnings: ["미래", "언젠가"], note: "present reality는 먼 미래가 아니라 지금 실제로 일어나고 있다는 뜻입니다." },
      { label: "영향을 받는 대상", keywords: ["생태계", "공동체", "자원"], warnings: [], note: "affects 뒤에는 생태계, 공동체, 필수 자원이 병렬로 연결됩니다." }
    ]
  },
  {
    section: "INTRODUCTION",
    text: "Among the most critical of these resources is water.",
    translation: "이러한 자원 중 가장 중요한 것 가운데 하나가 물이다.",
    learningNote: "Among the most critical of these resources is water는 ‘이 자원들 중 가장 중요한 것은 물이다’라는 도치 표현입니다.",
    concepts: [
      { label: "물의 중요성", keywords: ["물"], warnings: [], note: "문장의 핵심 주어는 water입니다." },
      { label: "가장 중요한 자원 중 하나", keywords: ["가장", "중요", "자원"], warnings: [], note: "Among ~는 여러 자원 가운데 하나를 고르는 표현입니다." }
    ]
  },
  {
    section: "CHANGING RAINFALL PATTERNS",
    text: "Over the past few decades, scientists have observed shifts in rainfall distribution around the world.",
    translation: "지난 수십 년 동안 과학자들은 전 세계적으로 강우 분포가 변하는 현상을 관찰해왔다.",
    learningNote: "have observed는 과거부터 현재까지 관찰해왔다는 현재완료 표현입니다.",
    concepts: [
      { label: "지난 수십 년 동안", keywords: ["지난", "수십", "몇십", "몇 십", "기간"], warnings: [], note: "Over the past few decades는 최근 수십 년에 걸친 기간을 뜻합니다." },
      { label: "강우 분포의 변화", keywords: ["강우", "강수", "비", "분포", "변화", "이동"], warnings: [], note: "shifts in rainfall distribution은 비가 내리는 지역과 양상이 변했다는 의미입니다." }
    ]
  },
  {
    section: "CHANGING RAINFALL PATTERNS",
    text: "Some regions are experiencing prolonged droughts, while others face intense flooding.",
    translation: "일부 지역은 장기간의 가뭄을 겪고 있는 반면, 다른 지역은 극심한 홍수에 직면하고 있다.",
    learningNote: "while은 두 지역의 서로 다른 상황을 대조합니다.",
    concepts: [
      { label: "일부 지역의 장기 가뭄", keywords: ["일부", "지역", "장기", "장기간", "가뭄"], warnings: [], note: "prolonged droughts는 오랫동안 이어지는 가뭄입니다." },
      { label: "다른 지역의 극심한 홍수", keywords: ["다른", "지역", "극심", "심한", "홍수"], warnings: [], note: "intense flooding은 강도가 매우 큰 홍수를 뜻합니다." }
    ]
  },
  {
    section: "CHANGING RAINFALL PATTERNS",
    text: "These changes disrupt the natural cycle of water, making it difficult to manage reservoirs, irrigation systems, and urban water supplies.",
    translation: "이러한 변화는 물의 자연 순환을 방해하여 저수지, 관개 시스템, 도시의 물 공급을 관리하기 어렵게 만든다.",
    learningNote: "making it difficult to manage는 물 관리가 어려워지는 결과를 설명합니다.",
    concepts: [
      { label: "물의 자연 순환 방해", keywords: ["자연", "순환", "물", "방해", "깨뜨"], warnings: [], note: "These changes는 앞 문장의 강우 패턴 변화를 가리킵니다." },
      { label: "관리하기 어려워짐", keywords: ["어렵", "관리", "저수지", "관개", "공급"], warnings: [], note: "making it difficult to는 ‘~하기 어렵게 만들다’라는 결과 표현입니다." }
    ]
  },
  {
    section: "MELTING GLACIERS AND SNOWPACKS",
    text: "In many mountainous regions, glaciers and snowpacks serve as natural water towers, slowly releasing water into rivers and streams.",
    translation: "많은 산악 지역에서 빙하와 적설은 자연적인 물 저장고 역할을 하며, 강과 하천에 물을 천천히 방출한다.",
    learningNote: "serve as는 ‘~의 역할을 하다’, slowly releasing은 물을 방출하면서 역할을 한다는 뜻입니다.",
    concepts: [
      { label: "빙하와 적설", keywords: ["빙하", "눈", "적설", "설원"], warnings: [], note: "snowpacks는 산에 쌓인 눈과 눈 저장량을 가리킵니다." },
      { label: "자연적인 물 저장고 역할", keywords: ["저장", "물 저장", "물탑", "물 저장고", "역할"], warnings: [], note: "natural water towers는 물을 저장했다가 천천히 공급한다는 비유입니다." },
      { label: "강과 하천에 천천히 방출", keywords: ["강", "하천", "천천히", "방출", "흘려"], warnings: [], note: "slowly releasing은 물을 강과 하천으로 조금씩 보낸다는 의미입니다." }
    ]
  },
  {
    section: "MELTING GLACIERS AND SNOWPACKS",
    text: "However, due to global warming, these ice reserves are shrinking at an alarming rate.",
    translation: "그러나 지구 온난화로 인해 이러한 얼음 저장량은 우려스러운 속도로 줄어들고 있다.",
    learningNote: "due to는 원인을, at an alarming rate는 매우 걱정스러운 속도를 나타냅니다.",
    concepts: [
      { label: "지구 온난화가 원인", keywords: ["지구", "온난화", "기후", "더워"], warnings: [], note: "due to global warming은 빙하 감소의 원인을 설명합니다." },
      { label: "얼음 저장량이 빠르게 감소", keywords: ["얼음", "빙하", "저장", "줄", "감소", "사라"], warnings: [], note: "are shrinking은 현재 진행 중인 감소를 의미합니다." }
    ]
  },
  {
    section: "RISING TEMPERATURES",
    text: "Higher temperatures increase the rate of evaporation from lakes, rivers, and soil.",
    translation: "기온이 높아지면 호수, 강, 토양에서 물이 증발하는 속도가 빨라진다.",
    learningNote: "increase the rate of evaporation은 증발 속도가 빨라진다는 인과관계를 보여줍니다.",
    concepts: [
      { label: "기온 상승", keywords: ["기온", "온도", "더운", "높아"], warnings: [], note: "Higher temperatures가 문장의 원인입니다." },
      { label: "호수·강·토양에서 증발 증가", keywords: ["호수", "강", "토양", "증발", "빠르"], warnings: [], note: "from은 증발이 일어나는 장소를 나타냅니다." }
    ]
  },
  {
    section: "RISING TEMPERATURES",
    text: "This means that even if rainfall levels remain the same, the net water availability decreases.",
    translation: "이는 강우량이 동일하게 유지되더라도 실제로 이용할 수 있는 물의 양은 줄어든다는 의미이다.",
    learningNote: "even if는 ‘~일지라도’라는 조건을 만들며, 비가 같아도 실제 물의 양은 줄 수 있음을 강조합니다.",
    concepts: [
      { label: "강우량이 같아도", keywords: ["강우", "강수", "비", "같", "동일"], warnings: [], note: "even if rainfall levels remain the same은 비가 그대로라는 가정입니다." },
      { label: "실제로 이용 가능한 물은 감소", keywords: ["실제", "이용", "사용", "가능", "물", "줄", "감소"], warnings: ["증가", "늘"], note: "net water availability는 증발을 고려한 실제 물의 가용량입니다." }
    ]
  },
  {
    section: "WATER QUALITY ISSUES",
    text: "Not only is the quantity of water affected, but also its quality.",
    translation: "영향을 받는 것은 물의 양뿐만 아니라 수질도 마찬가지이다.",
    learningNote: "Not only A but also B 도치 구문으로, 물의 양과 수질 모두 영향을 받는다는 뜻입니다.",
    concepts: [
      { label: "물의 양", keywords: ["양", "수량", "물"], warnings: [], note: "quantity는 물의 양을 의미합니다." },
      { label: "물의 질 또는 수질", keywords: ["질", "수질", "깨끗", "오염"], warnings: [], note: "quality는 이 문맥에서 물의 질, 즉 수질입니다." },
      { label: "둘 다 영향을 받음", keywords: ["둘", "모두", "뿐만 아니라", "영향", "받"], warnings: [], note: "Not only A but also B는 A뿐만 아니라 B도라는 강조 표현입니다." }
    ]
  }
];

const dayTwoSentences = [
  {
    section: "THE VALUE OF REST",
    text: "Rest is not a reward for finishing everything; it is part of the process that helps us do meaningful work.",
    translation: "휴식은 모든 일을 끝낸 뒤 받는 보상이 아니라, 의미 있는 일을 할 수 있도록 돕는 과정의 일부이다.",
    learningNote: "not A; it is B는 ‘A가 아니라 B이다’라는 대조 구조입니다.",
    focusTerms: ["not a reward", "part of the process", "meaningful work"],
    concepts: [
      { label: "휴식은 보상이 아님", keywords: ["휴식", "보상", "아니"], warnings: ["보상이다"], note: "not a reward는 휴식을 보상으로 보지 않는다는 뜻입니다." },
      { label: "의미 있는 일을 돕는 과정의 일부", keywords: ["과정", "일부", "돕", "의미", "일"], warnings: [], note: "part of the process는 전체 과정에 포함된 요소라는 의미입니다." }
    ]
  },
  {
    section: "A SUSTAINABLE ROUTINE",
    text: "A sustainable routine gives people enough space to focus, recover, and return with more energy.",
    translation: "지속 가능한 생활 방식은 사람들이 집중하고 회복한 뒤 더 많은 에너지를 가지고 돌아올 충분한 여유를 준다.",
    learningNote: "enough space to + 동사는 ‘~할 충분한 여유’를 뜻합니다.",
    focusTerms: ["sustainable routine", "enough space", "focus", "recover", "more energy"],
    concepts: [
      { label: "지속 가능한 루틴", keywords: ["지속", "꾸준", "생활", "루틴", "방식"], warnings: [], note: "sustainable은 오래 유지할 수 있다는 의미입니다." },
      { label: "집중하고 회복할 여유", keywords: ["집중", "회복", "여유", "시간", "공간"], warnings: [], note: "space는 물리적 공간이 아니라 시간적·정신적 여유를 의미합니다." }
    ]
  },
  {
    section: "A SMALL CHANGE",
    text: "Even a small change in our daily habits can improve the way we feel and work.",
    translation: "일상 습관의 작은 변화만으로도 우리가 느끼고 일하는 방식이 좋아질 수 있다.",
    learningNote: "Even a small change는 작은 변화도 충분히 효과를 낼 수 있다는 강조입니다.",
    focusTerms: ["Even a small change", "daily habits", "improve", "the way we feel and work"],
    concepts: [
      { label: "작은 변화도 가능함", keywords: ["작은", "변화", "조금", "습관"], warnings: [], note: "Even은 작은 변화라도 의미가 있다는 점을 강조합니다." },
      { label: "느끼고 일하는 방식의 개선", keywords: ["느끼", "일하", "방식", "개선", "좋아", "나아"], warnings: [], note: "the way + 주어 + 동사는 ‘~하는 방식’을 뜻합니다." }
    ]
  }
];

const lessons = [
  {
    day: 1,
    tag: "READING · CLIMATE",
    title: "Climate Change<br />and Water",
    description: "기후 변화가 물의 양과 수질에 미치는 영향을 읽고 이해합니다.",
    sentences
  },
  {
    day: 2,
    tag: "READING · WELLBEING",
    title: "The Value of<br />Rest",
    description: "휴식과 지속 가능한 루틴이 학습과 일에 미치는 영향을 읽고 이해합니다.",
    sentences: dayTwoSentences
  }
];

const storageKey = "english-content-pipeline-study-v1";
const answersStorageKey = `${storageKey}-answers`;
const completionStorageKey = `${storageKey}-completion`;
const legacyAnswers = JSON.parse(localStorage.getItem(storageKey) || "{}");
const savedAnswers = JSON.parse(localStorage.getItem(answersStorageKey) || "{}");
if (!savedAnswers[1] && Object.keys(legacyAnswers).length) savedAnswers[1] = legacyAnswers;
const completionByDate = JSON.parse(localStorage.getItem(completionStorageKey) || "{}");

const pad = (value) => String(value).padStart(2, "0");
const dateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const today = new Date();
const todayKey = dateKey(today);
const courseStartKey = `${storageKey}-start-date`;
const courseStartDateKey = localStorage.getItem(courseStartKey) || todayKey;
localStorage.setItem(courseStartKey, courseStartDateKey);

function dateFromKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dayDifference(fromKey, toKey) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((dateFromKey(toKey) - dateFromKey(fromKey)) / oneDay);
}

function lessonForDate(key) {
  const day = dayDifference(courseStartDateKey, key) + 1;
  return lessons.find((lesson) => lesson.day === day) || null;
}

let activeLesson = lessonForDate(todayKey) || lessons[0];
const state = {
  current: 0,
  activeDate: todayKey,
  answers: savedAnswers[activeLesson.day] || {},
  revealed: false
};

const currentSentences = () => activeLesson.sentences;

const dayOneFocusTerms = [
  ["present reality", "affects", "availability"],
  ["most critical", "resources", "water"],
  ["past few decades", "observed", "shifts", "rainfall distribution"],
  ["prolonged droughts", "intense flooding"],
  ["disrupt", "natural cycle", "making it difficult"],
  ["natural water towers", "slowly releasing", "rivers", "streams"],
  ["due to global warming", "ice reserves", "shrinking", "alarming rate"],
  ["Higher temperatures", "rate of evaporation", "lakes", "rivers", "soil"],
  ["even if", "rainfall levels", "net water availability", "decreases"],
  ["Not only", "quantity", "but also", "quality"]
];
sentences.forEach((sentence, index) => { sentence.focusTerms = dayOneFocusTerms[index]; });

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function saveAnswers() {
  savedAnswers[activeLesson.day] = state.answers;
  localStorage.setItem(answersStorageKey, JSON.stringify(savedAnswers));
  updateCompletion();
  localStorage.setItem(storageKey, JSON.stringify(state.answers));
  $("#saveStatus").textContent = "자동 저장됨 · 방금 전";
}

function isLessonComplete() {
  return currentSentences().every((_, index) => Boolean((state.answers[index] || "").trim()));
}

function updateCompletion() {
  if (isLessonComplete()) completionByDate[state.activeDate] = true;
  else delete completionByDate[state.activeDate];
  localStorage.setItem(completionStorageKey, JSON.stringify(completionByDate));
  if ($("#calendarPanel")) renderCalendar();
}

function selectDate(key) {
  const lesson = lessonForDate(key);
  if (!lesson) return;
  activeLesson = lesson;
  state.activeDate = key;
  state.current = 0;
  state.revealed = false;
  state.answers = savedAnswers[lesson.day] || {};
  renderLessonHeader();
  renderStudy();
  renderReading();
  renderCalendar();
  showView("study");
}

function renderCalendar() {
  const cursor = dateFromKey(state.activeDate);
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const cells = [];

  for (let index = 0; index < firstDay; index += 1) cells.push("<span class=\"calendar-day\"></span>");
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${year}-${pad(month + 1)}-${pad(day)}`;
    const lesson = lessonForDate(key);
    const isSelected = key === state.activeDate;
    const isToday = key === todayKey;
    const isComplete = Boolean(completionByDate[key]);
    const classes = ["calendar-day"];
    if (lesson) classes.push("has-lesson");
    if (isSelected) classes.push("is-selected");
    if (isToday) classes.push("is-today");
    if (isComplete) classes.push("is-complete");
    const lessonTitle = lesson ? lesson.title.replace(/<br\s*\/?>/gi, " ") : "";
    cells.push(lesson
      ? `<button class="${classes.join(" ")}" data-date="${key}" title="${lessonTitle}" aria-label="${key} · ${lessonTitle}" type="button"><span>${day}</span><span class="calendar-check">${isComplete ? "✓" : ""}</span></button>`
      : `<span class="${classes.join(" ")}"><span>${day}</span><span class="calendar-check"></span></span>`);
  }

  const selectedLesson = lessonForDate(state.activeDate);
  const selectedLabel = selectedLesson ? `${pad(selectedLesson.day)}일차 · ${selectedLesson.title.replace(/<br\s*\/?>/gi, " ")}` : "학습 없음";
  $("#calendarPanel").innerHTML = `<div class="calendar-header">
    <span class="calendar-month">${cursor.toLocaleDateString("ko-KR", { year: "numeric", month: "long" })}</span>
    <span class="calendar-caption">${state.activeDate === todayKey ? "오늘 · " : "선택됨 · "}${selectedLabel}</span>
  </div>
  <div class="calendar-weekdays">${weekdays.map((day) => `<span>${day}</span>`).join("")}</div>
  <div class="calendar-grid">${cells.join("")}</div>`;

  $$(".calendar-day[data-date]").forEach((button) => {
    button.addEventListener("click", () => selectDate(button.dataset.date));
  });
}

function renderLessonHeader() {
  const title = activeLesson.title;
  $("#lessonDay").textContent = `${pad(activeLesson.day)}일차`;
  $("#lessonTag").textContent = activeLesson.tag;
  $("#lessonTitle").innerHTML = title;
  $("#lessonDescription").textContent = activeLesson.description;
}

function renderNavigation() {
  const sentences = currentSentences();
  $("#sentenceNav").innerHTML = sentences.map((sentence, index) => {
    const isComplete = Boolean((state.answers[index] || "").trim());
    return `<button type="button" class="${index === state.current ? "is-active " : ""}${isComplete ? "is-complete" : ""}" data-index="${index}">
      <span class="nav-index">${String(index + 1).padStart(2, "0")}</span>
      <span class="nav-title">${sentence.section.toLowerCase()}</span>
      <span class="nav-check">✓</span>
    </button>`;
  }).join("");

  $$("#sentenceNav button").forEach((button) => {
    button.addEventListener("click", () => {
      state.current = Number(button.dataset.index);
      state.revealed = false;
      renderStudy();
    });
  });
}

function renderProgress() {
  const sentences = currentSentences();
  const completed = sentences.filter((_, index) => Boolean((state.answers[index] || "").trim())).length;
  const percentage = Math.round((completed / sentences.length) * 100);
  $("#progressText").textContent = `${percentage}%`;
  $("#progressBar").style.width = `${percentage}%`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function analyzeAnswer(sentence, answer) {
  const trimmed = answer.trim();
  if (!trimmed) {
    return {
      understood: [],
      issues: ["아직 직접 작성한 해석이 없어 비교할 수 없습니다."],
      learn: [sentence.learningNote]
    };
  }

  const normalized = trimmed.toLowerCase();
  const understood = [];
  const issues = [];
  const learn = [];

  sentence.concepts.forEach((concept) => {
    const found = concept.keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
    const warning = concept.warnings.some((keyword) => normalized.includes(keyword.toLowerCase()));
    if (warning) {
      issues.push(`${concept.label}: 해석에 ‘${concept.warnings.find((keyword) => normalized.includes(keyword.toLowerCase()))}’라는 표현이 있어 의미를 다시 확인해보세요.`);
    } else if (found) {
      understood.push(`${concept.label}: 핵심 의미를 포함했습니다.`);
    } else {
      issues.push(`${concept.label}: 이 의미가 해석에 드러나지 않습니다.`);
    }
    learn.push(concept.note);
  });

  return { understood, issues, learn: [...new Set(learn)] };
}

function renderFeedback(sentence, answer) {
  const feedback = analyzeAnswer(sentence, answer);
  const list = (items, emptyMessage) => items.length
    ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : `<p class="feedback-empty">${escapeHtml(emptyMessage)}</p>`;
  return `<div class="feedback-section is-good">
      <p class="feedback-heading">잘 잡은 의미</p>${list(feedback.understood, "아직 잡힌 핵심 의미가 없습니다.")}
    </div>
    <div class="feedback-section is-warning">
      <p class="feedback-heading">다시 확인할 의미</p>${list(feedback.issues, "현재 해석에서 놓친 핵심 의미가 없습니다.")}
    </div>
    <div class="feedback-section is-learn">
      <p class="feedback-heading">이 문장에서 더 알아둘 것</p>${list(feedback.learn, "추가 학습 내용이 없습니다.")}
    </div>`;
}

function renderReading() {
  const sentences = currentSentences();
  const grouped = sentences.reduce((sections, sentence, index) => {
    const current = sections[sections.length - 1];
    if (!current || current.name !== sentence.section) {
      sections.push({ name: sentence.section, items: [{ sentence, index }] });
    } else {
      current.items.push({ sentence, index });
    }
    return sections;
  }, []);

  $("#readingText").innerHTML = grouped.map((section) => `<section class="reading-section">
    <h4>${escapeHtml(section.name)}</h4>
    <p class="reading-paragraph">${section.items.map(({ sentence, index }) => `<span class="reading-sentence"><span class="reading-number">${String(index + 1).padStart(2, "0")}</span>${highlightOriginal(sentence.text, sentence.focusTerms)} </span>`).join("")}</p>
  </section>`).join("");
}

function highlightOriginal(text, terms = []) {
  if (!terms.length) return escapeHtml(text);
  const escapedTerms = terms
    .slice()
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escapedTerms.join("|")})`, "gi");
  let result = "";
  let lastIndex = 0;
  text.replace(pattern, (match, _group, offset) => {
    result += escapeHtml(text.slice(lastIndex, offset));
    result += `<mark class="important-word">${escapeHtml(match)}</mark>`;
    lastIndex = offset + match.length;
    return match;
  });
  result += escapeHtml(text.slice(lastIndex));
  return result;
}

function renderStudy() {
  const sentences = currentSentences();
  const sentence = sentences[state.current];
  const answer = state.answers[state.current] || "";
  const indexLabel = String(state.current + 1).padStart(2, "0");
  $("#sentenceCounter").textContent = `SENTENCE ${indexLabel} / ${String(sentences.length).padStart(2, "0")}`;
  $("#sectionLabel").textContent = sentence.section;
  $("#sentenceNumber").textContent = indexLabel;
  $("#originalSentence").innerHTML = highlightOriginal(sentence.text, sentence.focusTerms);
  $("#interpretationInput").value = answer;
  $("#characterCount").textContent = `${answer.length}자`;
  $("#correctTranslation").textContent = sentence.translation;
  $("#reviewFeedback").innerHTML = renderFeedback(sentence, answer);
  $("#answerPreview").hidden = !state.revealed;
  $("#revealButton").textContent = state.revealed ? "올바른 해석 숨기기" : "올바른 해석 보기";
  $("#previousButton").disabled = state.current === 0;
  $("#nextButton").textContent = state.current === sentences.length - 1 ? "Review 보기 →" : "다음 문장 →";
  const status = $("#sentenceStatus");
  status.textContent = answer.trim() ? "작성 완료" : "작성 전";
  status.classList.toggle("is-complete", Boolean(answer.trim()));
  renderNavigation();
  renderProgress();
}

function renderReview() {
  const sentences = currentSentences();
  $("#reviewList").innerHTML = sentences.map((sentence, index) => {
    const answer = (state.answers[index] || "").trim();
    return `<article class="review-item">
      <div class="review-item-header">
        <span class="review-item-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="review-item-status">${answer ? "내 해석 작성 완료" : "내 해석을 아직 작성하지 않음"}</span>
      </div>
      <div class="review-row review-original"><p class="review-row-label">원문</p><p>${highlightOriginal(sentence.text, sentence.focusTerms)}</p></div>
      <div class="review-row"><p class="review-row-label">내 해석</p><p>${escapeHtml(answer || "아직 입력하지 않았습니다.")}</p></div>
      <div class="review-row"><p class="review-row-label">올바른 해석</p><p>${escapeHtml(sentence.translation)}</p></div>
      <div class="review-row review-key"><p class="review-row-label">이 문장, 이렇게 이해했나요?</p>${renderFeedback(sentence, answer)}</div>
    </article>`;
  }).join("");
}

function showView(view) {
  const isStudy = view === "study";
  const isReading = view === "reading";
  $("#studyView").hidden = !isStudy;
  $("#readingView").hidden = !isReading;
  $("#reviewView").hidden = view !== "review";
  $$(".view-tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === view));
  if (isReading) renderReading();
  if (view === "review") renderReview();
}

$("#interpretationInput").addEventListener("input", (event) => {
  state.answers[state.current] = event.target.value;
  $("#characterCount").textContent = `${event.target.value.length}자`;
  saveAnswers();
  renderNavigation();
  renderProgress();
  const status = $("#sentenceStatus");
  status.textContent = event.target.value.trim() ? "작성 완료" : "작성 전";
  status.classList.toggle("is-complete", Boolean(event.target.value.trim()));
  if (state.revealed) $("#reviewFeedback").innerHTML = renderFeedback(currentSentences()[state.current], event.target.value);
});

$("#interpretationInput").addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.shiftKey) return;
  event.preventDefault();
  state.answers[state.current] = event.currentTarget.value;
  state.revealed = true;
  saveAnswers();
  renderStudy();
});

$("#revealButton").addEventListener("click", () => {
  state.revealed = !state.revealed;
  $("#answerPreview").hidden = !state.revealed;
  $("#revealButton").textContent = state.revealed ? "올바른 해석 숨기기" : "올바른 해석 보기";
});

$("#previousButton").addEventListener("click", () => {
  if (state.current > 0) { state.current -= 1; state.revealed = false; renderStudy(); }
});

$("#nextButton").addEventListener("click", () => {
  if (state.current < currentSentences().length - 1) {
    state.current += 1;
    state.revealed = false;
    renderStudy();
  } else {
    showView("review");
  }
});

$("#resetButton").addEventListener("click", () => {
  if (!window.confirm("작성한 해석을 모두 지울까요?")) return;
  state.answers = {};
  state.current = 0;
  state.revealed = false;
  saveAnswers();
  renderStudy();
  showView("study");
});

$$('.view-tab').forEach((tab) => tab.addEventListener("click", () => showView(tab.dataset.view)));

renderStudy();
renderReading();
renderLessonHeader();
renderCalendar();
