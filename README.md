# Timebar Diary (TimeFlow) 🎨⏳

**Timebar Diary**는 시간을 "색(Timebar)"으로 시각화하여 관리하는 **올인원 생산성 플랫폼** 프로토타입입니다.
단순한 일정 관리를 넘어, **플래너, 다이어리, 할 일(To-Do), 루틴, 포커스(Pomodoro), 통계**를 하나의 흐름(Flow)으로 통합하여 제공합니다.

---

## 📚 목차

1. [프로젝트 소개](#-프로젝트-소개)
2. [주요 기능](#-주요-기능)
3. [시작하기](#-시작하기)
4. [기술 스택](#-기술-스택)
5. [프로젝트 구조 및 라우팅](#-프로젝트-구조-및-라우팅)
6. [개발 규칙](#-개발-규칙)

---

## 📖 프로젝트 소개

TimeFlow는 사용자의 하루를 색상 띠(Timebar)로 표현합니다. 계획된 일정과 실제 수행한 기록을 시각적으로 비교하고, 루틴과 할 일을 체계적으로 관리하여 생산성을 극대화하는 것을 목표로 합니다.

### 핵심 가치
- **Visual Time Management**: 직관적인 타임바 인터페이스
- **All-in-One Workflow**: 플래너에서 회고(Diary)까지 끊김 없는 경험
- **Data-Driven Insight**: 활동 로그 기반의 상세 통계 제공

---

## ✨ 주요 기능

### 1. 📅 Smart Planner (플래너)
- **다양한 뷰 모드**: 일간(Daily), 주간(Weekly), 월간(Monthly), 연간(Yearly) 뷰 지원
- **드래그 앤 드롭**: 직관적인 일정 시간 변경 및 이동
- **스마트 입력**: 일정 생성 시 입력 칩(Chip)과 자동완성을 통한 빠른 태그 및 공유 설정
- **반복 일정**: 복잡한 반복 규칙(매주, 매월 등)을 지원하며 캘린더에 자동 표시

### 2. 📝 Daily Log & Diary (기록)
- **데일리 다이어리**: 하루의 감정과 주요 사건 기록
- **타임바 연동**: 일정 수행 여부를 체크하고 실제 소요 시간 기록

### 3. ✅ Action Hub (실행)
- **Tasks (할 일)**: GTD 방식의 할 일 관리, 인박스 및 프로젝트별 분류
- **Routines (루틴)**: 매일 반복되는 습관 관리, 알림 및 아이콘 커스텀
- **Focus (집중)**: 포모도로 타이머 및 집중 시간 추적

### 4. 📊 Insight (통계)
- **생활 패턴 분석**: 카테고리별 시간 사용량 분석
- **계획 vs 실행**: 계획 대비 달성률 시각화 리포트

### 5. ⚙️ Management (관리)
- **커스텀 설정**: 테마, 알림, 카테고리 색상 설정
- **데이터 관리**: 데이터 백업 및 복원

---

## 🚀 시작하기 (Getting Started)

이 프로젝트는 **React** (Create React App) 환경에서 개발되었습니다.

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm start
   ```
   - 브라우저에서 http://localhost:3000으로 접속됩니다.

### 빌드 및 기타

| 명령어 | 설명 |
|---|---|
| `npm run build` | 프로덕션 배포를 위한 정적 파일을 `build` 폴더에 생성합니다. |
| `npm test` | 테스트 러너를 실행합니다. |

---

## 🛠 기술 스택 (Tech Stack)

| 분류 | 기술 | 비고 |
|---|---|---|
| **Core** | React 18 | Hooks 중심의 함수형 컴포넌트 |
| **Routing** | React Router v6 | SPA 라우팅 처리 |
| **Styling** | CSS Modules / Custom CSS | className 기반 스타일링 |
| **Build** | Webpack (CRA) | Create React App 기본 설정 |

---

## 📂 프로젝트 구조 및 라우팅

애플리케이션은 크게 인증이 필요한 **App (Main)** 영역과 인증 전 **Auth** 영역으로 구분됩니다.

### 🔐 Auth (Standalone)
레이아웃(LNB, Header) 없이 단독 화면으로 구성됩니다.
- `/login`, `/register`: 로그인 및 회원가입
- `/onboarding`: 신규 사용자 온보딩
- `/reset-password`, `/find-id`: 계정 찾기

### 🏠 App (Main Layout)
사이드바(LNB)와 헤더가 포함된 메인 레이아웃이 적용됩니다.

| 영역 | 경로 | 설명 |
|---|---|---|
| **Dashboard** | `/home` | 메인 대시보드 (오늘의 요약) |
| | `/inbox` | 알림 및 미처리 항목 인박스 |
| **Planner** | `/planner/*` | 일간/주간/월간/연간 플래너 |
| **Action** | `/tasks` | 할 일 목록 관리 |
| | `/routine` | 루틴 목록 및 체크 |
| | `/focus` | 집중 모드 (타이머) |
| | `/memos` | 빠른 메모 작성 |
| **Insight** | `/diary/daily` | 데일리 다이어리 |
| | `/insight/stat` | 통계 대시보드 |
| **System** | `/settings` | 사용자 환경 설정 |
| | `/admin` | 관리자 페이지 |

---

## 📡 백엔드 연동 규칙 (API Convention)

- **Base URL**: `/api`
- **Authentication**: JWT 기반 (`Authorization: Bearer <token>`)
- **Date/Time Format**:
  - Request/Response: **ISO 8601** (`YYYY-MM-DDTHH:mm:ssZ`)
  - Server Storage: **UTC**
- **Recurring Events**: 반복 일정은 `occurrenceStart` 필드로 개별 인스턴스를 식별합니다.

---

## 📝 라이선스

Copyright © 2026 Timebar Diary Project. All rights reserved.
(현재 내부 프로토타입 개발 단계입니다.)
