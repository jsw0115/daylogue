# TimeFlow - 시간관리 앱

타임바 다이어리로 시간을 색으로 관리하는 올인원 생산성 툴

## 프로젝트 개요

TimeFlow는 하루를 텍스트 목록이 아니라 색 블록(타임바)로 시각화하는 혁신적인 시간관리 앱입니다.

### 핵심 기능

- **타임바 다이어리**: 시간을 색 블록으로 시각화
- **플래너**: 일/주/월/연간 계획 관리
- **집중 모드**: 포모도로 타이머 기반 집중 세션
- **할 일 관리**: 우선순위 기반 태스크 관리
- **루틴 관리**: 반복 습관 추적
- **다이어리**: 감정과 함께하는 회고
- **메모**: 빠른 메모 및 할 일 변환
- **통계**: Plan vs Actual 비교 및 인사이트

### 사용자 유형

- **J형 (계획형)**: 사전 계획을 선호하는 사용자
- **P형 (즉흥형)**: 실시간 기록을 선호하는 사용자

## 기술 스택

- **프론트엔드**: React 18
- **라우팅**: React Router v6
- **스타일링**: Tailwind CSS v4
- **상태관리**: Zustand
- **차트**: Recharts
- **아이콘**: Lucide React
- **날짜**: date-fns
- **빌드 도구**: Vite

## 프로젝트 구조

```
├─ public/                   # 정적 파일
│  ├─ manifest.webmanifest  # PWA 매니페스트
│  └─ robots.txt
│
├─ src/
│  ├─ main.jsx              # 엔트리 포인트
│  ├─ App.jsx               # 메인 앱 컴포넌트
│  ├─ routes.jsx            # 라우팅 설정
│  │
│  ├─ layout/               # 레이아웃 컴포넌트
│  │  ├─ AppShell.jsx       # 메인 레이아웃
│  │  ├─ Sidebar.jsx        # 사이드바 네비게이션
│  │  ├─ Header.jsx         # 헤더
│  │  ├─ MobileBottomNav.jsx # 모바일 하단 네비
│  │  └─ PageContainer.jsx  # 페이지 컨테이너
│  │
│  ├─ components/           # 재사용 가능한 컴포넌트
│  │  ├─ common/            # 공통 컴포넌트
│  │  │  ├─ Button.jsx
│  │  │  ├─ Modal.jsx
│  │  │  └─ TextInput.jsx
│  │  │
│  │  └─ planner/           # 플래너 전용 컴포넌트
│  │     ├─ TimebarTimeline.jsx       # 일간 타임바
│  │     ├─ WeeklyTimeBricks.jsx      # 주간 타임 브릭
│  │     └─ MonthlyCategoryDots.jsx   # 월간 카테고리 표시
│  │
│  ├─ screens/              # 화면 컴포넌트
│  │  ├─ home/              # 홈 대시보드
│  │  ├─ plan/              # 플래너 (일/주/월)
│  │  ├─ focus/             # 집중 모드
│  │  ├─ task/              # 할 일
│  │  ├─ diary/             # 다이어리
│  │  └─ stat/              # 통계
│  │
│  ├─ shared/               # 공유 리소스
│  │  ├─ constants/         # 상수
│  │  │  ├─ routes.js       # 라우트 경로
│  │  │  ├─ categories.js   # 기본 카테고리
│  │  │  └─ breakpoints.js  # 반응형 브레이크포인트
│  │  │
│  │  ├─ hooks/             # 커스텀 훅
│  │  │  ├─ useResponsiveLayout.js
│  │  │  ├─ useModal.js
│  │  │  └─ useTimeRange.js
│  │  │
│  │  ├─ store/             # Zustand 스토어
│  │  │  ├─ authStore.js
│  │  │  ├─ settingsStore.js
│  │  │  └─ timebarStore.js
│  │  │
│  │  └─ utils/             # 유틸리티 함수
│  │     ├─ dateUtils.js
│  │     ├─ timeUtils.js
│  │     └─ formatUtils.js
│  │
│  └─ styles/               # 스타일 파일
│     ├─ index.css          # 메인 스타일
│     ├─ layout.css         # 레이아웃 스타일
│     └─ components.css     # 컴포넌트 스타일
│
├─ package.json
├─ vite.config.js
└─ index.html
```

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 프로덕션 빌드

```bash
npm run build
```

### 프리뷰

```bash
npm run preview
```

## 주요 화면

### 1. 홈 대시보드 (/)
- 오늘의 통계 요약
- 빠른 실행 버튼
- 오늘의 타임바 미리보기

### 2. 일간 플래너 (/planner/daily)
- 세로 타임라인 타임바
- 드래그로 일정 생성
- Plan/Actual 토글
- 카테고리별 색상 구분

### 3. 주간 플래너 (/planner/weekly)
- 7일간 타임 브릭 뷰
- 일별 비교
- 주간 통계

### 4. 월간 플래너 (/planner/monthly)
- 캘린더 뷰
- 일별 카테고리 닷 표시
- 월간 통계

### 5. 집중 모드 (/focus)
- 포모도로 타이머
- 카테고리별 집중 기록
- 집중 시간 통계

### 6. 할 일 (/tasks)
- 우선순위 관리
- 필터링 (전체/진행중/완료)
- 체크리스트

### 7. 다이어리 (/diary)
- 월별 캘린더 뷰
- 감정 이모지
- 작성률 통계

### 8. 통계 (/stats)
- Plan vs Actual 차트
- 카테고리별 시간 분포
- 주간 달성률
- AI 인사이트

## 반응형 디자인

- **모바일** (< 768px): 하단 탭 네비게이션
- **태블릿** (768px - 1024px): 오버레이 사이드바
- **데스크톱** (> 1024px): 고정 사이드바

## 상태 관리

### authStore
- 사용자 인증 상태
- 사용자 모드 (J/P형)

### settingsStore
- 테마 설정
- 카테고리 관리
- 시간대 설정
- 알림 설정

### timebarStore
- 타임블록 관리
- 실시간 기록
- 날짜별 필터링

## 카테고리 시스템

기본 제공 카테고리:
- 📚 공부 (indigo)
- 💼 업무 (purple)
- 💪 건강 (green)
- ❤️ 가족·연인 (rose)
- 👥 친구 (amber)
- 🎨 취미·휴식 (blue)
- 📦 기타 (gray)

사용자 정의 카테고리 추가 가능

## 개발 가이드

### 새 화면 추가

1. `/src/screens/` 하위에 화면 컴포넌트 생성
2. `/src/routes.jsx`에 라우트 등록
3. 필요시 사이드바에 메뉴 추가 (`/src/layout/Sidebar.jsx`)

### 새 컴포넌트 추가

- 공통 컴포넌트: `/src/components/common/`
- 기능별 컴포넌트: `/src/components/{feature}/`

### 스타일링 가이드

- Tailwind CSS 유틸리티 클래스 사용
- 공통 스타일은 CSS 변수 활용
- 컴포넌트별 클래스는 `/src/styles/components.css`

## 라이센스

이 프로젝트는 개발 중인 프로토타입입니다.

## 문의

개발 관련 문의사항이 있으시면 이슈를 등록해주세요.
