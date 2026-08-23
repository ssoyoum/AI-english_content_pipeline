"""Create a self-contained browser study page from a content package."""

from __future__ import annotations

import html
import json
import re
from pathlib import Path
from typing import Any


def _escape(value: str) -> str:
    return html.escape(value, quote=True)


def _slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-") or "study"


def _highlight_sentence(sentence: str, focus_terms: list[str]) -> str:
    """Highlight meaningful focus terms while safely escaping the sentence."""

    terms = sorted(
        {
            term.strip()
            for term in focus_terms
            if isinstance(term, str) and (len(term.strip()) >= 4 or " " in term.strip())
        },
        key=len,
        reverse=True,
    )
    if not terms:
        return _escape(sentence)

    pattern = re.compile(
        r"(?<![A-Za-z])(?:" + "|".join(re.escape(term) for term in terms) + r")(?![A-Za-z])",
        re.IGNORECASE,
    )
    chunks: list[str] = []
    cursor = 0
    for match in pattern.finditer(sentence):
        chunks.append(_escape(sentence[cursor : match.start()]))
        chunks.append(f"<span class='focus-word'>{_escape(match.group(0))}</span>")
        cursor = match.end()
    chunks.append(_escape(sentence[cursor:]))
    return "".join(chunks)


def build_learning_html(
    content: dict[str, Any],
    audio_filename: str | None = None,
    review_url: str | None = None,
    content_reference: str | None = None,
    lesson_day: int = 1,
    lesson_days: list[int] | None = None,
    lesson_base_url: str = "/lessons",
) -> str:
    article_html = "\n".join(
        f"<section class='article-section'><h3>{_escape(section['heading'])}</h3>"
        f"<p>{_escape(section['paragraph'])}</p></section>"
        for section in content["article"]
    )

    sentence_cards = []
    for index, item in enumerate(content["sentence_interpretations"], start=1):
        focus_terms = ", ".join(item["focus_terms"])
        sentence_cards.append(
            f"""<article class='sentence-card' data-index='{index}'>
  <div class='sentence-label'>SENTENCE {index:02d}</div>
  <p class='english-sentence'>{_highlight_sentence(item['sentence'], item['focus_terms'])}</p>
  <label for='interpretation-{index}'>My Interpretation</label>
  <textarea id='interpretation-{index}' placeholder='Write your Korean interpretation here...'></textarea>
  <button class='review-button' type='button'>Review my interpretation</button>
  <div class='review-panel' hidden>
    <div class='dynamic-review' aria-live='polite'></div>
    <h4>Corrected Interpretation</h4>
    <p>{_escape(item['translation'])}</p>
    <h4>Key Point</h4>
    <p>{_escape(item['learning_note'])}</p>
    <p class='focus-terms'><strong>Focus terms:</strong> {_escape(focus_terms)}</p>
  </div>
</article>"""
        )

    questions_html = "\n".join(
        f"<li><strong>{_escape(item['question'])}</strong>"
        f"<p>{_escape(item['sample_answer'])}</p></li>"
        for item in content["conversation_questions"]
    )
    audio_html = ""
    if audio_filename:
        audio_html = f"""<section class='audio-panel'>
  <h2>Audio Practice</h2>
  <audio controls preload='metadata' src='{_escape(audio_filename)}'></audio>
  <p>The audio includes the introduction, full reading, and pronunciation repetition practice.</p>
</section>"""

    title = _escape(content["title"])
    topic = _escape(content["topic"])
    storage_key = _escape(_slug(content["title"]))
    available_days_json = json.dumps(sorted(set(lesson_days or [lesson_day])))
    return f"""<!doctype html>
<html lang='en'>
<head>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
  <title>{title} · English Content Pipeline</title>
  <style>
    :root {{ color-scheme: light; --ink:#18212b; --muted:#6d7885; --line:#dce3ea; --accent:#2f6fed; --soft:#f5f7fa; }}
    * {{ box-sizing:border-box; }}
    body {{ margin:0; background:#eef2f6; color:var(--ink); font-family:Inter,Segoe UI,Arial,sans-serif; line-height:1.65; }}
    main {{ width:min(920px,calc(100% - 32px)); margin:32px auto 64px; }}
    header, section, .sentence-card {{ background:#fff; border:1px solid var(--line); border-radius:18px; padding:24px; margin-bottom:18px; box-shadow:0 8px 24px rgba(24,33,43,.05); }}
    header {{ padding:32px; }}
    .eyebrow, .sentence-label {{ color:var(--accent); font-size:12px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; }}
    h1 {{ margin:8px 0; font-size:clamp(28px,5vw,48px); line-height:1.15; }}
    h2 {{ margin-top:0; }}
    h3 {{ margin:0 0 8px; }}
    h4 {{ margin:18px 0 4px; }}
    .topic, .muted, .focus-terms {{ color:var(--muted); }}
    .toolbar {{ display:flex; gap:10px; flex-wrap:wrap; margin-top:22px; }}
    button {{ cursor:pointer; border:0; border-radius:10px; padding:10px 15px; font-weight:700; background:var(--accent); color:white; }}
    button.secondary {{ background:var(--soft); color:var(--ink); border:1px solid var(--line); }}
    .progress {{ height:8px; background:#e8edf3; border-radius:99px; overflow:hidden; margin-top:18px; }}
    .progress > span {{ display:block; width:0; height:100%; background:var(--accent); transition:width .2s ease; }}
    .lesson-day {{ color:var(--accent); font-size:13px; font-weight:800; letter-spacing:.14em; margin-top:18px; }}
    .calendar-panel {{ margin-top:20px; padding:14px; background:var(--soft); border:1px solid var(--line); border-radius:14px; max-width:330px; }}
    .calendar-heading {{ display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }}
    .calendar-button {{ background:transparent; color:var(--ink); border:0; padding:2px 8px; font-size:22px; }}
    .calendar-weekdays, .calendar-grid {{ display:grid; grid-template-columns:repeat(7,1fr); gap:4px; text-align:center; }}
    .calendar-weekdays {{ color:var(--muted); font-size:10px; font-weight:800; }}
    .calendar-grid {{ margin-top:5px; }}
    .calendar-day {{ position:relative; min-height:30px; padding:5px 0; border-radius:8px; font-size:12px; }}
    .calendar-day.available {{ cursor:pointer; box-shadow:inset 0 0 0 1px #b9ccef; }}
    .calendar-day.today {{ background:#dce8ff; color:var(--accent); font-weight:800; }}
    .calendar-day.completed::after {{ content:'✓'; position:absolute; right:2px; top:-5px; color:#1d9b62; font-size:11px; font-weight:900; }}
    .english-sentence {{ font-size:20px; font-weight:650; line-height:1.5; }}
    .focus-word {{ color:#d33b4b; font-weight:800; }}
    .legend {{ color:#d33b4b; font-size:13px; font-weight:700; }}
    textarea {{ display:block; width:100%; min-height:96px; resize:vertical; border:1px solid var(--line); border-radius:12px; padding:12px; font:inherit; margin:8px 0 12px; }}
    .review-panel {{ background:var(--soft); border-left:4px solid var(--accent); padding:4px 16px 12px; margin-top:14px; border-radius:8px; }}
    audio {{ width:100%; }}
    li {{ margin:16px 0; }}
    li p {{ margin:4px 0 0; color:var(--muted); }}
    .read-only .sentence-study {{ display:none; }}
    .read-only .article-full {{ display:block; }}
    .article-full {{ display:none; }}
    @media (max-width:640px) {{ header, section, .sentence-card {{ padding:18px; }} main {{ width:min(100% - 18px,920px); margin-top:10px; }} }}
  </style>
</head>
<body>
<main id='app' data-storage-key='{storage_key}' data-review-url='{_escape(review_url or '')}' data-content-reference='{_escape(content_reference or '')}' data-lesson-day='{lesson_day}' data-lesson-base-url='{_escape(lesson_base_url)}'>
  <header>
    <div class='lesson-day'>DAY {lesson_day:02d} · READING</div>
    <div class='eyebrow'>English Content Pipeline · Sentence Study</div>
    <h1>{title}</h1>
    <p class='topic'>{topic}</p>
    <p class='muted'>Read the passage, write your own interpretation, and compare it with the corrected version.</p>
    <div class='toolbar'>
      <button id='study-mode' type='button'>Study mode</button>
      <button id='read-mode' class='secondary' type='button'>Read mode</button>
    </div>
    <div class='progress'><span id='progress-bar'></span></div>
    <p class='muted' id='progress-label'>0% completed</p>
    <div class='calendar-panel'>
      <div class='calendar-heading'><button id='previous-month' class='calendar-button' type='button'>‹</button><strong id='calendar-title'></strong><button id='next-month' class='calendar-button' type='button'>›</button></div>
      <div class='calendar-weekdays'><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
      <div id='calendar-grid' class='calendar-grid'></div>
    </div>
  </header>

  {audio_html}

  <section class='article-full'>
    <h2>Full Reading</h2>
    {article_html}
  </section>

  <section class='sentence-study'>
    <h2>Sentence-by-sentence Study</h2>
    <p class='legend'>Red words and expressions are key focus points.</p>
    {''.join(sentence_cards)}
  </section>

  <section>
    <h2>Conversation Questions</h2>
    <ol>{questions_html}</ol>
  </section>
</main>
<script>
  const app = document.querySelector('#app');
  const cards = [...document.querySelectorAll('.sentence-card')];
  const progressBar = document.querySelector('#progress-bar');
  const progressLabel = document.querySelector('#progress-label');
  const availableLessonDays = {available_days_json};
  const lessonBaseUrl = app.dataset.lessonBaseUrl;
  const saved = JSON.parse(localStorage.getItem('study:' + app.dataset.storageKey) || '{{}}');
  cards.forEach((card) => {{
    const input = card.querySelector('textarea');
    const review = card.querySelector('.review-panel');
    const button = card.querySelector('.review-button');
    input.value = saved[card.dataset.index] || '';
    input.addEventListener('input', () => {{
      saved[card.dataset.index] = input.value;
      localStorage.setItem('study:' + app.dataset.storageKey, JSON.stringify(saved));
      updateProgress();
    }});
    button.addEventListener('click', () => reviewAnswer(card));
    input.addEventListener('keydown', (event) => {{
      if (event.key === 'Enter' && !event.shiftKey) {{
        event.preventDefault();
        reviewAnswer(card);
      }}
    }});
  }});
  async function reviewAnswer(card) {{
    const input = card.querySelector('textarea');
    const review = card.querySelector('.review-panel');
    const dynamic = card.querySelector('.dynamic-review');
    const button = card.querySelector('.review-button');
    const answer = input.value.trim();
    if (!answer) {{
      review.hidden = false;
      dynamic.innerHTML = '<p>Please write your interpretation first.</p>';
      return;
    }}
    if (!app.dataset.reviewUrl || !app.dataset.contentReference) {{
      review.hidden = false;
      return;
    }}
    button.disabled = true;
    button.textContent = 'Reviewing...';
    try {{
      const response = await fetch(app.dataset.reviewUrl, {{
        method: 'POST',
        headers: {{ 'Content-Type': 'application/json' }},
        body: JSON.stringify({{
          content_file: app.dataset.contentReference,
          sentence_index: Number(card.dataset.index),
          answer: answer
        }})
      }});
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'Review failed');
      dynamic.innerHTML = reviewSection('What you understood', result.understood) +
        reviewSection('Check again', result.issues) +
        reviewSection('Learn more', result.learn);
      review.hidden = false;
    }} catch (error) {{
      review.hidden = false;
      dynamic.innerHTML = '<p>Review could not be loaded: ' + escapeHtml(error.message) + '</p>';
    }} finally {{
      button.disabled = false;
      button.textContent = 'Review my interpretation';
    }}
  }}
  function reviewSection(title, items) {{
    if (!items || !items.length) return '';
    return '<h4>' + title + '</h4><ul>' + items.map((item) => '<li>' + escapeHtml(item) + '</li>').join('') + '</ul>';
  }}
  function escapeHtml(value) {{
    return String(value).replace(/[&<>'\"]/g, (char) => ({{ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '\"':'&quot;' }})[char]);
  }}
  function updateProgress() {{
    const completed = cards.filter((card) => card.querySelector('textarea').value.trim()).length;
    const percent = cards.length ? Math.round(completed / cards.length * 100) : 0;
    progressBar.style.width = percent + '%';
    progressLabel.textContent = percent + '% completed';
    if (completed === cards.length && cards.length) {{
      const today = dateKey(new Date());
      completedDays[today] = true;
      localStorage.setItem('completed:' + app.dataset.storageKey, JSON.stringify(completedDays));
    }}
    renderCalendar();
  }}
  let calendarDate = new Date();
  const completedDays = JSON.parse(localStorage.getItem('completed:' + app.dataset.storageKey) || '{{}}');
  function dateKey(date) {{
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }}
  function renderCalendar() {{
    const title = document.querySelector('#calendar-title');
    const grid = document.querySelector('#calendar-grid');
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    title.textContent = calendarDate.toLocaleString('en-US', {{ month:'long', year:'numeric' }});
    grid.innerHTML = '';
    for (let i = 0; i < new Date(year, month, 1).getDay(); i++) grid.insertAdjacentHTML('beforeend', '<span></span>');
    const today = dateKey(new Date());
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= lastDay; day++) {{
      const key = dateKey(new Date(year, month, day));
      const cell = document.createElement('span');
      const lessonAvailable = availableLessonDays.includes(day);
      cell.className = 'calendar-day' + (lessonAvailable ? ' available' : '') + (key === today ? ' today' : '') + (completedDays[key] ? ' completed' : '');
      cell.textContent = day;
      if (lessonAvailable) {{
        cell.title = 'Open Day ' + String(day).padStart(2, '0');
        cell.addEventListener('click', () => openLesson(day));
      }}
      grid.appendChild(cell);
    }}
  }}
  async function openLesson(day) {{
    if (day === Number(app.dataset.lessonDay)) return;
    const target = lessonBaseUrl + '/' + day + '/generate';
    try {{
      const response = await fetch(target, {{ method:'POST', headers:{{'Content-Type':'application/json'}}, body:JSON.stringify({{tts:true}}) }});
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'Lesson generation failed');
      if (result.html_url) window.location.href = result.html_url;
    }} catch (error) {{
      window.alert('The next lesson could not be opened: ' + error.message);
    }}
  }}
  document.querySelector('#previous-month').addEventListener('click', () => {{ calendarDate.setMonth(calendarDate.getMonth() - 1); renderCalendar(); }});
  document.querySelector('#next-month').addEventListener('click', () => {{ calendarDate.setMonth(calendarDate.getMonth() + 1); renderCalendar(); }});
  document.querySelector('#read-mode').addEventListener('click', () => {{ app.classList.add('read-only'); }});
  document.querySelector('#study-mode').addEventListener('click', () => {{ app.classList.remove('read-only'); }});
  updateProgress();
</script>
</body>
</html>
"""


def write_learning_html(
    content: dict[str, Any],
    output_path: Path,
    audio_filename: str | None = None,
    review_url: str | None = None,
    content_reference: str | None = None,
    lesson_day: int = 1,
    lesson_days: list[int] | None = None,
    lesson_base_url: str = "/lessons",
) -> Path:
    output_path.write_text(
        build_learning_html(
            content,
            audio_filename,
            review_url=review_url,
            content_reference=content_reference,
            lesson_day=lesson_day,
            lesson_days=lesson_days,
            lesson_base_url=lesson_base_url,
        ),
        encoding="utf-8",
    )
    return output_path
