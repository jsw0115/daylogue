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

import CommunityFeedScreen from "./screens/community/CommunityFeedScreen";
import CommunityDetailScreen from "./screens/community/CommunityDetailScreen";
import CommunityEditorScreen from "./screens/community/CommunityEditorScreen";
import CommunityJoinRequestScreen from "./screens/community/CommunityJoinRequestScreen";
import CommunityOwnerRequestsScreen from "./screens/community/CommunityOwnerRequestsScreen";
import CommunityMembersScreen from "./screens/community/CommunityMembersScreen";
import CommunityBoardScreen from "./screens/community/CommunityBoardScreen";
import CommunityChatScreen from "./screens/community/CommunityChatScreen";

import CategorySettingsScreen from "./screens/settings/CategorySettingsScreen";
import WorkReportScreen from "./screens/work/WorkReportScreen";
import YearGoalsReviewScreen from "./screens/goals/YearGoalsReviewScreen";
import AiReportScreen from "./screens/insight/AiReportScreen";
import CompareStatsScreen from "./screens/stat/CompareStatsScreen";

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

        {/* COMMUNITY */}
        <Route path="/community" element={<CommunityFeedScreen />} />
        <Route path="/community/new" element={<CommunityEditorScreen mode="create" />} />
        <Route path="/community/:groupId" element={<CommunityDetailScreen />} />
        <Route path="/community/:groupId/edit" element={<CommunityEditorScreen mode="edit"/>} />
        <Route path="/community/:groupId/join" element={<CommunityJoinRequestScreen />} />
        <Route path="/community/:groupId/owner/requests" element={<CommunityOwnerRequestsScreen />} />
        <Route path="/community/:groupId/members" element={<CommunityMembersScreen />} />
        <Route path="/community/:groupId/board" element={<CommunityBoardScreen />} />
        <Route path="/community/:groupId/chat" element={<CommunityChatScreen />} />

        {/* WORK */}
        <Route path="/work/report" element={<WorkReportScreen />} />
        <Route path="/goals/year" element={<YearGoalsReviewScreen />} />
        <Route path="/insight/ai-report" element={<AiReportScreen />} />

        {/* CHAT */}
        <Route path="/chat" element={<ChatListScreen  />} />
        <Route path="/chat/:roomId" element={<ChatRoomScreen />} />

        {/* FOCUS */}
        <Route path="/focus" element={<FocusModeScreen />} />

        {/* INSIGHT */}
        <Route path="/insight/stat" element={<StatDashboardScreen />} />
        <Route path="/stat/compare" element={<CompareStatsScreen />} />

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
