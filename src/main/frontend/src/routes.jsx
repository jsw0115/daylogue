// FILE: src/main/frontend/src/routes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { ROUTES } from "./shared/constants/routes";

// Auth / Onboarding
import AuthLoginScreen from "./screens/auth/AuthLoginScreen";
import AuthRegisterScreen from "./screens/auth/AuthRegisterScreen";
import AuthPasswordResetScreen from "./screens/auth/AuthPasswordResetScreen";
import AuthSocialLinkScreen from "./screens/auth/AuthSocialLinkScreen";
import OnboardingScreen from "./screens/auth/OnboardingScreen";

// Home
import HomeDashboardScreen from "./screens/home/HomeDashboardScreen";
import NotificationInboxScreen from "./screens/home/NotificationInboxScreen";

// Planner
import DailyPlannerScreen from "./screens/plan/DailyPlannerScreen";
import WeeklyPlannerScreen from "./screens/plan/WeeklyPlannerScreen";
import MonthlyPlannerScreen from "./screens/plan/MonthlyPlannerScreen";
import YearlyOverviewScreen from "./screens/plan/YearlyOverviewScreen";
import PlannerTemplateScreen from "./screens/plan/PlannerTemplateScreen";
import CanvasBoardScreen from "./screens/plan/CanvasBoardScreen";

// Focus
import FocusSessionScreen from "./screens/focus/FocusSessionScreen";

// Event
import EventListScreen from "./screens/event/EventListScreen";
import EventDetailScreen from "./screens/event/EventDetailScreen";
import EventEditScreen from "./screens/event/EventEditScreen";
import DdayListScreen from "./screens/event/DdayListScreen";

// Task
import TaskListScreen from "./screens/task/TaskListScreen";
import TaskDetailScreen from "./screens/task/TaskDetailScreen";

// Routine
import RoutineListScreen from "./screens/routine/RoutineListScreen";
import RoutineEditScreen from "./screens/routine/RoutineEditScreen";
import RoutineHistoryScreen from "./screens/routine/RoutineHistoryScreen";

// Diary
import DiaryCalendarScreen from "./screens/diary/DiaryCalendarScreen";
import DailyDiaryScreen from "./screens/diary/DailyDiaryScreen";

// Memo
import MemoInboxScreen from "./screens/memo/MemoInboxScreen";
import MemoEditScreen from "./screens/memo/MemoEditScreen";
import MemoToTaskScreen from "./screens/memo/MemoToTaskScreen";

// Stat
import StatDashboardScreen from "./screens/stat/StatDashboardScreen";
import StatCategoryScreen from "./screens/stat/StatCategoryScreen";
import StatPlanActualScreen from "./screens/stat/StatPlanActualScreen";
import StatFocusReportScreen from "./screens/stat/StatFocusReportScreen";

// Share
import FriendListScreen from "./screens/share/FriendListScreen";
import CalendarGroupScreen from "./screens/share/CalendarGroupScreen";
import ShareVisibilityScreen from "./screens/share/ShareVisibilityScreen";

// Settings
import ProfileScreen from "./screens/settings/ProfileScreen";
import GeneralSettingsScreen from "./screens/settings/GeneralSettingsScreen";
import ThemeStickerSettingsScreen from "./screens/settings/ThemeStickerSettingsScreen";
import NotificationSettingsScreen from "./screens/settings/NotificationSettingsScreen";
import SecuritySettingsScreen from "./screens/settings/SecuritySettingsScreen";
import CategoryColorSettingsScreen from "./screens/settings/CategoryColorSettingsScreen";

// Admin
import AdminUserScreen from "./screens/admin/AdminUserScreen";
import AdminLogScreen from "./screens/admin/AdminLogScreen";
import AdminNoticeScreen from "./screens/admin/AdminNoticeScreen";
import AdminStatsScreen from "./screens/admin/AdminStatsScreen";

