# COMMIT_PLAN

Last Updated: 2026-08-30 05

## Current Git Status

Only the documentation files remain for Commit 4. Existing commits `ce80bd0` and `30c33bc` were preserved.

## Recommended Commits

### Commit 1

```text
feat(content): add weekly lessons and progress pipeline
```

Include:

- Seven lesson JSON files and catalog metadata
- Lesson content validation, catalog loading, streak calculation
- JSON-based TTS generation
- Catalog, progress, and content-related tests

Files:

`content/*.json`, `scripts/generate_weekly_tts.py`, `src/models/content.py`, `src/pipeline/lesson_catalog.py`, `src/pipeline/progress.py`, `tests/test_lesson_catalog.py`, `tests/test_progress.py`

### Commit 2

```text
feat(api): expose lesson catalog and admin publishing
```

Include:

- `/api/lessons` and `/api/lessons/{lesson_id}`
- `/admin`, admin Generate, and admin Publish endpoints
- `.env` loading for server-side `OPENAI_API_KEY`
- Admin content helpers, Content Studio files, and API/admin tests

Files:

`src/api.py`, `src/pipeline/admin_content.py`, `ui/admin.html`, `ui/admin.js`, `ui/admin.css`, `tests/test_api.py`, `tests/test_admin.py`

This commit uses the existing OpenAI Responses API generator when local sample mode is disabled.

### Commit 3

```text
feat(ui): connect learner screens to dynamic lesson progress
```

Include:

- API-backed Dashboard, Calendar, Progress, Study, Read, and Review screens
- Dynamic study records, TTS transcript, vocabulary preview, and milestones
- Study original-panel removal
- Read ordered sentence headings with `<hr>` separators
- Learner theme and responsive UI updates

Files:

`ui/app.js`, `ui/index.html`, `ui/styles.css`

### Commit 4

```text
docs(project): document workflow and commit plan
```

Include:

- Lesson catalog, learner data flow, Admin Content Studio, and OpenAI setup documentation
- Completed work, known issues, and future tasks
- Current commit plan and execution record

Files:

`README.md`, `TASKS.md`, `COMMIT_PLAN.md`

## Verification

```text
python -m pytest -q
node --check ui/app.js
node --check ui/admin.js
git diff --check
```

## Commit Execution Log

```yaml
status: COMPLETE
commits_created: 4
commit_1: a6c6634
commit_2: 9624026
commit_3: 7df7696
commit_4: final commit (recorded in git log)
push_status: NOT PUSHED
```

No API key or `.env` file will be staged. No previous commit will be rebased or rewritten.
