import QuickNavPortlet from "./QuickNavPortlet";
import TodayEventsPortlet from "./TodayEventsPortlet";
import DdayPinnedPortlet from "./DdayPinnedPortlet";

import UpcomingEvents7dPortlet from "./UpcomingEvents7dPortlet";
import MonthCalendarPortlet from "./MonthCalendarPortlet";

import FocusPomodoroPortlet from "./FocusPomodoroPortlet";
import TodayMemoPortlet from "./TodayMemoPortlet";
import TaskSummaryPortlet from "./TaskSummaryPortlet";
import PlanVsActualPortlet from "./PlanVsActualPortlet";

import NoticePortlet from "./NoticePortlet";
import RoutineTodayPortlet from "./RoutineTodayPortlet";

export const BREAKPOINTS = ["lg", "md", "sm", "xs", "xxs"];

export const PORTLETS_BY_ID = {
  quickNav: {
    id: "quickNav",
    title: "빠른 이동",
    subtitle: "자주 가는 화면 바로가기",
    route: null,
    component: QuickNavPortlet,
    sizes: { all: { minW: 3, minH: 6, maxW: 6, maxH: 10 } },
  },

  todayEvents: {
    id: "todayEvents",
    title: "오늘 일정",
    subtitle: "요약/검색/빠른 추가 (EVT-001/003/006/007 요약)",
    route: "/planner/daily",
    component: TodayEventsPortlet,
    sizes: { all: { minW: 3, minH: 6, maxW: 6, maxH: 10 } },
  },

  ddayPinned: {
    id: "ddayPinned",
    title: "D-Day",
    subtitle: "핀/정렬/홈 위젯 (EVT-004, HOME-003)",
    route: null,
    component: DdayPinnedPortlet,
    sizes: { all: { minW: 3, minH: 6, maxW: 6, maxH: 10 } },
  },

  planActual: {
    id: "planActual",
    title: "계획 대비 실행",
    subtitle: "오늘/이번 주/이번 달 달성률",
    route: "/insight/stat",
    component: PlanVsActualPortlet,
    sizes: { all: { minW: 3, minH: 6, maxW: 6, maxH: 10 } },
  },

  taskSummary: {
    id: "taskSummary",
    title: "오늘 할 일",
    subtitle: "오늘 태스크 요약",
    route: "/action/task",
    component: TaskSummaryPortlet,
    sizes: { all: { minW: 3, minH: 6, maxW: 6, maxH: 10 } },
  },

  routineToday: {
    id: "routineToday",
    title: "오늘의 루틴 달성",
    subtitle: "오늘 루틴 진행률/체크",
    route: "/action/routine",
    component: RoutineTodayPortlet,
    sizes: { all: { minW: 4, minH: 6, maxW: 6, maxH: 10 } },
  },

  focusPomodoro: {
    id: "focusPomodoro",
    title: "포커스",
    subtitle: "포모도로 빠른 시작",
    route: "/focus",
    component: FocusPomodoroPortlet,
    sizes: { all: { minW: 3, minH: 6, maxW: 6, maxH: 10 } },
  },

  notice: {
    id: "notice",
    title: "공지",
    subtitle: "중요 공지/업데이트/운영 메시지",
    route: null,
    component: NoticePortlet,
    sizes: { all: { minW: 4, minH: 6, maxW: 8, maxH: 12 } },
  },

  todayMemo: {
    id: "todayMemo",
    title: "오늘 메모",
    subtitle: "오늘의 기록을 남기세요",
    route: "/action/diary",
    component: TodayMemoPortlet,
    // 공지와 동일한 “너비 성격”으로 쓰기 위해 크기 범위도 동일하게 맞춤
    sizes: { all: { minW: 4, minH: 6, maxW: 8, maxH: 12 } },
  },

  monthCalendar: {
    id: "monthCalendar",
    title: "한 달 일정",
    subtitle: "월간 캘린더 요약",
    route: "/planner/monthly",
    component: MonthCalendarPortlet,
    bodyOverflow: "hidden",
    sizes: {
      // 스크롤 방지 유지: 세로 고정(최소=최대)
      lg: { minW: 7, maxW: 8, minH: 10, maxH: 10 },
      md: { minW: 10, maxW: 12, minH: 10, maxH: 10 },
      sm: { minW: 6, maxW: 6, minH: 10, maxH: 10 },
      xs: { minW: 4, maxW: 4, minH: 10, maxH: 10 },
      xxs: { minW: 2, maxW: 2, minH: 10, maxH: 10 },
    },
  },

  upcoming7d: {
    id: "upcoming7d",
    title: "다가오는 일정 (7일)",
    subtitle: "기간/키워드 기반 요약 (EVT-001 요약)",
    route: "/planner/weekly",
    component: UpcomingEvents7dPortlet,
    sizes: { all: { minW: 4, minH: 8, maxW: 12, maxH: 14 } },
  },
};

export const DEFAULT_VISIBLE = {
  quickNav: true,
  todayEvents: true,
  ddayPinned: true,

  monthCalendar: true,
  upcoming7d: true,

  planActual: true,
  taskSummary: true,
  routineToday: true,

  notice: true,
  focusPomodoro: true,
  todayMemo: true,
};

