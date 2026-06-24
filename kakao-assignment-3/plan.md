System: AI 에이전트는 반드시 **'한 단계 구현 -> [테스트 포인트] 명령어 실행 및 검증 -> 이상이 없을 경우에만 해당 항목을 `- [x]`로 체크하고 다음 단계로 넘어간다'**는 워크플로우를 지켜야 한다. 여러 단계를 한 번에 구현하지 않는다. 이 프로젝트는 백지상태에서 시작하는 것이 아니라, 기존 `todo-react` 폴더의 2차 과제 코드를 Next.js + FastAPI로 옮기는 **마이그레이션(Migration)** 과제이다. 개발 아키텍처, 기능 스펙 및 폴더 구조는 `agent.md`를 참고하라.

# [구현 단계 및 세부 설계 (Action Tracker)]

## 0. 마이그레이션 아키텍처 숙지 및 선언 (Pre-flight Check)
- [x] 코딩 및 설치를 시작하기 전, 반드시 `agent.md`의 [프론트엔드 vs 백엔드 역할 분리] 섹션을 정독한다.
- **[테스트 포인트]**
  - [x] AI 에이전트는 터미널 명령어를 단 하나라도 실행하기 전에, 사용자에게 "기존 2차 과제의 어떤 코드를 프론트에 남기고, 어떤 코드를 백엔드로 이관할 것인지" 명확히 요약하여 답변(선언)하였는가?

## 1. 프론트엔드 프로젝트 세팅
- [x] Next.js App Router 기반의 프론트엔드 프로젝트 뼈대 구성 및 Tailwind CSS 적용.
- **[테스트 포인트]**
  - [x] `cat frontend/package.json` 실행하여 `next`, `tailwindcss` 의존성이 존재하는지 파싱하여 확인하라.
  - [x] `ls frontend/app` 실행하여 `layout.tsx`, `page.tsx` 등 App Router 기본 구조가 존재하는지 확인하라.

## 2. 백엔드 프로젝트 세팅
- [x] FastAPI 기본 환경 구축 및 의존성(`requirements.txt`) 설치, SQLite 연동 준비.
- **[테스트 포인트]**
  - [x] 파이썬 가상환경 활성화 후 백그라운드에서 `uvicorn main:app --port 8000`을 실행하라.
  - [x] `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/docs` 실행하여 `200` 반환을 확인하라.
  - [x] `curl -s http://localhost:8000/` 실행하여 `{"message": "Hello World"}` JSON 응답이 반환되는지 확인하라.

## 3. FASTAPI로 Todo CRUD API 구현
- [x] 데이터베이스 연동 및 테이블 생성, CRUD 엔드포인트 구현 (`GET`, `POST`, `PUT`, `DELETE`).
- **[테스트 포인트]**
  - [x] `pytest backend/tests/test_crud.py` 를 실행하여 CRUD 엔드포인트 통합 테스트 Pass를 확인하라 (테스트 파일 작성 필요).
  - [x] `ls backend/todos.db` 실행하여 SQLite 파일이 정상 생성되었는지 확인하라.

## 4. 기존 2차 과제 UI 컴포넌트 마이그레이션 (Next.js)
- [x] `todo-react` 폴더의 기존 UI 마크업과 스타일을 최대한 재사용하여 `app/todos/page.tsx`, `app/todos/new/page.tsx` 등에 이식(Migration).
- **[테스트 포인트]**
  - [x] 프론트엔드 개발 서버(`npm run dev`)를 백그라운드로 실행하라.
  - [x] `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/todos` 실행하여 `200` 반환을 확인하라.
  - [x] `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/todos/new` 실행하여 `200` 반환을 확인하라.

## 5. API Route 프록시 작성 및 프론트-백 연동
- [x] `route.ts` 또는 `actions.ts`를 작성하여 브라우저 컴포넌트에서 FastAPI로 데이터가 넘어가고 응답받도록 연동.
- **[테스트 포인트]**
  - [x] Playwright E2E 테스트 스크립트(`frontend/tests/todo_create.spec.ts`)를 작성하라.
  - [x] `npx playwright test frontend/tests/todo_create.spec.ts` 를 실행하여 UI 입력부터 DB 저장, 목록 업데이트까지 전 과정 Pass를 확인하라.

## 6. 환경변수 설정
- [x] 프론트엔드(`frontend/.env.local`)와 백엔드(`backend/.env.local`)에 백엔드 API 주소 등 환경변수 분리 적용.
- **[테스트 포인트]**
  - [x] `app/actions.ts`가 `process.env.NEXT_PUBLIC_API_URL` 등을 참조하도록 수정.
  - [x] 변경 후 Next.js 서버를 재시작하고 투두 추가 테스트를 진행해 정상 동작하는지 확인하라.
  - [x] `cat frontend/.gitignore` 실행하여 `.env.local`이 추적 제외 처리되었는지 확인하라.

## 7. 서버 기반 상태별 필터링 구현
- [ ] `?filter=active` URL 파라미터 연동, FastAPI에 필터 조건 전달하여 서버사이드 필터링 결과 반환 로직 구현.
- **[테스트 포인트]**
  - [ ] `pytest backend/tests/test_filter.py` 실행하여 필터 쿼리 파라미터에 따른 백엔드 응답 정상 작동을 확인하라.
  - [ ] `npx playwright test frontend/tests/todo_filter.spec.ts` 실행하여 탭 클릭 시 주소창 URL 변경 및 렌더링 Pass를 확인하라.

## 8. 서버 기반 Todo 검색 기능 구현
- [ ] `?search=키워드` 파라미터 적용 및 FastAPI LIKE 조회 연동. 프론트엔드에 검색어 입력 디바운싱(Debouncing) 로직 추가.
- **[테스트 포인트]**
  - [ ] `pytest backend/tests/test_search.py` 실행하여 검색 API 정상 통신을 확인하라.
  - [ ] `npx playwright test frontend/tests/todo_search.spec.ts` 실행하여 입력 후 지연(debounce) 검색 결과 렌더링 Pass를 확인하라.

## 9. 서버 기반 일간/주간 뷰 연동 및 달력 UI 구현
- [ ] 달력 UI 컴포넌트 구현 및 날짜 상태를 `?date=YYYY-MM-DD`로 관리. 백엔드에서 날짜별 패칭 및 개수 집계 로직 반환.
- **[테스트 포인트]**
  - [ ] `pytest backend/tests/test_date.py` 실행하여 날짜 쿼리 API 정상 작동을 확인하라.
  - [ ] `npx playwright test frontend/tests/todo_calendar.spec.ts` 실행하여 날짜 이동 시 데이터 갱신 및 URL 유지 상태 Pass를 확인하라.
