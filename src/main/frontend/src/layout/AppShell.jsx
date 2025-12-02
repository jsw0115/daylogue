import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useResponsiveLayout } from "../shared/hooks/useResponsiveLayout";
import { useAuth } from "../shared/hooks/useAuth";
import { useAppMode, APP_MODES } from "../shared/context/AppModeContext";

function AppShell({ children }) {
  const { isMobile } = useResponsiveLayout();
  const { user } = useAuth();
  const { mode, setMode } = useAppMode();
  const location = useLocation();
  const navigate = useNavigate();

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
  };

  return (
    <div className="app-shell">
      {/* 상단 헤더 */}
      <header className="app-shell__header">
        <div className="app-shell__brand" onClick={() => navigate("/plan/daily")}>
          <div className="app-shell__brand-logo" />
          <div>
            <div className="app-shell__brand-name">Timebar Diary</div>
            <div className="app-shell__title">B 모드 · Plan + Actual 밸런스</div>
          </div>
        </div>

        <div className="app-shell__header-right">
          {/* 모드 스위치 J / P / B */}
          <div className="mode-switch">
            <button
              type="button"
              className={
                "mode-switch__item" +
                (mode === APP_MODES.J ? " mode-switch__item--active" : "")
              }
              onClick={() => handleModeChange(APP_MODES.J)}
            >
              J
            </button>
            <button
              type="button"
              className={
                "mode-switch__item" +
                (mode === APP_MODES.P ? " mode-switch__item--active" : "")
              }
              onClick={() => handleModeChange(APP_MODES.P)}
            >
              P
            </button>
            <button
              type="button"
              className={
                "mode-switch__item" +
                (mode === APP_MODES.B ? " mode-switch__item--active" : "")
              }
              onClick={() => handleModeChange(APP_MODES.B)}
            >
              B
            </button>
          </div>

          {/* 헤더 링크들 (통합 통계 / 할 일 리스트 등 필요 시 추가) */}
          <div className="app-shell__header-actions">
            <NavLink
              to="/stat"
              className={({ isActive }) =>
                "header-link" +
                (isActive ? " header-link--active header-link--accent" : "")
              }
            >
              통합 통계
            </NavLink>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                "header-link" + (isActive ? " header-link--active" : "")
              }
            >
              할 일 리스트
            </NavLink>
          </div>

          {/* 사용자 정보 */}
          <div className="app-shell__user">
            <div className="app-shell__user-avatar">
              {user?.name?.[0] ?? "D"}
            </div>
            <div className="app-shell__user-meta">
              <div className="app-shell__user-name">{user?.name ?? "DATA"}</div>
              <div className="app-shell__user-role">관리자</div>
            </div>
          </div>
        </div>
      </header>

      {/* 좌측 사이드바 + 메인 컨텐츠 */}
      <div className="app-shell__body">
        <aside className="app-shell__sidebar">
          <div className="app-shell__sidebar-section">
            <div className="app-shell__sidebar-title">플래너</div>
            <ul className="app-shell__sidebar-list">
              <li>
                <NavLink
                  to="/plan/daily"
                  className={({ isActive }) =>
                    "app-shell__sidebar-link" +
                    (isActive ? " app-shell__sidebar-link--active" : "")
                  }
                >
                  일간 플래너
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/plan/weekly"
                  className={({ isActive }) =>
                    "app-shell__sidebar-link" +
                    (isActive ? " app-shell__sidebar-link--active" : "")
                  }
                >
                  주간 플래너
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/plan/monthly"
                  className={({ isActive }) =>
                    "app-shell__sidebar-link" +
                    (isActive ? " app-shell__sidebar-link--active" : "")
                  }
                >
                  월간 플래너
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/plan/yearly"
                  className={({ isActive }) =>
                    "app-shell__sidebar-link" +
                    (isActive ? " app-shell__sidebar-link--active" : "")
                  }
                >
                  연간 캔버스
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="app-shell__sidebar-section">
            <div className="app-shell__sidebar-title">오늘의 일</div>
            <ul className="app-shell__sidebar-list">
              <li>
                <NavLink
                  to="/tasks"
                  className={({ isActive }) =>
                    "app-shell__sidebar-link" +
                    (isActive ? " app-shell__sidebar-link--active" : "")
                  }
                >
                  할 일 리스트
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/diary/daily"
                  className={({ isActive }) =>
                    "app-shell__sidebar-link" +
                    (isActive ? " app-shell__sidebar-link--active" : "")
                  }
                >
                  일간 다이어리
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="app-shell__sidebar-section">
            <div className="app-shell__sidebar-title">관리</div>
            <ul className="app-shell__sidebar-list">
              <li>
                <NavLink
                  to="/stat"
                  className={({ isActive }) =>
                    "app-shell__sidebar-link" +
                    (isActive ? " app-shell__sidebar-link--active" : "")
                  }
                >
                  통합 통계
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/settings/profile"
                  className={({ isActive }) =>
                    "app-shell__sidebar-link" +
                    (isActive ? " app-shell__sidebar-link--active" : "")
                  }
                >
                  개인 설정
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    "app-shell__sidebar-link" +
                    (isActive ? " app-shell__sidebar-link--active" : "")
                  }
                >
                  관리자 사용자 관리
                </NavLink>
              </li>
            </ul>
          </div>
        </aside>

        <main className="app-shell__content">
          <div className="page-container">{children}</div>
        </main>
      </div>

      {/* ✅ 모바일에서만 하단 네비게이션 노출 */}
      {isMobile && <MobileBottomNav currentPath={location.pathname} />}
    </div>
  );
}

function MobileBottomNav({ currentPath }) {
  const items = [
    { key: "plan", label: "플래너", to: "/plan/daily" },
    { key: "tasks", label: "할 일", to: "/tasks" },
    { key: "diary", label: "다이어리", to: "/diary/daily" },
    { key: "stat", label: "통계", to: "/stat" },
    { key: "settings", label: "설정", to: "/settings/profile" },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {items.map((item) => {
        const isActive =
          currentPath === item.to || currentPath.startsWith(item.to + "/");
        return (
          <NavLink
            key={item.key}
            to={item.to}
            className={
              "mobile-bottom-nav__item" +
              (isActive ? " mobile-bottom-nav__item--active" : "")
            }
          >
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default AppShell;
