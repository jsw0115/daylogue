// FILE: src/main/frontend/src/layout/AppShell.jsx
import React from "react";
import { NavLink } from "react-router-dom";

import { useResponsiveLayout } from "../shared/hooks/useResponsiveLayout";
import { useAuth } from "../shared/hooks/useAuth";
import { useAppMode, APP_MODES } from "../shared/context/AppModeContext";

function SidebarLink({ to, label }) {
  return (
    <li className="app-shell__sidebar-item">
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? "app-shell__sidebar-link app-shell__sidebar-link--active"
            : "app-shell__sidebar-link"
        }
      >
        <span>{label}</span>
      </NavLink>
    </li>
  );
}

function AppShell({ children }) {
  const { isTablet, isDesktop } = useResponsiveLayout();
  const { user, isAdmin } = useAuth();
  const { mode, setMode } = useAppMode();

  const shellClassNames = [
    "app-shell",
    isTablet && "app-shell--tablet",
    isDesktop && "app-shell--desktop",
  ]
    .filter(Boolean)
    .join(" ");

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
  };

  const modeLabel = (() => {
    switch (mode) {
      case APP_MODES.J:
        return "J 모드 · 계획 먼저 (Plan 중심)";
      case APP_MODES.P:
        return "P 모드 · 흐름 먼저 (Flow 중심)";
      case APP_MODES.B:
      default:
        return "B 모드 · Plan + Actual 밸런스";
    }
  })();

  return (
    <div className={shellClassNames} data-app-mode={mode}>
      {/* 상단 헤더 */}
      <header className="app-shell__header">
        <div className="app-shell__brand">
          <div className="app-shell__brand-logo" />
          <div>
            <div className="app-shell__brand-name">Timebar Diary</div>
            <div className="app-shell__title">{modeLabel}</div>
          </div>
        </div>

        <div className="app-shell__header-right">
          {/* J / P / B 모드 스위치 */}
          <div className="mode-switch">
            <button
              type="button"
              className={
                mode === APP_MODES.J
                  ? "mode-switch__item mode-switch__item--active"
                  : "mode-switch__item"
              }
              onClick={() => handleModeChange(APP_MODES.J)}
            >
              J
            </button>
            <button
              type="button"
              className={
                mode === APP_MODES.P
                  ? "mode-switch__item mode-switch__item--active"
                  : "mode-switch__item"
              }
              onClick={() => handleModeChange(APP_MODES.P)}
            >
              P
            </button>
            <button
              type="button"
              className={
                mode === APP_MODES.B
                  ? "mode-switch__item mode-switch__item--active"
                  : "mode-switch__item"
              }
              onClick={() => handleModeChange(APP_MODES.B)}
            >
              B
            </button>
          </div>

          {/* 우측 유저 정보 */}
          <div className="app-shell__user">
            <div className="app-shell__user-avatar">
              {(user?.name && user.name[0]) || "U"}
            </div>
            <div className="app-shell__user-meta">
              <div className="app-shell__user-name">
                {user?.name || "User"}
              </div>
              <div className="app-shell__user-role">
                {isAdmin ? "관리자" : "사용자"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 본문 영역: 좌측 사이드바 + 우측 컨텐츠 */}
      <div className="app-shell__body">
        {/* 좌측 사이드바 (데스크탑/태블릿에서만 보임 – CSS에서 모바일 숨김 처리) */}
        <aside className="app-shell__sidebar">
          {/* 플래너 섹션 */}
          <section className="app-shell__sidebar-section">
            <div className="app-shell__sidebar-title">플래너</div>
            <ul className="app-shell__sidebar-list">
              <SidebarLink to="/plan/daily" label="일간 플래너" />
              <SidebarLink to="/plan/weekly" label="주간 플래너" />
              <SidebarLink to="/plan/monthly" label="월간 플래너" />
              <SidebarLink to="/plan/yearly" label="연간 캔버스" />
            </ul>
          </section>

          {/* 할 일 / 다이어리 섹션 */}
          <section className="app-shell__sidebar-section">
            <div className="app-shell__sidebar-title">오늘의 일</div>
            <ul className="app-shell__sidebar-list">
              <SidebarLink to="/tasks" label="할 일 리스트" />
              <SidebarLink to="/diary/daily" label="일간 다이어리" />
            </ul>
          </section>

          {/* 통계 / 설정 / 관리자 섹션 */}
          <section className="app-shell__sidebar-section">
            <div className="app-shell__sidebar-title">관리</div>
            <ul className="app-shell__sidebar-list">
              <SidebarLink to="/stat" label="통합 통계" />
              <SidebarLink to="/settings/profile" label="개인 설정" />
              {isAdmin && (
                <SidebarLink to="/admin/users" label="관리자 사용자 관리" />
              )}
            </ul>
          </section>
        </aside>

        {/* 메인 컨텐츠 */}
        <main className="app-shell__content">
          <div className="page-container">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
