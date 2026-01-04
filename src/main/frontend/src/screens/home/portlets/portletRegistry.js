import QuickNavPortlet from "./QuickNavPortlet";
import TodayEventsPortlet from "./TodayEventsPortlet";
import DdayPinnedPortlet from "./DdayPinnedPortlet";

import UpcomingEvents7dPortlet from "./UpcomingEvents7dPortlet";
import MonthCalendarPortlet from "./MonthCalendarPortlet";

import FocusPomodoroPortlet from "./FocusPomodoroPortlet";
import TodayMemoPortlet from "./TodayMemoPortlet";
import TaskSummaryPortlet from "./TaskSummaryPortlet";
import PlanVsActualPortlet from "./PlanVsActualPortlet";

export const PORTLETS_BY_ID = {
  quickNav: {
    id: "quickNav",
    title: "빠른 이동",
    subtitle: "자주 가는 화면 바로가기",
    route: null,
    component: QuickNavPortlet,
  },

  todayEvents: {
    id: "todayEvents",
    title: "오늘 일정",
    subtitle: "요약/검색/빠른 추가 (EVT-001/003/006/007 요약)",
    route: "/planner/daily",
    component: TodayEventsPortlet,
  },

  ddayPinned: {
    id: "ddayPinned",
    title: "D-Day",
    subtitle: "핀/정렬/홈 위젯 (EVT-004, HOME-003)",
    route: null,
    component: DdayPinnedPortlet,
  },

  planActual: {
    id: "planActual",
    title: "계획 대비 실행",
    subtitle: "오늘/이번 주/이번 달 달성률",
    route: "/insight/stat",
    component: PlanVsActualPortlet,
  },

  todayMemo: {
    id: "todayMemo",
    title: "오늘 메모",
    subtitle: "오늘의 기록을 남기세요",
    route: "/action/diary",
    component: TodayMemoPortlet,
  },

  monthCalendar: {
    id: "monthCalendar",
    title: "한 달 일정",
    subtitle: "월간 캘린더 요약",
    route: "/planner/monthly",
    component: MonthCalendarPortlet,
  },

  upcoming7d: {
    id: "upcoming7d",
    title: "다가오는 일정 (7일)",
    subtitle: "기간/키워드 기반 요약 (EVT-001 요약)",
    route: "/planner/weekly",
    component: UpcomingEvents7dPortlet,
  },

  focusPomodoro: {
    id: "focusPomodoro",
    title: "포커스",
    subtitle: "포모도로 빠른 시작",
    route: "/focus",
    component: FocusPomodoroPortlet,
  },

  taskSummary: {
    id: "taskSummary",
    title: "오늘 할 일",
    subtitle: "오늘 태스크 요약",
    route: "/action/task",
    component: TaskSummaryPortlet,
  },
};

export const DEFAULT_VISIBLE = {
  quickNav: true,
  todayEvents: true,
  ddayPinned: true,

  planActual: true,
  monthCalendar: true,
  upcoming7d: true,

  taskSummary: true,
  focusPomodoro: true,
  todayMemo: true,
};

// react-grid-layout layouts
export const DEFAULT_LAYOUTS = {
  lg: [
    { i: "quickNav", x: 0, y: 0, w: 3, h: 7 },
    { i: "todayEvents", x: 3, y: 0, w: 6, h: 9 },
    { i: "ddayPinned", x: 9, y: 0, w: 3, h: 9 },

    { i: "monthCalendar", x: 0, y: 9, w: 7, h: 10 },
    { i: "upcoming7d", x: 7, y: 9, w: 5, h: 10 },

    { i: "planActual", x: 0, y: 19, w: 4, h: 7 },
    { i: "taskSummary", x: 4, y: 19, w: 4, h: 7 },
    { i: "focusPomodoro", x: 8, y: 19, w: 4, h: 7 },

    { i: "todayMemo", x: 0, y: 26, w: 12, h: 8 },
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

    { i: "todayMemo", x: 0, y: 43, w: 12, h: 8 },
  ],
  sm: [
    { i: "quickNav", x: 0, y: 0, w: 6, h: 7 },
    { i: "todayEvents", x: 0, y: 7, w: 6, h: 9 },
    { i: "ddayPinned", x: 0, y: 16, w: 6, h: 8 },
    { i: "planActual", x: 0, y: 24, w: 6, h: 7 },
    { i: "monthCalendar", x: 0, y: 31, w: 6, h: 10 },
    { i: "upcoming7d", x: 0, y: 41, w: 6, h: 9 },
    { i: "taskSummary", x: 0, y: 50, w: 6, h: 7 },
    { i: "focusPomodoro", x: 0, y: 57, w: 6, h: 7 },
    { i: "todayMemo", x: 0, y: 64, w: 6, h: 8 },
  ],
  xs: [
    { i: "quickNav", x: 0, y: 0, w: 4, h: 7 },
    { i: "todayEvents", x: 0, y: 7, w: 4, h: 9 },
    { i: "ddayPinned", x: 0, y: 16, w: 4, h: 8 },
    { i: "planActual", x: 0, y: 24, w: 4, h: 7 },
    { i: "monthCalendar", x: 0, y: 31, w: 4, h: 10 },
    { i: "upcoming7d", x: 0, y: 41, w: 4, h: 9 },
    { i: "taskSummary", x: 0, y: 50, w: 4, h: 7 },
    { i: "focusPomodoro", x: 0, y: 57, w: 4, h: 7 },
    { i: "todayMemo", x: 0, y: 64, w: 4, h: 8 },
  ],
  xxs: [
    { i: "quickNav", x: 0, y: 0, w: 2, h: 7 },
    { i: "todayEvents", x: 0, y: 7, w: 2, h: 9 },
    { i: "ddayPinned", x: 0, y: 16, w: 2, h: 8 },
    { i: "planActual", x: 0, y: 24, w: 2, h: 7 },
    { i: "monthCalendar", x: 0, y: 31, w: 2, h: 10 },
    { i: "upcoming7d", x: 0, y: 41, w: 2, h: 9 },
    { i: "taskSummary", x: 0, y: 50, w: 2, h: 7 },
    { i: "focusPomodoro", x: 0, y: 57, w: 2, h: 7 },
    { i: "todayMemo", x: 0, y: 64, w: 2, h: 8 },
  ],
};
