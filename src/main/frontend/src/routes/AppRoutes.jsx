// FILE: src/routes/AppRoutes.jsx
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AppShell from "../layout/AppShell";

import { ROUTES } from "../shared/constants/routes";

import HomeDashboardScreen from "../screens/home/HomeDashboardScreen";
import DailyPlannerScreen from "../screens/plan/DailyPlannerScreen";
import WeeklyPlannerScreen from "../screens/plan/WeeklyPlannerScreen";
import MonthlyPlannerScreen from "../screens/plan/MonthlyPlannerScreen";
import YearlyPlannerScreen from "../screens/plan/YearlyPlannerScreen";
import DailyDiaryScreen from "../screens/diary/DailyDiaryScreen";
import DataManagementScreen from "../screens/data/DataManagementScreen";
import RoutineListScreen from "../screens/routine/RoutineListScreen";

import AuthStartScreen  from "../screens/auth/AuthStartScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
import FindIdScreen from "../screens/auth/FindIdScreen";
// Auth / Onboarding
import AuthLoginScreen from "../screens/auth/AuthLoginScreen";
import AuthRegisterScreen from "../screens/auth/AuthRegisterScreen";
import AuthPasswordResetScreen from "../screens/auth/AuthPasswordResetScreen";
import AuthSocialLinkScreen from "../screens/auth/AuthSocialLinkScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen";

import AuthFindIdResultScreen from "../screens/auth/AuthFindIdResultScreen";
import AuthFindIdScreen from "../screens/auth/AuthFindIdScreen";
import AuthOAuthCallbackScreen from "../screens/auth/AuthOAuthCallbackScreen";
import AuthPasswordResetInvalidTokenScreen from "../screens/auth/AuthPasswordResetInvalidTokenScreen";
import AuthPasswordResetRequestSentScreen from "../screens/auth/AuthPasswordResetRequestSentScreen";
import AuthPasswordResetTokenScreen from "../screens/auth/AuthPasswordResetTokenScreen";
import AuthSessionExpiredScreen from "../screens/auth/AuthSessionExpiredScreen";

// Home
import NotificationInboxScreen from "../screens/home/NotificationInboxScreen";

// Planner
// import WeeklyPlannerScreen from "../screens/plan/WeeklyPlannerScreen";
// import MonthlyPlannerScreen from "../screens/plan/MonthlyPlannerScreen";
import YearlyOverviewScreen from "../screens/plan/YearlyOverviewScreen";
import PlannerTemplateScreen from "../screens/plan/PlannerTemplateScreen";
import CanvasBoardScreen from "../screens/plan/CanvasBoardScreen";

// Focus
import FocusSessionScreen from "../screens/focus/FocusSessionScreen";

// Event
import EventListScreen from "../screens/event/EventListScreen";
import EventDetailScreen from "../screens/event/EventDetailScreen";
import EventEditScreen from "../screens/event/EventEditScreen";
import DdayListScreen from "../screens/event/DdayListScreen";

// Task
import TaskListScreen from "../screens/task/TaskListScreen";
import TaskDetailScreen from "../screens/task/TaskDetailScreen";

// Routine
// import RoutineListScreen from "../screens/routine/RoutineListScreen";
import RoutineEditScreen from "../screens/routine/RoutineEditScreen";
import RoutineHistoryScreen from "../screens/routine/RoutineHistoryScreen";

// Diary
import DiaryCalendarScreen from "../screens/diary/DiaryCalendarScreen";
// import DailyDiaryScreen from "../screens/diary/DailyDiaryScreen";

// Memo
import MemoInboxScreen from "../screens/memo/MemoInboxScreen";
import MemoEditScreen from "../screens/memo/MemoEditScreen";
import MemoToTaskScreen from "../screens/memo/MemoToTaskScreen";

// Stat
import StatDashboardScreen from "../screens/stat/StatDashboardScreen";
import StatCategoryScreen from "../screens/stat/StatCategoryScreen";
import StatPlanActualScreen from "../screens/stat/StatPlanActualScreen";
import StatFocusReportScreen from "../screens/stat/StatFocusReportScreen";

// Share
import FriendListScreen from "../screens/share/FriendListScreen";
import CalendarGroupScreen from "../screens/share/CalendarGroupScreen";
import ShareVisibilityScreen from "../screens/share/ShareVisibilityScreen";

