// src/main/frontend/src/layout/AppShell.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";

// 1. 레이아웃 및 공통 컴포넌트
import Sidebar from "./MainSidebar";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";

// 2. 화면 컴포넌트들
import HomeDashboardScreen from "./../screens/home/HomeDashboardScreen";

// PLAN 영역
import DailyPlannerScreen from "./../screens/plan/DailyPlannerScreen";
import WeeklyPlannerScreen from "./../screens/plan/WeeklyPlannerScreen";
import MonthlyPlannerScreen from "./../screens/plan/MonthlyPlannerScreen";
import YearlyOverviewScreen from "./../screens/plan/YearlyOverviewScreen";

// ACTION 영역
import TaskListScreen from "./../screens/task/TaskListScreen";
import RoutineListScreen from "./../screens/routine/RoutineListScreen";
import DailyDiaryScreen from "./../screens/diary/DailyDiaryScreen";
import FocusModeScreen from "./../screens/focus/FocusModeScreen";

// INSIGHT/SETTING 영역
import StatDashboardScreen from "./../screens/stat/StatDashboardScreen";
import SettingsScreen from "./../screens/settings/SettingsScreen";
import PlaceholderScreen from "./../screens/PlaceholderScreen";

// 일정(Event) 영역
import EventCreateScreen from "./../screens/event/EventCreateScreen";
import EventGroupSettingsScreen from "./../screens/event/EventGroupSettingsScreen";


// 3. 반응형 레이아웃 훅 (임시)
const useResponsiveLayout = () => ({ isMobile: false });

const AppShell = () => {
  const { isMobile } = useResponsiveLayout();

  return (
    <div className="app-shell">
      <Header />
      {!isMobile && <Sidebar />}

      <div className="app-shell__content">
        <Routes>
          {/* HOME 영역 */}
          <Route path="/" element={<HomeDashboardScreen />} />
          <Route path="/home" element={<HomeDashboardScreen />} />
          <Route
            path="/inbox"
            element={<PlaceholderScreen title="알림/인박스 화면 (HOME-002)" />}
          />

          {/* PLAN 영역 */}
          <Route path="/planner/daily" element={<DailyPlannerScreen />} />
          <Route path="/planner/weekly" element={<WeeklyPlannerScreen />} />
          <Route path="/planner/monthly" element={<MonthlyPlannerScreen />} />
          <Route path="/planner/yearly" element={<YearlyOverviewScreen />} />
          <Route
            path="/planner/templates"
            element={<PlaceholderScreen title="플래너 템플릿 관리 (PLAN-005)" />}
          />
          <Route
            path="/planner/canvas"
            element={
              <PlaceholderScreen title="연간/프로젝트 캔버스 보드 (PLAN-006)" />
            }
          />

            {/* EVENT (일정) 영역 */}
            <Route
            path="/event/list"
            element={<PlaceholderScreen title="일정 리스트/검색 (EVT-001)" />}
            />
            <Route
            path="/event/dday"
            element={<PlaceholderScreen title="D-Day 전용 목록 (EVT-004)" />}
            />
            <Route path="/event/create" element={<EventCreateScreen />} />
            <Route
            path="/event/group-settings"
            element={<EventGroupSettingsScreen />}
            />


          {/* FOCUS 영역 */}
          <Route path="/focus-mode" element={<FocusModeScreen />} />

          {/* ACTION 영역 */}
          <Route path="/action/task" element={<TaskListScreen />} />
          <Route path="/action/routine/list" element={<RoutineListScreen />} />
          <Route path="/action/diary" element={<DailyDiaryScreen />} />

          {/* EVENT 영역 */}
          <Route
            path="/event/list"
            element={<PlaceholderScreen title="일정 리스트/검색 (EVT-001)" />}
          />
          <Route
            path="/event/dday"
            element={<PlaceholderScreen title="D-Day 전용 목록 (EVT-004)" />}
          />

          {/* DIARY/MEMO 영역 */}
          <Route
            path="/diary/calendar"
            element={
              <PlaceholderScreen title="다이어리 캘린더/목록 (DIARY-001)" />
            }
          />
          <Route
            path="/memo/inbox"
            element={<PlaceholderScreen title="메모 인박스 (MEMO-001)" />}
          />

          {/* INSIGHT/SETTING 영역 */}
          <Route path="/insight/stat" element={<StatDashboardScreen />} />
          <Route
            path="/insight/category"
            element={<PlaceholderScreen title="카테고리별 통계 (STAT-002)" />}
          />
          <Route
            path="/insight/plan-vs-actual"
            element={<PlaceholderScreen title="Plan vs Actual 비교 (STAT-003)" />}
          />

          {/* SETTING 영역 */}
          <Route path="/settings" element={<SettingsScreen />} />
          <Route
            path="/settings/profile"
            element={<PlaceholderScreen title="프로필/계정 정보 (SET-001)" />}
          />
          <Route
            path="/settings/theme"
            element={<PlaceholderScreen title="테마/색상/스티커 설정 (SET-003)" />}
          />
          <Route
            path="/settings/alarm"
            element={<PlaceholderScreen title="알림 설정 (SET-004)" />}
          />
          <Route
            path="/settings/security"
            element={<PlaceholderScreen title="보안/로그인 설정 (SET-005)" />}
          />
          <Route
            path="/settings/category"
            element={<PlaceholderScreen title="카테고리 색/아이콘 설정 (SET-006)" />}
          />

          {/* 기타 */}
          <Route path="/data" element={<PlaceholderScreen title="데이터 관리" />} />

          {/* fallback */}
          <Route path="*" element={<HomeDashboardScreen />} />
        </Routes>
      </div>

      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default AppShell;