export function AppRoutes() {
  return (
    <Routes>
      {/* 기본 진입: PLAN-001 일간 플래너 */}
      <Route
        path="/"
        element={<Navigate to={ROUTES.PLAN_DAILY} replace />}
      />

      {/* Auth / Onboarding */}
      <Route path="/login" element={<AuthLoginScreen />} />
      <Route path="/register" element={<AuthRegisterScreen />} />
      <Route
        path="/password-reset"
        element={<AuthPasswordResetScreen />}
      />
      <Route path="/social-link" element={<AuthSocialLinkScreen />} />
      <Route path="/onboarding" element={<OnboardingScreen />} />

      {/* HOME-001, HOME-002 */}
      <Route path={ROUTES.HOME} element={<HomeDashboardScreen />} />
      <Route path="/inbox" element={<NotificationInboxScreen />} />

      {/* PLAN-001 ~ PLAN-004 */}
      <Route
        path={ROUTES.PLAN_DAILY}
        element={<DailyPlannerScreen />}
      />
      <Route
        path={ROUTES.PLAN_WEEKLY}
        element={<WeeklyPlannerScreen />}
      />
      <Route
        path={ROUTES.PLAN_MONTHLY}
        element={<MonthlyPlannerScreen />}
      />
      <Route
        path={ROUTES.PLAN_YEARLY}
        element={<YearlyOverviewScreen />}
      />

      {/* PLAN-005, PLAN-006 (템플릿/캔버스 보드) */}
      <Route
        path="/planner/templates"
        element={<PlannerTemplateScreen />}
      />
      <Route
        path="/planner/canvas"
        element={<CanvasBoardScreen />}
      />

      {/* FOCUS-001 */}
      <Route path="/focus" element={<FocusSessionScreen />} />

      {/* EVT-001 ~ EVT-004 */}
      <Route path="/events" element={<EventListScreen />} />
      <Route path="/events/new" element={<EventEditScreen />} />
      <Route
        path="/events/:eventId"
        element={<EventDetailScreen />}
      />
      <Route
        path="/events/:eventId/edit"
        element={<EventEditScreen />}
      />
      <Route path="/dday" element={<DdayListScreen />} />

      {/* TASK-001, TASK-002 */}
      <Route path={ROUTES.TASKS} element={<TaskListScreen />} />
      <Route path="/tasks/:taskId" element={<TaskDetailScreen />} />

      {/* ROUT-001 ~ ROUT-003 */}
      <Route path="/routines" element={<RoutineListScreen />} />
      <Route path="/routines/new" element={<RoutineEditScreen />} />
      <Route
        path="/routines/:routineId/edit"
        element={<RoutineEditScreen />}
      />
      <Route
        path="/routines/history"
        element={<RoutineHistoryScreen />}
      />

      {/* DIARY-001, DIARY-002 */}
      <Route path="/diary" element={<DiaryCalendarScreen />} />
      <Route
        path={ROUTES.DIARY_DAILY}
        element={<DailyDiaryScreen />}
      />

      {/* MEMO-001 ~ MEMO-003 */}
      <Route path="/memos" element={<MemoInboxScreen />} />
      <Route path="/memos/new" element={<MemoEditScreen />} />
      <Route path="/memos/:memoId" element={<MemoEditScreen />} />
      <Route path="/memos/to-task" element={<MemoToTaskScreen />} />

      {/* STAT-001~004 */}
      <Route
        path={ROUTES.STAT_DASHBOARD}
        element={<StatDashboardScreen />}
      />
      <Route path="/stat/categories" element={<StatCategoryScreen />} />
      <Route
        path="/stat/plan-actual"
        element={<StatPlanActualScreen />}
      />
      <Route
        path="/stat/focus-report"
        element={<StatFocusReportScreen />}
      />

      {/* SHARE-001~003 */}
      <Route path="/share/friends" element={<FriendListScreen />} />
      <Route
        path="/share/groups"
        element={<CalendarGroupScreen />}
      />
      <Route
        path="/share/visibility"
        element={<ShareVisibilityScreen />}
      />

      {/* SETTINGS-001~006 */}
      <Route
        path={ROUTES.SETTINGS_PROFILE}
        element={<ProfileScreen />}
      />
      <Route
        path="/settings/general"
        element={<GeneralSettingsScreen />}
      />
      <Route
        path="/settings/theme"
        element={<ThemeStickerSettingsScreen />}
      />
      <Route
        path="/settings/notifications"
        element={<NotificationSettingsScreen />}
      />
      <Route
        path="/settings/security"
        element={<SecuritySettingsScreen />}
      />
      <Route
        path="/settings/categories"
        element={<CategoryColorSettingsScreen />}
      />

      {/* ADM-001~004 */}
      <Route path="/admin/users" element={<AdminUserScreen />} />
      <Route path="/admin/logs" element={<AdminLogScreen />} />
      <Route path="/admin/notices" element={<AdminNoticeScreen />} />
      <Route path="/admin/stats" element={<AdminStatsScreen />} />

      {/* 나머지는 기본 진입으로 리다이렉트 */}
      <Route
        path="*"
        element={<Navigate to={ROUTES.PLAN_DAILY} replace />}
      />
    </Routes>
  );
}

export default AppRoutes;