// Settings (드롭다운에서 진입할 “통합 설정”)
import SettingsScreen from "../screens/settings/SettingsScreen";
import ProfileScreen from "../screens/settings/ProfileScreen";
import GeneralSettingsScreen from "../screens/settings/GeneralSettingsScreen";
import ThemeStickerSettingsScreen from "../screens/settings/ThemeStickerSettingsScreen";
import NotificationSettingsScreen from "../screens/settings/NotificationSettingsScreen";
import SecuritySettingsScreen from "../screens/settings/SecuritySettingsScreen";
import CategoryColorSettingsScreen from "../screens/settings/CategoryColorSettingsScreen";
import WorkReportMasterSettingsScreen from "../screens/settings/WorkReportMasterSettingsScreen";
import ShareUsersSettingsScreen from "../screens/settings/ShareUsersSettingsScreen";

// Admin
import AdminSettingsScreen from "../screens/admin/AdminSettingsScreen";
import AdminUserScreen from "../screens/admin/AdminUserScreen";
import AdminLogScreen from "../screens/admin/AdminLogScreen";
import AdminNoticeScreen from "../screens/admin/AdminNoticeScreen";
import AdminStatsScreen from "../screens/admin/AdminStatsScreen";

// Screens
// import HomeDashboardScreen from "./screens/home/HomeDashboardS creen";
// import DailyPlannerScreen from "./screens/plan/DailyPlannerScreen";
// import WeeklyPlannerScreen from "./screens/plan/WeeklyPlannerScreen";
// import MonthlyPlannerScreen from "./screens/plan/MonthlyPlannerScreen";
// import YearlyOverviewScreen from "./screens/plan/YearlyOverviewScreen";

// import TaskListScreen from "../screens/TaskListScreen";
// import RoutineListScreen from "../screens/routine/RoutineListScreen";
// import DailyDiaryScreen from "./screens/diary/DailyDiaryScreen";

import FocusModeScreen from "../screens/focus/FocusModeScreen";

// import StatDashboardScreen from "./screens/stat/StatDashboardScreen";
// import SettingsScreen from "./screens/settings/SettingsScreen";
// import AdminSettingsScreen from "./screens/admin/AdminSettingsScreen";

// import DataManagementScreen from "./screens/data/DataManagementScreen";


import CommunityFeedScreen from "../screens/community/CommunityFeedScreen";
import CommunityDetailScreen from "../screens/community/CommunityDetailScreen";
import CommunityEditorScreen from "../screens/community/CommunityEditorScreen";
import CommunityJoinRequestScreen from "../screens/community/CommunityJoinRequestScreen";
import CommunityOwnerRequestsScreen from "../screens/community/CommunityOwnerRequestsScreen";
import CommunityMembersScreen from "../screens/community/CommunityMembersScreen";
import CommunityBoardScreen from "../screens/community/CommunityBoardScreen";
import CommunityChatScreen from "../screens/community/CommunityChatScreen";

import CategorySettingsScreen from "../screens/settings/CategorySettingsScreen";
import WorkReportScreen from "../screens/work/WorkReportScreen";
import YearGoalsReviewScreen from "../screens/goals/YearGoalsReviewScreen";
import AiReportScreen from "../screens/insight/AiReportScreen";
import CompareStatsScreen from "../screens/stat/CompareStatsScreen";

import ChatListScreen from "../screens/chat/ChatListScreen";
import ChatRoomScreen from "../screens/chat/ChatRoomScreen";

