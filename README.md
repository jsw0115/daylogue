# Timebar Diary (TimeFlow)
시간을 “색(타임바)”으로 관리하는 올인원 생산성 앱 프로토타입

- 플래너(일/주/월/연) + 데일리 다이어리 + 할 일 + 루틴 + 포커스(포모도로) + 통계 + 설정/관리자 기능을 하나의 앱에서 운영하는 구조입니다.
- 이 README는 **현재 제공된 `src/routes/AppRoutes.jsx` 라우팅**과 **화면 캡처** 기준으로 정리했습니다.

---

## 핵심 정책(현재 결정사항)
- **Auth 화면은 AppShell 없이 단독 화면(standalone)**
- **App 화면은 AppShell(사이드바/헤더/모바일 하단탭) 기반**
- **반복 일정(Recurring Event)은 주간/월간에서 여러 날짜 자동 표시까지 MVP 포함**
- **일정(상세) 공유 UX(서버 전 임시 UX)**: 입력칩 + 입력 중 검색/자동완성 + 엔터로 추가
- **루틴 상세**: 알림(몇 분 전), 아이콘/카테고리 포함(MVP)

---

## 주요 화면(현재 내비게이션 기준)
### DAYLOGUE
- 홈 대시보드
- 데일리 다이어리

### PLAN
- 일간 / 주간 / 월간 / 연간 플래너

### ACTION
- 할 일
- 루틴
- 포커스

### INSIGHT
- 통계

### DATA
- 데이터 관리

### ADMIN
- 관리자 설정

---

## 라우트 요약 (src/routes/AppRoutes.jsx 기준)

### Auth (AppShell 없음)
- `/login` 로그인
- `/register` 회원가입
- `/reset-password` 비밀번호 재설정
- `/find-id` 아이디 찾기
- `/social-link` 소셜 연동
- `/onboarding` 온보딩
- (호환) `/auth/login` → `/login`
- (호환) `/auth/register` → `/register`
- (호환) `/auth/reset-password` → `/reset-password`
- (호환) `/auth/find-id` → `/find-id`

### App (AppShell 포함)
- `/` → `/home`
- `/home` 홈 대시보드
- `/inbox` 알림 인박스

#### Planner
- `/planner/daily` 일간 플래너
- `/planner/weekly` 주간 플래너
- `/planner/monthly` 월간 플래너
- `/planner/yearly` 연간 플래너

#### Diary / Data
- `/diary/daily` 데일리 다이어리
- `/data` 데이터 관리

#### Routine
- `/routine` 루틴 목록
- `/action/routine` → `/routine`
- `/action/routine/list` → `/routine`
- `/routines` 루틴 목록(별칭)
- `/routines/new` 루틴 생성/편집
- `/routines/:routineId/edit` 루틴 편집
- `/routines/history` 루틴 히스토리

#### Task
- `/tasks` 할 일 목록 (`ROUTES.TASKS`)
- `/tasks/:taskId` 할 일 상세
- `/action/task` 할 일 목록(별칭)

#### Memo
- `/memos` 메모 인박스
- `/memos/new` 메모 작성
- `/memos/:memoId` 메모 편집
- `/memos/to-task` 메모 → 할 일 변환

#### Stat
- `/insight/stat` 통계 대시보드(별칭)
- `ROUTES.STAT_DASHBOARD` 통계 대시보드
- `/stat/categories` 카테고리 통계
- `/stat/plan-actual` 계획 vs 실행
- `/stat/focus-report` 포커스 리포트

#### Settings
- `/settings` 통합 설정
- `ROUTES.SETTINGS_PROFILE` 프로필
- `/settings/general` 일반 설정
- `/settings/theme` 테마/스티커
- `/settings/notifications` 알림 설정
- `/settings/security` 보안 설정
- `/settings/categories` 카테고리 설정

#### Focus
- `/focus` 집중 모드

#### Admin
- `/admin` 관리자 허브
- `/admin/users` 사용자 관리
- `/admin/logs` 시스템 로그
- `/admin/notices` 공지/배너
- `/admin/stats` 서비스 통계

---

## 기술 스택(현재 확인 가능한 범위)
- **Frontend**: React 18
- **Routing**: React Router v6
- **Styling**: 커스텀 CSS(className 기반)

> 참고: Tailwind/Zustand/Recharts/date-fns 등은 “README에만 있던 정보”로는 실제 사용 여부를 확정할 근거가 부족해 제외했습니다.
> (원하면 package.json 기준으로 재정리해서 반영)

---

## 프로젝트 구조(요약)
레포가 “Spring Boot 내부 프론트 포함” 형태라면 보통 아래 구조를 사용합니다.
(실제 폴더명이 다르면, 트리 기준으로 README 구조 섹션을 맞춰 수정해야 합니다.)

## 실행 방법(프론트)

프론트 프로젝트 폴더에서:

```bash
npm install
npm start
```
접속: http://localhost:3000

- 참고: `npm run dev`(Vite)인지 `npm start`(CRA)인지는 현재 대화에 “명시된 실행 스크립트”가 없어, 위는 가장 보수적인 형태로만 표기했습니다.  
  (근거 부족: 실제 프로젝트의 `package.json`의 `scripts`를 확인하지 못해 실행 스크립트는 달라질 수 있습니다.)

---

## 백엔드 API 설계 규칙(요약)

- Base: `/api`
- Auth: `Authorization: Bearer <accessToken>`
- 응답(권장): `success(boolean)`, `data(any)`, `message?(string)`, `errorCode?(string)`

### 시간
- 서버 저장: UTC
- 요청/응답 날짜시간: ISO 8601 (예: `2025-12-14T09:30:00Z`)
- `Event.timeZone`은 필수

### 반복 인스턴스 식별
- `occurrenceStart` = `YYYY-MM-DDTHH:mm` (로컬 기준 문자열, 예: `2025-12-14T09:30`)

---

## 개발 메모

- 개발 중 환경에서는 localStorage 접근 제한(브라우저/정책)에 따라 “새로고침 시 저장 유지”가 깨질 수 있습니다.
- 반복 일정/공유 권한(editScope/deleteScope 등) 로직은 서버 검증 규칙을 강하게 적용하는 전제를 둡니다.

---

## 라이선스

개발 중인 프로토타입(내부/개인 프로젝트)입니다.
