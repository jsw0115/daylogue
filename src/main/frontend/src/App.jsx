// src/main/frontend/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./layout/AppShell";

import HomeDashboardScreen from "./screens/home/HomeDashboardScreen";
import DailyPlannerScreen from "./screens/plan/DailyPlannerScreen";
import WeeklyPlannerScreen from "./screens/plan/WeeklyPlannerScreen";
import LayoutPreviewScreen from "./screens/dev/LayoutPreviewScreen";
import FocusSessionScreen from "./screens/focus/FocusSessionScreen";
import TaskListScreen from "./screens/task/TaskListScreen";
import DailyDiaryScreen from "./screens/diary/DailyDiaryScreen";
import MemoToTaskScreen from "./screens/memo/MemoToTaskScreen";
import StatDashboardScreen from "./screens/stat/StatDashboardScreen";
import CategoryColorSettingsScreen from "./screens/settings/CategoryColorSettingsScreen";
import ProfileScreen from "./screens/settings/ProfileScreen";
import AdminUserScreen from "./screens/admin/AdminUserScreen";
import { ROUTES } from "./shared/constants/routes";
// ... 다른 Screen import

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomeDashboardScreen />} />
        <Route path="/plan/daily" element={<DailyPlannerScreen />} />
        {/* 기본 진입: 일간 플래너 */}
        <Route path="/" element={<Navigate to="/plan/daily" replace />} />
        {/* 플래너/타임바 */}
        <Route path="/plan/weekly" element={<WeeklyPlannerScreen />} />
        {/* 집중 모드 */}
        <Route path="/focus" element={<FocusSessionScreen />} />
        {/* 할 일 */}
        <Route path="/tasks" element={<TaskListScreen />} />
        {/* 일간 다이어리 */}
        <Route path="/diary/daily" element={<DailyDiaryScreen />} />
        {/* 메모 → To-do 변환 */}
        <Route path="/memo/to-task" element={<MemoToTaskScreen />} />
        {/* 통합 통계 */}
        <Route path="/stat" element={<StatDashboardScreen />} />
        <Route path={ROUTES.HOME} element={<HomeDashboardScreen />} />
        <Route path={ROUTES.DAILY} element={<DailyPlannerScreen />} />
        <Route path={ROUTES.WEEKLY} element={<WeeklyPlannerScreen />} />
        <Route path={ROUTES.TASKS} element={<TaskListScreen />} />
        <Route path={ROUTES.DIARY} element={<DailyDiaryScreen />} />
        {/* 카테고리 색 / 아이콘 설정 */}
        <Route
          path="/settings/category"
          element={<CategoryColorSettingsScreen />}
        />
        <Route path="/dev/layout-preview" element={<LayoutPreviewScreen />} />
        {/* 새로 확인할 부분 */}
        <Route
          path={ROUTES.SETTINGS_PROFILE}
          element={<ProfileScreen />}
        />
        <Route path={ROUTES.ADMIN_USERS} element={<AdminUserScreen />} />
      </Routes>
    </AppShell>
  );
}

export default App;