function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontWeight: 800, fontSize: 16 }}>404</div>
      <div style={{ marginTop: 8, color: "#6b7280" }}>페이지를 찾을 수 없습니다.</div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth: AppShell 없이 단독 */}
      <Route path="/" element={<AuthStartScreen  />} />
      <Route path="/start" element={<AuthStartScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/reset-password" element={<ResetPasswordScreen />} />
      <Route path="/find-id" element={<FindIdScreen />} />
      <Route path="/social-link" element={<AuthSocialLinkScreen />} />
      <Route path="/onboarding" element={<OnboardingScreen />} />

      {/* (옵션) 예전 /auth/* 호환 */}
      <Route path="/auth/login" element={<Navigate to="/login" replace />} />
      <Route path="/auth/register" element={<Navigate to="/register" replace />} />
      <Route path="/auth/reset-password" element={<Navigate to="/reset-password" replace />} />
      <Route path="/auth/find-id" element={<Navigate to="/find-id" replace />} />
      <Route path="/auth/find-id" element={<AuthFindIdScreen />} />
      <Route path="/auth/find-id/result" element={<AuthFindIdResultScreen />} />

      <Route path="/auth/password-reset/sent" element={<AuthPasswordResetRequestSentScreen />} />
      <Route path="/auth/password-reset/invalid" element={<AuthPasswordResetInvalidTokenScreen />} />
      <Route path="/auth/password-reset/:token" element={<AuthPasswordResetTokenScreen />} />

      <Route path="/auth/oauth/callback/:provider" element={<AuthOAuthCallbackScreen />} />
      <Route path="/auth/session-expired" element={<AuthSessionExpiredScreen />} />

      {/* App 영역 */}
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomeDashboardScreen />} />
        <Route path="/inbox" element={<NotificationInboxScreen />} />

        <Route path="/planner/daily" element={<DailyPlannerScreen />} />
        <Route path="/planner/weekly" element={<WeeklyPlannerScreen />} />
        <Route path="/planner/monthly" element={<MonthlyPlannerScreen />} />
        <Route path="/planner/yearly" element={<YearlyPlannerScreen />} />

        <Route path="/diary/daily" element={<DailyDiaryScreen />} />
        <Route path="/data" element={<DataManagementScreen />} />

        {/* ACTION > 루틴 */}
        <Route path="/routine" element={<RoutineListScreen />} />
        <Route path="/action/routine" element={<Navigate to="/routine" replace />} />
        <Route path="/action/routine/list" element={<Navigate to="/routine" replace />} />
        <Route path="/routines" element={<RoutineListScreen />} />
        <Route path="/routines/new" element={<RoutineEditScreen />} />
        <Route path="/routines/:routineId/edit" element={<RoutineEditScreen />} />
        <Route path="/routines/history" element={<RoutineHistoryScreen />} />
        
        {/* Task */}
        <Route path={ROUTES.TASKS} element={<TaskListScreen />} />
        <Route path="/tasks/:taskId" element={<TaskDetailScreen />} />
        <Route path="/action/task" element={<TaskListScreen />} />
        

        {/* Memo */}
        <Route path="/memos" element={<MemoInboxScreen />} />
        <Route path="/memos/new" element={<MemoEditScreen />} />
        <Route path="/memos/:memoId" element={<MemoEditScreen />} />
        <Route path="/memos/to-task" element={<MemoToTaskScreen />} />

        {/* Stat */}
        <Route path={ROUTES.STAT_DASHBOARD} element={<StatDashboardScreen />} />
        <Route path="/stat/categories" element={<StatCategoryScreen />} />
        <Route path="/stat/plan-actual" element={<StatPlanActualScreen />} />
        <Route path="/stat/focus-report" element={<StatFocusReportScreen />} />
        <Route path="/insight/stat" element={<StatDashboardScreen />} />

        {/* Share */}
        <Route path="/share/friends" element={<FriendListScreen />} />
        <Route path="/share/groups" element={<CalendarGroupScreen />} />
        <Route path="/share/visibility" element={<ShareVisibilityScreen />} />

        {/* Settings: 드롭다운에서 /settings 로 진입 */}
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path={ROUTES.SETTINGS_PROFILE} element={<ProfileScreen />} />
        <Route path="/settings/general" element={<GeneralSettingsScreen />} />
        <Route path="/settings/theme" element={<ThemeStickerSettingsScreen />} />
        <Route path="/settings/notifications" element={<NotificationSettingsScreen />} />
        <Route path="/settings/security" element={<SecuritySettingsScreen />} />
        <Route path="/settings/categories" element={<CategoryColorSettingsScreen />} />
        <Route path="/settings/work-master" element={<WorkReportMasterSettingsScreen />} />
        <Route path="/settings/share-users" element={<ShareUsersSettingsScreen />} />

        <Route path="/focus" element={<FocusModeScreen />} />

        {/* Admin: /admin 허브 */}
        <Route path="/admin" element={<AdminSettingsScreen />} />
        <Route path="/admin/users" element={<AdminUserScreen />} />
        <Route path="/admin/logs" element={<AdminLogScreen />} />
        <Route path="/admin/notices" element={<AdminNoticeScreen />} />
        <Route path="/admin/stats" element={<AdminStatsScreen />} />
        
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
        {/* <Route path="/chat" element={<ChatListScreen  />} /> */}
        {/* <Route path="/chat/:roomId" element={<ChatRoomScreen />} /> */}

        {/* FOCUS */}
        <Route path="/focus" element={<FocusModeScreen />} />

        {/* INSIGHT */}
        <Route path="/insight/stat" element={<StatDashboardScreen />} />
        <Route path="/stat/compare" element={<CompareStatsScreen />} />
        
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
