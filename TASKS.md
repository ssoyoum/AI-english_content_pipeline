# Project Tasks

Last Updated: 2026-11-04

## In Progress

- [ ] Publish 이후 TTS 자동 생성 안정화
  - 작업 목적: 관리자 Publish에서 선택한 TTS를 생성하고 학습자 Study 화면까지 연결
  - 관련 파일: `src/api.py`, `src/generators/tts_generator.py`, `ui/app.js`
  - 현재 상태: Publish 시 선택 실행과 실패 경고까지 구현됨
  - 다음 작업: 운영 환경별 TTS 성공/실패 케이스 추가 점검 (Publish TTS 경로를 직접 검증하는 테스트는 아직 없음 — `tests/`에 tts 관련은 `test_pipeline.py`의 stage 기록뿐)

## To Do

### High Priority

- [ ] Publish 후 TTS 생성 안정화 (위 '진행 중' 항목과 동일 — 중복 제거 예정)

### Medium Priority

- [ ] Draft 저장 후 목록 관리·다중 Draft (현재는 브라우저 `localStorage` 슬롯 1개 저장/복원만 구현)
- [ ] 문장 단위 Regenerate (현재 Regenerate는 Draft 전체를 다시 생성함)

### Low Priority

- [ ] 관리자 Content Check 고도화 (현재는 문장 수·번역·키워드 유무·긴 문장 경고만 확인)
- [ ] Draft 검색 및 필터

## Completed

### 2026-11-04 학습자 UI 다듬기

- [x] 학습자 UI 스타일 보강(`ui/styles.css` 하단 추가 블록): 두꺼운 진행 바, 3D 느낌의 버튼, 정답 패널 강조·등장 애니메이션, streak 🔥 표시, 포커스 링, `prefers-reduced-motion` 대응
  - 근거: 헤드리스 Chrome으로 Dashboard 화면을 다시 캡처해 flame·버튼 변화 확인. 별 개수가 확인된 레포를 그대로 따라 한 것은 아니며, Duolingo 계열 UI 패턴만 참고함
- [x] README에 화면 캡처 4장 추가(`docs/screenshots/`: dashboard, study, calendar, progress — 학습 기록이 없는 초기 상태)
  - 미검증: 정답 보기·피드백 패널이 열린 상태, 관리자 화면, 모바일 폭 캡처는 없음

### 2026-11-04 점검으로 확인한 사실

- [x] 커밋 반영 확인: 레슨 파이프라인 `c90b2c1`, API·관리자 `1ed8d39`, 학습자 UI `c02b952`
- [x] Python 3.10에서 `datetime.UTC` import 오류 수정(`6cb6101`), 테스트 18개 전부 통과(2026-11-04 `pytest` 재실행)
- [x] Draft 저장/복원 기본 동작: `ui/admin.js`에 `localStorage` 저장·복원·삭제 코드 존재 (브라우저 실제 조작은 이번 점검에서 미검증)

### 2026-08-30

- [x] 관리자 Content Studio 및 Draft → Publish 흐름 구현
  - 변경 파일: `ui/admin.html`, `ui/admin.js`, `ui/admin.css`, `src/api.py`, `src/pipeline/admin_content.py`
  - 주요 변경: `/admin`, Generate Draft, Draft Preview/Edit, Save Draft(localStorage), Publish, 카탈로그 자동 등록
  - 테스트: 로컬 샘플 Draft 생성 및 임시 디렉터리 Publish 성공 확인
  - 관련 커밋: `1ed8d39`

- [x] Lesson JSON → FastAPI → 학습자 UI 데이터 흐름 구축
  - 변경 파일: `content/*.json`, `src/api.py`, `src/pipeline/lesson_catalog.py`, `ui/app.js`
  - 주요 변경: 7개 레슨 카탈로그, `/api/lessons`, 실제 학습 기록 기반 Dashboard / Calendar / Progress
  - 테스트: 16개 통과 (당시 기록, 현재 18개)
  - 관련 커밋: `c90b2c1`, `1ed8d39`, `c02b952`

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
- [ ] 관리자 화면에 인증이 없음 (README 한계 항목과 동일)
- [ ] Publish TTS는 선택 기능이며, 로컬 음성 엔진 환경에 따라 실패할 수 있음

## Future Ideas

- LLM Translation Reviewer
- 개인별 학습 추천
- DB 기반 Lesson / Draft 관리
- 관리자 권한 인증
