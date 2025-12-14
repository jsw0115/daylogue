// src/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./layout/AppShell";

// screens
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import ResetPasswordScreen from "./screens/auth/ResetPasswordScreen";
import FindIdScreen from "./screens/auth/FindIdScreen";

import HomeDashboardScreen from "./screens/home/HomeDashboardScreen";
import DailyPlannerScreen from "./screens/plan/DailyPlannerScreen";
import WeeklyPlannerScreen from "./screens/plan/WeeklyPlannerScreen";
import MonthlyPlannerScreen from "./screens/plan/MonthlyPlannerScreen";
import YearlyPlannerScreen from "./screens/plan/YearlyPlannerScreen";
import DailyDiaryScreen from "./screens/diary/DailyDiaryScreen";
import RoutineListScreen from "./screens/routine/RoutineListScreen"; // 예시
import DataManagementScreen from "./screens/data/DataManagementScreen";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ Auth: AppShell 없이 단독 */}
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/reset-password" element={<ResetPasswordScreen />} />
      <Route path="/find-id" element={<FindIdScreen />} />

      {/* ✅ AppShell이 필요한 영역만 감싸기 */}
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomeDashboardScreen />} />

        <Route path="/planner/daily" element={<DailyPlannerScreen />} />
        <Route path="/planner/weekly" element={<WeeklyPlannerScreen />} />
        <Route path="/planner/monthly" element={<MonthlyPlannerScreen />} />
        <Route path="/planner/yearly" element={<YearlyPlannerScreen />} />

        <Route path="/diary/daily" element={<DailyDiaryScreen />} />
        <Route path="/routine" element={<RoutineListScreen />} />
        <Route path="/data" element={<DataManagementScreen />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
