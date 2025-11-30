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
// 필요에 따라 다른 화면도 추가 가능

export function AppRoutes() {
  return (
    <Routes>
      {/* 기본 진입: 일간 플래너 */}
      <Route path="/" element={<Navigate to="/plan/daily" replace />} />

      <Route path="/home" element={<HomeDashboardScreen />} />
      <Route path="/plan/daily" element={<DailyPlannerScreen />} />
      <Route path="/plan/weekly" element={<WeeklyPlannerScreen />} />
      <Route path="/plan/monthly" element={<MonthlyPlannerScreen />} />
      <Route path="/plan/yearly" element={<YearlyOverviewScreen />} />
      <Route path="/tasks" element={<TaskListScreen />} />
      <Route path="/diary/daily" element={<DailyDiaryScreen />} />
      <Route path="/stat" element={<StatDashboardScreen />} />
      <Route path="/settings/profile" element={<ProfileScreen />} />
      <Route path="/admin/users" element={<AdminUserScreen />} />

      {/* 나머지는 임시로 홈으로 */}
      <Route path="*" element={<Navigate to="/plan/daily" replace />} />
    </Routes>
  );
}