export const DEFAULT_LAYOUTS = {
  lg: [
    { i: "quickNav", x: 0, y: 0, w: 3, h: 7 },
    { i: "todayEvents", x: 3, y: 0, w: 6, h: 9 },
    { i: "ddayPinned", x: 9, y: 0, w: 3, h: 9 },

    { i: "monthCalendar", x: 0, y: 9, w: 7, h: 10 },
    { i: "upcoming7d", x: 7, y: 9, w: 5, h: 10 },

    // 루틴을 “실행/할일” 라인으로 올림(위치 조절)
    { i: "planActual", x: 0, y: 19, w: 4, h: 7 },
    { i: "taskSummary", x: 4, y: 19, w: 4, h: 7 },
    { i: "routineToday", x: 8, y: 19, w: 4, h: 7 },

    // 공지/포커스/메모 라인, 메모 너비 = 공지 너비(4)
    { i: "notice", x: 0, y: 26, w: 4, h: 7 },
    { i: "focusPomodoro", x: 4, y: 26, w: 4, h: 7 },
    { i: "todayMemo", x: 8, y: 26, w: 4, h: 7 },
  ],

  md: [
    { i: "quickNav", x: 0, y: 0, w: 6, h: 7 },
    { i: "todayEvents", x: 6, y: 0, w: 6, h: 9 },

    { i: "ddayPinned", x: 0, y: 9, w: 6, h: 8 },
    { i: "planActual", x: 6, y: 9, w: 6, h: 7 },

    { i: "monthCalendar", x: 0, y: 17, w: 12, h: 10 },
    { i: "upcoming7d", x: 0, y: 27, w: 12, h: 9 },

    { i: "taskSummary", x: 0, y: 36, w: 6, h: 7 },
    { i: "focusPomodoro", x: 6, y: 36, w: 6, h: 7 },

    // 공지(6) = 오늘 메모(6)
    { i: "notice", x: 0, y: 43, w: 6, h: 7 },
    { i: "todayMemo", x: 6, y: 43, w: 6, h: 7 },

    // 루틴은 다음 줄로(가독성)
    { i: "routineToday", x: 0, y: 50, w: 12, h: 7 },
  ],

  sm: [
    { i: "quickNav", x: 0, y: 0, w: 6, h: 7 },
    { i: "todayEvents", x: 0, y: 7, w: 6, h: 9 },
    { i: "ddayPinned", x: 0, y: 16, w: 6, h: 8 },
    { i: "planActual", x: 0, y: 24, w: 6, h: 7 },
    { i: "monthCalendar", x: 0, y: 31, w: 6, h: 10 },
    { i: "upcoming7d", x: 0, y: 41, w: 6, h: 9 },

    { i: "taskSummary", x: 0, y: 50, w: 6, h: 7 },
    { i: "routineToday", x: 0, y: 57, w: 6, h: 7 },
    { i: "focusPomodoro", x: 0, y: 64, w: 6, h: 7 },
    { i: "notice", x: 0, y: 71, w: 6, h: 7 },
    { i: "todayMemo", x: 0, y: 78, w: 6, h: 7 },
  ],

  xs: [
    { i: "quickNav", x: 0, y: 0, w: 4, h: 7 },
    { i: "todayEvents", x: 0, y: 7, w: 4, h: 9 },
    { i: "ddayPinned", x: 0, y: 16, w: 4, h: 8 },
    { i: "planActual", x: 0, y: 24, w: 4, h: 7 },
    { i: "monthCalendar", x: 0, y: 31, w: 4, h: 10 },
    { i: "upcoming7d", x: 0, y: 41, w: 4, h: 9 },

    { i: "taskSummary", x: 0, y: 50, w: 4, h: 7 },
    { i: "routineToday", x: 0, y: 57, w: 4, h: 7 },
    { i: "focusPomodoro", x: 0, y: 64, w: 4, h: 7 },
    { i: "notice", x: 0, y: 71, w: 4, h: 7 },
    { i: "todayMemo", x: 0, y: 78, w: 4, h: 7 },
  ],

  xxs: [
    { i: "quickNav", x: 0, y: 0, w: 2, h: 7 },
    { i: "todayEvents", x: 0, y: 7, w: 2, h: 9 },
    { i: "ddayPinned", x: 0, y: 16, w: 2, h: 8 },
    { i: "planActual", x: 0, y: 24, w: 2, h: 7 },
    { i: "monthCalendar", x: 0, y: 31, w: 2, h: 10 },
    { i: "upcoming7d", x: 0, y: 41, w: 2, h: 9 },

    { i: "taskSummary", x: 0, y: 50, w: 2, h: 7 },
    { i: "routineToday", x: 0, y: 57, w: 2, h: 7 },
    { i: "focusPomodoro", x: 0, y: 64, w: 2, h: 7 },
    { i: "notice", x: 0, y: 71, w: 2, h: 7 },
    { i: "todayMemo", x: 0, y: 78, w: 2, h: 7 },
  ],
};
