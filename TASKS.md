# Project Tasks

Last Updated: 2026-08-30 05:00

## In Progress

- [ ] Publish 이후 TTS 자동 생성 안정화
  - 작업 목적: 관리자 Publish에서 선택한 TTS를 생성하고 학습자 Study 화면까지 연결
  - 관련 파일: `src/api.py`, `src/generators/tts_generator.py`, `ui/app.js`
  - 현재 상태: Publish 시 선택 실행과 실패 경고까지 구현됨
  - 다음 작업: 운영 환경별 TTS 성공/실패 케이스 추가 점검

## To Do

### High Priority

- [ ] Publish 후 TTS 생성 안정화

### Medium Priority

- [ ] Draft 저장 및 재사용
- [ ] 문장 단위 Regenerate

### Low Priority

- [ ] 관리자 Content Check 고도화
- [ ] Draft 검색 및 필터

## Completed

### 2026-08-30

- [x] 관리자 Content Studio 및 Draft → Publish 흐름 구현
  - 변경 파일: `ui/admin.html`, `ui/admin.js`, `ui/admin.css`, `src/api.py`, `src/pipeline/admin_content.py`
  - 주요 변경: `/admin`, Generate Draft, Draft Preview/Edit, Save Draft(localStorage), Publish, 카탈로그 자동 등록
  - 테스트: 로컬 샘플 Draft 생성 및 임시 디렉터리 Publish 성공 확인
  - 관련 커밋: 아직 커밋하지 않음

- [x] Lesson JSON → FastAPI → 학습자 UI 데이터 흐름 구축
  - 변경 파일: `content/*.json`, `src/api.py`, `src/pipeline/lesson_catalog.py`, `ui/app.js`
  - 주요 변경: 7개 레슨 카탈로그, `/api/lessons`, 실제 학습 기록 기반 Dashboard / Calendar / Progress
  - 테스트: 16개 통과
  - 관련 커밋: 아직 커밋하지 않음

### 2026-08-30 UI refinement

- [x] Study 원본 패널 제거 및 학습창 직접 진입
  - `ui/index.html`, `ui/app.js`, `ui/styles.css`
  - Study 화면에서 전체 원본 블록을 제거하고 문장별 학습 원문만 유지
- [x] Read 전체 문장 순차 표시
  - `ui/app.js`, `ui/styles.css`
  - 모든 문장을 고유 소제목과 문장 순서로 표시하고 문장 사이에 `<hr>` 적용

## Known Issues

- [ ] 현재 번역 피드백은 LLM 번역 평가가 아닌 키워드 기반 `Key Meaning Coverage`임
- [ ] LLM API 키가 없는 환경에서는 관리자 Generate를 local sample 모드로 사용해야 함
- [ ] Publish TTS는 선택 기능이며, 로컬 음성 엔진 환경에 따라 실패할 수 있음

## Future Ideas

- LLM Translation Reviewer
- 개인별 학습 추천
- DB 기반 Lesson / Draft 관리
- 관리자 권한 인증
