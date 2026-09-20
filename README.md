# English Content Pipeline

영어 학습 콘텐츠 제작 자동화를 위한 프로젝트입니다.

## 학습 UI와 콘텐츠 연결

`content/lessons.json`에 등록된 학습 콘텐츠를 FastAPI의 `/api/lessons`에서 제공하고, `ui/app.js`가 API에서 목록과 본문을 읽습니다. `Climate Change and Water`는 등록된 예시 중 하나입니다. 새 본문을 추가할 때 UI의 학습 데이터를 직접 수정할 필요가 없습니다.

첫 화면은 학습 달력과 오늘의 주제를 보여주고, `학습 시작`을 눌렀을 때 문장별 학습창으로 이동합니다.

주요 흐름:

```text
홈 화면에서 오늘의 주제 확인
→ 학습 시작
→ Read 모드에서 전체 본문 확인
→ Study 모드에서 문장별 원문 확인
→ 나의 해석 입력
→ Enter로 리뷰 열기
→ 올바른 해석 확인
→ 잘 잡은 의미·다시 확인할 의미·추가 학습 내용 확인
→ Review에서 전체 문장 비교
```

입력한 해석과 학습 진행 상태는 브라우저의 `localStorage`에 lesson ID별로 저장됩니다. 관리자 화면(`/admin`)에서는 초안 미리보기·편집 후 스키마 검증을 거쳐 콘텐츠와 catalog에 발행할 수 있습니다.

## 실행

프로젝트 루트에서 API 서버를 실행합니다. 이 주소가 콘텐츠 API, 학습 UI, 생성된 오디오를 함께 제공합니다.

```bash
uvicorn src.api:app --host 127.0.0.1 --port 8001
```

그 다음 [http://127.0.0.1:8001](http://127.0.0.1:8001)을 엽니다. 등록된 본문을 읽고 학습하는 데 LLM 호출은 필요하지 않습니다. 관리자에서 새 콘텐츠를 생성할 때는 로컬 샘플 또는 설정된 OpenAI 생성기를 선택할 수 있습니다.

`01일차`, `02일차`는 자동으로 생성되는 날짜가 아니라 등록된 콘텐츠의 순서입니다. 첫 실행일을 기준으로 각 콘텐츠가 달력에 배치되고, 모든 문장 해석을 입력하면 해당 날짜에 완료 체크가 표시됩니다.

수동으로 새 본문을 추가할 때는 `content/`에 JSON을 저장하고 `content/lessons.json`에 순서를 등록합니다. `python -m http.server -d ui`는 `/api/lessons`를 제공하지 않으므로 학습 UI 실행에는 FastAPI를 사용합니다.

## 프롬프트 모듈

- `prompts/interpretation_correction_prompt.md`: 독해 문장별 해석 교정용
- `prompts/conversation_correction_prompt.md`: 회화 답변 교정 및 어휘 박스 생성용

독해 교정과 회화 교정은 입력 데이터와 학습 목적이 다르므로 별도의 프롬프트로 관리합니다.

## MVP CLI 파이프라인

현재 첫 번째 자동화 수직 슬라이스는 주제를 받아 구조화된 학습 콘텐츠 패키지를 저장합니다.

```bash
# API 없이 샘플 데이터로 전체 흐름 테스트
python -m src.main --topic "Climate Change and Water" --sample

# 사용자가 제공한 콘텐츠로 API 없이 실행
python -m src.main --content-file content/digital_minimalism.json

# Notion에 올릴 Markdown 미리보기만 생성
python -m src.main --content-file content/digital_minimalism.json --notion-preview

# Notion 페이지 자동 생성
python -m src.main --content-file content/digital_minimalism.json --publish-notion

# 유료 TTS API 없이 Edge Neural 음성으로 MP3 생성
python -m src.main --content-file content/digital_minimalism.json --tts

# OpenAI API로 실제 콘텐츠 생성
python -m src.main --topic "Climate Change and Water"
```

실행 결과:

```text
outputs/
└── climate-change-and-water/
    ├── content.json
    ├── audio.mp3
    ├── audio_cues.json
    └── run.json
```

`audio_cues.json`에는 Edge TTS가 반환한 단어별 시작·종료 시간이 저장됩니다. 오디오를 학습창에서 재생하면 현재 발화 중인 단어가 자동으로 표시됩니다. Windows 음성 엔진으로 fallback된 경우에는 MP3는 생성되지만 단어 동기화 정보는 만들어지지 않습니다.

실제 API 모드에서는 `.env.example`을 참고해 `OPENAI_API_KEY`를 설정해야 합니다. API 결과는 JSON Schema로 검증되므로, 이후 Notion 게시·TTS 생성·UI 연결에서 같은 `content.json`을 재사용할 수 있습니다.

`.env.example`을 복사해 `.env`로 만든 뒤 키를 입력하면 CLI가 자동으로 읽습니다. `.env`는 `.gitignore`에 포함되어 있습니다.

## API 없는 운영 방식

LLM API를 사용하지 않으려면 사용자가 미리 제공한 원문·해석과 문장별 학습 규칙을 기준으로 로컬 리뷰를 실행할 수 있습니다. 이 방식은 비용이 없고 결과가 일정하며, 핵심 의미와 오해 패턴을 교육자가 직접 통제할 수 있습니다. 입력 형식은 `content/README.md`를 참고합니다.

## Lesson catalog and UI data flow

The weekly learning flow now uses one source of truth:

```text
content/*.json -> FastAPI /api/lessons -> ui/app.js fetch() -> Dashboard / Study / Read / Review
```

`content/lessons.json` stores catalog metadata and each lesson JSON stores the authored article, ten sentence interpretations, review rules, vocabulary, and audio script. Add a catalog entry plus its JSON file and it will be loaded by the UI without editing lesson data in JavaScript.

- `GET /api/lessons` returns lesson metadata including `id`, `title`, `level`, `category`, and `sentence_count`.
- `GET /api/lessons/{lesson_id}` returns the full lesson and available `audio_url` / `cues_url`.
- `loadLessons()` and `normalizeLesson()` connect API content to the existing UI.
- `loadStudyProgress()` and `saveStudyProgress()` persist answers by lesson ID in localStorage.
- `calculateCurrentStreak()` counts consecutive completed dates; it is not the number of dates ever completed.

The dashboard, calendar, and progress screens derive their sentence counts, coverage, completion, streak, and study time from local study records. `Key Meaning Coverage` is the existing keyword/rule feedback metric; it is intentionally not labelled as translation accuracy until an LLM reviewer is added.

Run the complete UI through FastAPI so the frontend can call the catalog API:

```bash
uvicorn src.api:app --host 127.0.0.1 --port 8001
```

Then open `http://127.0.0.1:8001/`. A plain `python -m http.server` serves the static files but does not provide `/api/lessons`.

## Admin Content Studio

Open `http://127.0.0.1:8001/admin` for the separate administrator workspace. The learner UI at `/ui/` remains unchanged as the learning surface.

```text
Admin brief -> POST /api/admin/lessons/generate -> Draft Preview/Edit
           -> POST /api/admin/lessons/publish -> content/{lesson-id}.json
                                               -> content/lessons.json
                                               -> learner /api/lessons catalog
```

The form supports Topic, Level, Sentence Count, Category, optional learning goal/tone/vocabulary, local sample generation, browser-only Save Draft, sentence-level editing, and optional TTS generation at publish time. Uncheck `Use local sample for preview` to use the configured OpenAI generator. Publish validates the existing content schema before writing the lesson file and catalog entry.
