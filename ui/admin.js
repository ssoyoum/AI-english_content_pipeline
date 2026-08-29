const $ = (selector) => document.querySelector(selector);
const draftStorageKey = "english-content-pipeline-admin-draft-v1";
let draftState = null;

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function formPayload() {
  return {
    topic: $("#topic").value.trim(),
    level: $("#level").value,
    sentence_count: Number($("#sentenceCount").value),
    category: $("#category").value.trim(),
    learning_goal: $("#learningGoal").value.trim() || null,
    tone: $("#tone").value.trim() || null,
    target_vocabulary: $("#targetVocabulary").value.trim() || null,
    sample: $("#useSample").checked
  };
}

async function postJson(url, body) {
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body) });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.detail || `${response.status} ${response.statusText}`);
  return payload;
}

function setStatus(target, message, error = false) {
  target.textContent = message;
  target.dataset.error = error ? "true" : "false";
}

function checkDraft(content) {
  const sentences = content.sentence_interpretations || [];
  const allTranslations = sentences.every((item) => String(item.translation || "").trim());
  const allKeywords = sentences.every((item) => Array.isArray(item.focus_terms) && item.focus_terms.length);
  const longSentences = sentences.filter((item) => String(item.sentence || "").length > 180).length;
  return `<span class="check-item">✓ ${sentences.length} sentences</span><span class="check-item ${allTranslations ? "" : "warn"}">${allTranslations ? "✓" : "!"} Reference translations ${allTranslations ? "present" : "missing"}</span><span class="check-item ${allKeywords ? "" : "warn"}">${allKeywords ? "✓" : "!"} Keywords ${allKeywords ? "present" : "missing"}</span>${longSentences ? `<span class="check-item warn">! ${longSentences} long sentence${longSentences === 1 ? "" : "s"}</span>` : ""}`;
}

function renderDraft(payload) {
  draftState = { ...payload, content: JSON.parse(JSON.stringify(payload.content)) };
  const content = draftState.content;
  $("#previewCard").hidden = false;
  $("#draftTitle").value = content.title || draftState.metadata.title;
  $("#draftLevel").textContent = draftState.metadata.level;
  $("#draftCategory").textContent = draftState.metadata.category;
  $("#draftSentenceCount").textContent = String(content.sentence_interpretations.length);
  $("#draftStatus").textContent = draftState.metadata.source === "local sample" ? "Local sample · review" : "LLM draft · review";
  $("#contentCheck").innerHTML = checkDraft(content);
  $("#sentenceEditor").innerHTML = content.sentence_interpretations.map((item, index) => `<article class="sentence-block" data-index="${index}"><h3><span>Sentence ${String(index + 1).padStart(2, "0")}</span><span>${escapeHtml(item.subheading || item.section || "Practice")}</span></h3><label>English sentence<textarea class="sentence-text">${escapeHtml(item.sentence)}</textarea></label><label>Reference translation<textarea>${escapeHtml(item.translation)}</textarea></label><div class="mini-grid"><label>Keywords<input class="sentence-keywords" value="${escapeHtml((item.focus_terms || []).join(", "))}" /></label><label>Learning point<textarea>${escapeHtml(item.learning_note)}</textarea></label></div></article>`).join("");
  setStatus($("#formStatus"), `Draft ${draftState.draft_id} is ready for review.`);
  window.scrollTo({ top: $("#previewCard").offsetTop - 24, behavior: "smooth" });
}

function readEditedDraft() {
  if (!draftState) return null;
  draftState.content.title = $("#draftTitle").value.trim();
  document.querySelectorAll(".sentence-block").forEach((block) => {
    const index = Number(block.dataset.index);
    const item = draftState.content.sentence_interpretations[index];
    const fields = block.querySelectorAll("textarea, input");
    item.sentence = fields[0].value.trim();
    item.translation = fields[1].value.trim();
    item.focus_terms = fields[2].value.split(",").map((term) => term.trim()).filter(Boolean);
    item.learning_note = fields[3].value.trim();
  });
  draftState.content.article = draftState.content.sentence_interpretations.reduce((groups, item) => {
    const current = groups[groups.length - 1];
    if (!current || current.heading !== item.section) groups.push({ heading: item.section || "READING PRACTICE", paragraph: item.sentence });
    else current.paragraph += ` ${item.sentence}`;
    return groups;
  }, []);
  draftState.content.audio_script = draftState.content.sentence_interpretations.map((item) => item.sentence).join(" ");
  return draftState;
}

$("#lessonForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = $("#generateButton");
  button.disabled = true;
  button.textContent = "Generating…";
  setStatus($("#formStatus"), "Creating a structured draft…");
  try {
    renderDraft(await postJson("/api/admin/lessons/generate", formPayload()));
  } catch (error) {
    setStatus($("#formStatus"), error.message, true);
  } finally {
    button.disabled = false;
    button.textContent = "Generate Draft";
  }
});

$("#regenerateButton").addEventListener("click", () => $("#lessonForm").requestSubmit());
$("#saveDraftButton").addEventListener("click", () => {
  if (!draftState) return;
  localStorage.setItem(draftStorageKey, JSON.stringify(readEditedDraft()));
  setStatus($("#publishStatus"), "Draft saved in this browser.");
});
$("#restoreButton").addEventListener("click", () => {
  try {
    const saved = JSON.parse(localStorage.getItem(draftStorageKey) || "null");
    if (!saved?.content) throw new Error("No saved draft found.");
    renderDraft(saved);
    setStatus($("#formStatus"), "Saved draft restored.");
  } catch (error) {
    setStatus($("#formStatus"), error.message, true);
  }
});

$("#publishButton").addEventListener("click", async () => {
  if (!draftState) return;
  const edited = readEditedDraft();
  const button = $("#publishButton");
  button.disabled = true;
  setStatus($("#publishStatus"), "Validating and publishing…");
  try {
    const form = formPayload();
    const result = await postJson("/api/admin/lessons/publish", { draft_id: edited.draft_id, content: edited.content, topic: form.topic, title: edited.content.title || form.topic, level: form.level, category: form.category, generate_tts: $("#generateTts").checked });
    $("#publishResult").hidden = false;
    $("#publishResult").innerHTML = `<h2>Lesson published successfully.</h2><p>${escapeHtml(result.title)} · ${escapeHtml(result.level)} · ${result.sentence_count} sentences</p><div class="publish-links"><a href="${escapeHtml(result.lesson_url)}">Open lesson</a><a href="/admin">Create another lesson</a></div>${result.warnings?.length ? `<p>${escapeHtml(result.warnings.join(" "))}</p>` : ""}`;
    setStatus($("#publishStatus"), `Published as ${result.lesson_id}.`);
    localStorage.removeItem(draftStorageKey);
  } catch (error) {
    setStatus($("#publishStatus"), error.message, true);
  } finally {
    button.disabled = false;
  }
});
