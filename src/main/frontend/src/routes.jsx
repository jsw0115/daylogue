import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./layout/AppShell";

// Screens
import HomeDashboardScreen from "./screens/home/HomeDashboardScreen";
import DailyPlannerScreen from "./screens/plan/DailyPlannerScreen";
import WeeklyPlannerScreen from "./screens/plan/WeeklyPlannerScreen";
import MonthlyPlannerScreen from "./screens/plan/MonthlyPlannerScreen";
import YearlyOverviewScreen from "./screens/plan/YearlyOverviewScreen";

import TaskListScreen from "./screens/TaskListScreen";
import RoutineListScreen from "./screens/routine/RoutineListScreen";
import DailyDiaryScreen from "./screens/diary/DailyDiaryScreen";

import FocusModeScreen from "./screens/focus/FocusModeScreen";

import StatDashboardScreen from "./screens/stat/StatDashboardScreen";
import SettingsScreen from "./screens/settings/SettingsScreen";
import AdminSettingsScreen from "./screens/admin/AdminSettingsScreen";

import DataManagementScreen from "./screens/data/DataManagementScreen";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomeDashboardScreen />} />

        {/* PLAN */}
        <Route path="/planner/daily" element={<DailyPlannerScreen />} />
        <Route path="/planner/weekly" element={<WeeklyPlannerScreen />} />
        <Route path="/planner/monthly" element={<MonthlyPlannerScreen />} />
        <Route path="/planner/yearly" element={<YearlyOverviewScreen />} />

        {/* ACTION */}
        <Route path="/action/task" element={<TaskListScreen />} />
        <Route path="/action/routine/list" element={<RoutineListScreen />} />
        <Route path="/action/diary" element={<DailyDiaryScreen />} />

        {/* FOCUS */}
        <Route path="/focus" element={<FocusModeScreen />} />

        {/* INSIGHT */}
        <Route path="/insight/stat" element={<StatDashboardScreen />} />

        {/* DATA */}
        <Route path="/data" element={<DataManagementScreen />} />

        {/* SETTINGS */}
        <Route path="/settings" element={<SettingsScreen />} />

        {/* ADMIN (권한 상관없이 노출/접근) */}
        <Route path="/admin" element={<AdminSettingsScreen />} />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
}
