import logo from './logo.svg';
import './App.css';

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DailyPlannerScreen from "./screens/plan/DailyPlannerScreen";
import FocusSessionScreen from "./screens/focus/FocusSessionScreen";
import TaskListScreen from "./screens/task/TaskListScreen";
import DailyDiaryScreen from "./screens/diary/DailyDiaryScreen";
import MemoToTaskScreen from "./screens/memo/MemoToTaskScreen";
import StatDashboardScreen from "./screens/stat/StatDashboardScreen";
import CategoryColorSettingsScreen from "./screens/settings/CategoryColorSettingsScreen";

function App() {
  return (
    <Routes>
      {/* 기본 진입: 일간 플래너 */}
      <Route path="/" element={<Navigate to="/plan/daily" replace />} />
      {/* 플래너/타임바 */}
      <Route path="/plan/daily" element={<DailyPlannerScreen />} />
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
      {/* 카테고리 색 / 아이콘 설정 */}
      <Route
        path="/settings/category"
        element={<CategoryColorSettingsScreen />}
      />
    </Routes>
  );
}

export default App;
