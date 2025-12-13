import QuickNavPortlet from "./QuickNavPortlet";
import UpcomingEvents7dPortlet from "./UpcomingEvents7dPortlet";
import FocusPomodoroPortlet from "./FocusPomodoroPortlet";
import MonthCalendarPortlet from "./MonthCalendarPortlet";
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
  planActual: {
    id: "planActual",
    title: "계획 대비 실행",
    subtitle: "오늘/이번 주/이번 달 달성률",
    route: "/insight/stat",
    component: PlanVsActualPortlet,
  },
  todayMemo: {
    id: "todayMemo",
    title: "오늘 메모 & 좌우명",
    subtitle: "오늘의 기록을 남기세요",
    route: "/action/diary",
    component: TodayMemoPortlet,
  },
  monthCalendar: {
    id: "monthCalendar",
    title: "한 달 일정",
    subtitle: "캘린더 + 선택 날짜 요약",
    route: "/planner/monthly",
    component: MonthCalendarPortlet,
  },
  upcoming7d: {
    id: "upcoming7d",
    title: "다가오는 일정 (7일)",
    subtitle: "가까운 일정만 빠르게",
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
  planActual: true,
  todayMemo: true,
  monthCalendar: true,
  upcoming7d: true,
  focusPomodoro: true,
  taskSummary: true,
};

// react-grid-layout layouts
export const DEFAULT_LAYOUTS = {
  lg: [
    { i: "quickNav", x: 0, y: 0, w: 4, h: 7 },
    { i: "planActual", x: 4, y: 0, w: 4, h: 7 },
    { i: "todayMemo", x: 8, y: 0, w: 4, h: 9 },

    { i: "monthCalendar", x: 0, y: 7, w: 8, h: 10 },
    { i: "upcoming7d", x: 8, y: 9, w: 4, h: 8 },

    { i: "focusPomodoro", x: 0, y: 17, w: 6, h: 8 },
    { i: "taskSummary", x: 6, y: 17, w: 6, h: 8 },
  ],
  md: [
    { i: "quickNav", x: 0, y: 0, w: 6, h: 7 },
    { i: "planActual", x: 6, y: 0, w: 6, h: 7 },
    { i: "todayMemo", x: 0, y: 7, w: 12, h: 9 },
    { i: "monthCalendar", x: 0, y: 16, w: 12, h: 10 },
    { i: "upcoming7d", x: 0, y: 26, w: 12, h: 8 },
    { i: "focusPomodoro", x: 0, y: 34, w: 6, h: 8 },
    { i: "taskSummary", x: 6, y: 34, w: 6, h: 8 },
  ],
  sm: [
    { i: "quickNav", x: 0, y: 0, w: 6, h: 7 },
    { i: "planActual", x: 0, y: 7, w: 6, h: 7 },
    { i: "todayMemo", x: 0, y: 14, w: 6, h: 9 },
    { i: "monthCalendar", x: 0, y: 23, w: 6, h: 10 },
    { i: "upcoming7d", x: 0, y: 33, w: 6, h: 8 },
    { i: "focusPomodoro", x: 0, y: 41, w: 6, h: 8 },
    { i: "taskSummary", x: 0, y: 49, w: 6, h: 8 },
  ],
  xs: [
    { i: "quickNav", x: 0, y: 0, w: 4, h: 7 },
    { i: "planActual", x: 0, y: 7, w: 4, h: 7 },
    { i: "todayMemo", x: 0, y: 14, w: 4, h: 9 },
    { i: "monthCalendar", x: 0, y: 23, w: 4, h: 10 },
    { i: "upcoming7d", x: 0, y: 33, w: 4, h: 8 },
    { i: "focusPomodoro", x: 0, y: 41, w: 4, h: 8 },
    { i: "taskSummary", x: 0, y: 49, w: 4, h: 8 },
  ],
  xxs: [
    { i: "quickNav", x: 0, y: 0, w: 2, h: 7 },
    { i: "planActual", x: 0, y: 7, w: 2, h: 7 },
    { i: "todayMemo", x: 0, y: 14, w: 2, h: 9 },
    { i: "monthCalendar", x: 0, y: 23, w: 2, h: 10 },
    { i: "upcoming7d", x: 0, y: 33, w: 2, h: 8 },
    { i: "focusPomodoro", x: 0, y: 41, w: 2, h: 8 },
    { i: "taskSummary", x: 0, y: 49, w: 2, h: 8 },
  ],
};
