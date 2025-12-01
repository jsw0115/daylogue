// FILE: src/main/frontend/src/routes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomeDashboardScreen from "./screens/home/HomeDashboardScreen";
import DailyPlannerScreen from "./screens/plan/DailyPlannerScreen";
import WeeklyPlannerScreen from "./screens/plan/WeeklyPlannerScreen";
import MonthlyPlannerScreen from "./screens/plan/MonthlyPlannerScreen";
import YearlyOverviewScreen from "./screens/plan/YearlyOverviewScreen";
import TaskListScreen from "./screens/task/TaskListScreen";
import DailyDiaryScreen from "./screens/diary/DailyDiaryScreen";
import StatDashboardScreen from "./screens/stat/StatDashboardScreen";
import ProfileScreen from "./screens/settings/ProfileScreen";
import AdminUserScreen from "./screens/admin/AdminUserScreen";

import { ROUTES } from "./shared/constants/routes";

export function AppRoutes() {
  return (
    <Routes>
      {/* 기본 진입: PLAN-001 일간 플래너 */}
      <Route
        path="/"
        element={<Navigate to={ROUTES.PLAN_DAILY} replace />}
      />

      <Route path={ROUTES.HOME} element={<HomeDashboardScreen />} />
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

      <Route path={ROUTES.TASKS} element={<TaskListScreen />} />
      <Route
        path={ROUTES.DIARY_DAILY}
        element={<DailyDiaryScreen />}
      />
      <Route
        path={ROUTES.STAT_DASHBOARD}
        element={<StatDashboardScreen />}
      />
      <Route
        path={ROUTES.SETTINGS_PROFILE}
        element={<ProfileScreen />}
      />

      {/* ADM-*** : 관리자 화면 */}
      <Route path="/admin/users" element={<AdminUserScreen />} />

      {/* 나머지는 기본 진입으로 리다이렉트 */}
      <Route
        path="*"
        element={<Navigate to={ROUTES.PLAN_DAILY} replace />}
      />
    </Routes>
  );
}

export default AppRoutes;
