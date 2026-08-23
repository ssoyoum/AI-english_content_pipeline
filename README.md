# English Content Pipeline

영어 학습 콘텐츠 제작 자동화를 위한 프로젝트입니다.

## 현재 샘플 UI

`ui/` 폴더에는 제공된 `Climate Change and Water` 콘텐츠를 바탕으로 만든 문장별 해석 학습 화면이 있습니다.

주요 흐름:

```text
Read 모드에서 전체 본문 확인
→ Study 모드에서 문장별 원문 확인
→ 나의 해석 입력
→ Enter로 리뷰 열기
→ 올바른 해석 확인
→ 잘 잡은 의미·다시 확인할 의미·추가 학습 내용 확인
→ Review에서 전체 문장 비교
```

입력한 해석은 브라우저의 `localStorage`에 자동 저장됩니다.

## 실행

Python이 설치되어 있다면 프로젝트 루트에서 다음 명령을 실행합니다.

```bash
python -m http.server 8000 -d ui
```

그 다음 브라우저에서 [http://localhost:8000](http://localhost:8000)을 엽니다.

현재는 정적 프로토타입이며, 다음 단계에서 LLM API가 생성한 구조화 데이터와 연결할 수 있습니다.

현재 샘플에는 날짜 기반 레슨 흐름도 포함되어 있습니다. 첫 실행일을 `01일차`로 저장하고, 다음 날짜를 선택하면 `02일차` 샘플 레슨으로 이동합니다. 해당 날짜의 모든 문장 해석을 입력하면 달력에 완료 체크가 표시됩니다.

달력은 왼쪽 사이드바의 브랜드 영역 아래에 배치되어 있으며, 날짜를 선택하면 본문 상단의 레슨 정보가 해당 날짜의 학습 주제로 바뀝니다.

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
    └── run.json
```

실제 API 모드에서는 `.env.example`을 참고해 `OPENAI_API_KEY`를 설정해야 합니다. API 결과는 JSON Schema로 검증되므로, 이후 Notion 게시·TTS 생성·UI 연결에서 같은 `content.json`을 재사용할 수 있습니다.

`.env.example`을 복사해 `.env`로 만든 뒤 키를 입력하면 CLI가 자동으로 읽습니다. `.env`는 `.gitignore`에 포함되어 있습니다.

## API 없는 운영 방식

LLM API를 사용하지 않으려면 사용자가 미리 제공한 원문·해석과 문장별 학습 규칙을 기준으로 로컬 리뷰를 실행할 수 있습니다. 이 방식은 비용이 없고 결과가 일정하며, 핵심 의미와 오해 패턴을 교육자가 직접 통제할 수 있습니다. 입력 형식은 `content/README.md`를 참고합니다.
