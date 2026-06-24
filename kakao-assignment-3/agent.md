# [프로젝트 아키텍처 및 AI 코딩 가이드라인]

이 문서는 프로젝트에 참여하는 모든 개발자 및 AI 에이전트(Agent)가 코드를 작성할 때 반드시 준수해야 하는 설계 철학, 기능 명세 및 원칙입니다.

## 0. 핵심 철학 (Migration First)
이 프로젝트는 맨땅에서 새로 짜는(Zero-base) 프로젝트가 아닙니다. 기존 2차 과제의 결과물인 `kakao-assignment-3/todo-react` 폴더 내부의 UI 컴포넌트 마크업 구조와 Tailwind CSS 코드를 **최대한 재사용(마이그레이션)**해야 합니다. AI 에이전트는 프론트엔드 UI를 구현할 때 독단적으로 UI를 창조하지 말고, 반드시 기존 코드를 먼저 분석한 뒤 Next.js App Router 환경에 맞게 리팩토링하는 방식으로 작업하십시오.

## 0-1. 디렉토리 구조 (ASCII Tree)
루트 폴더(`kakao-assignment-3/`) 내에서 다음과 같은 구조를 유지합니다. 임의로 폴더명이나 구조를 변경하지 마십시오.
```text
kakao-assignment-3/
├── agent.md          # 불변하는 시스템 뼈대 및 통제소 (현재 파일)
├── plan.md           # 기계가 실행하고 추적하는 Action Tracker
├── backend/          # FastAPI 백엔드 루트
│   ├── .venv/        # 파이썬 가상환경
│   ├── .env.local    # 백엔드 환경변수
│   ├── main.py       # FastAPI 진입점
│   ├── database.py   # SQLite 연결 및 세션 관리
│   ├── models.py     # SQLAlchemy ORM 모델
│   ├── schemas.py    # Pydantic 데이터 스키마
│   ├── routers/      # API 엔드포인트 폴더
│   ├── requirements.txt
│   └── todos.db      # SQLite 데이터베이스 파일
└── frontend/         # Next.js 프론트엔드 루트
    ├── .env.local    # 프론트엔드 환경변수
    ├── package.json
    ├── app/          # App Router 경로
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   └── todos/    
    │       ├── page.tsx
    │       ├── new/page.tsx
    │       └── [todoId]/page.tsx
    ├── components/   # UI 컴포넌트 폴더
    └── types/        # TypeScript 타입 인터페이스 폴더
```

## 1. 주요 기능 구현 스펙 통제 (UI/UX)
- **안내 메시지**: 빈 값 입력 시 브라우저 기본 `alert("내용을 입력해주세요.")` 사용.
- **완료 처리 구분**: `text-gray-400 line-through` Tailwind 클래스 적용.
- **현재 필터 탭 강조**: 선택된 탭은 `border-b-2 border-blue-500 font-bold text-blue-600` 적용. 선택되지 않은 탭은 `text-gray-500`.
- **오늘 날짜 강조**: 달력에서 '오늘'에 해당하는 날짜는 `bg-blue-100 text-blue-800 font-bold rounded-full` 적용.
- **수정 UI**: 기존 `prompt()` 대신, 항목 내 직접 텍스트 수정이 가능한 인라인 입력창 구현.

## 2. 프론트엔드 vs 백엔드 역할 분리
- **프론트엔드**: 텍스트 입력창 UI, 버튼 클릭 이벤트, 인라인 수정 UI, 달력 UI 렌더링, 필터/날짜 상태의 URL 파라미터 업데이트.
- **백엔드**: 고유 ID 생성(DB Auto Increment), 데이터 생성/수정/삭제 처리, 쿼리 파라미터를 통한 데이터 필터링(SQL), 날짜별 Todo 개수 집계 및 영구 저장(SQLite). 배열 `.filter()` 나 `localStorage` 로직은 프론트엔드에서 완전 배제합니다.

## 3. 데이터 구조 분리 (FastAPI)
- **DB 모델 (SQLAlchemy)**: `id`, `content`, `is_completed`, `is_starred`, `target_date`. 실제 SQLite DB(`todos.db`)와 직접 통신하는 엔티티.
- **API 스키마 (Pydantic)**: 클라이언트 데이터 검증용. 생성용(`TodoCreate`), 수정용(`TodoUpdate`), 응답용(`TodoResponse`) 분리. 클라이언트가 임의로 `id` 등을 조작하는 것을 원천 차단합니다.

## 4. Next.js 및 상태 관리 룰
- **Server Component (기본값)**: `app/page.tsx` 등 클릭/입력 없이 데이터를 보여주기만 하는 영역. 서버에서 데이터를 패칭하여 완성된 HTML을 전달합니다.
- **Client Component (`"use client"`)**: `<TodoItem />` 체크박스, 폼 입력 등 사용자 인터랙션 필수 구역에만 최소한으로 적용합니다.
- **상태 관리**: 단순 클라이언트 메모리(`useState`) 사용 금지. **URL 파라미터(`?filter=...`, `?date=...`)**와 `useSearchParams`로 상태를 주소창에 저장하고 Server Component에서 읽어 백엔드에 요청합니다.
- **통신 방식**: 프론트->백 통신 시 `route.ts` (API Proxy) 사용. 데이터 변경 후에는 `revalidatePath`로 캐시를 갱신합니다.

## 5. 테스트 자동화 전략 (QA)
- **백엔드 (API 단위/통합 테스트)**: `pytest` + `httpx` (FastAPI `TestClient`). 프론트엔드 개입 없이 API의 정확성을 검증합니다.
- **풀스택 연동 테스트 (E2E)**: **Playwright** (`@playwright/test`). 실제 브라우저를 띄워 사용자의 행동을 시뮬레이션하고 검증합니다.
