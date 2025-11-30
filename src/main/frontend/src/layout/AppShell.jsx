// src/layout/AppShell.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useResponsiveLayout } from "../shared/hooks/useResponsiveLayout";
import { useAuth } from "../shared/hooks/useAuth";
import { ROUTES } from "../shared/constants/routes";
import MobileBottomNav from "./MobileBottomNav";

function AppShell({ children }) {
  const { layout } = useResponsiveLayout();
  const { user, isAdmin } = useAuth();

  // 🔹 사이드바에는 메인 메뉴만
  const mainMenu = [
    { key: "home", label: "홈", to: ROUTES.HOME },
    { key: "daily", label: "일간", to: ROUTES.DAILY },
    { key: "weekly", label: "주간", to: ROUTES.WEEKLY },
    { key: "tasks", label: "할 일", to: ROUTES.TASKS },
    { key: "diary", label: "다이어리", to: ROUTES.DIARY },
  ];

  const renderSidebarSection = (title, items) => {
    if (!items.length) return null;
    return (
      <section className="app-shell__sidebar-section">
        <div className="app-shell__sidebar-title">{title}</div>
        <ul className="app-shell__sidebar-list">
          {items.map((item) => (
            <li key={item.key} className="app-shell__sidebar-item">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  "app-shell__sidebar-link" +
                  (isActive ? " app-shell__sidebar-link--active" : "")
                }
                end
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  return (
    <div className={`app-shell app-shell--${layout}`}>
      {/* 상단 헤더 */}
      <header className="app-shell__header">
        <div className="app-shell__brand">
          <div className="app-shell__brand-logo" />
          <div>
            <div className="app-shell__brand-name">Daylogue</div>
            <div className="app-shell__title">
              하루를 색으로 보는 다이어리 · 시간 관리 스케줄러
            </div>
          </div>
        </div>

        <div className="app-shell__header-right">
          <nav className="app-shell__header-actions">
            {/* 🔹 여기서만 개인 설정 / 관리자 화면 이동 */}
            <NavLink
              to={ROUTES.SETTINGS_PROFILE}
              className={({ isActive }) =>
                "header-link" + (isActive ? " header-link--active" : "")
              }
            >
              개인 설정
            </NavLink>
            {isAdmin && (
              <NavLink
                to={ROUTES.ADMIN_USERS}
                className={({ isActive }) =>
                  "header-link header-link--accent" +
                  (isActive ? " header-link--active" : "")
                }
              >
                관리자 화면
              </NavLink>
            )}
          </nav>

          <div className="app-shell__user">
            <div className="app-shell__user-avatar">
              {user?.name?.[0] || "U"}
            </div>
            <div className="app-shell__user-meta">
              <div className="app-shell__user-name">{user?.name}</div>
              <div className="app-shell__user-role">
                {isAdmin ? "관리자" : "일반 사용자"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 본문 레이아웃 */}
      <div className="app-shell__body">
        {/* 🔹 사이드바: 메인 메뉴만 */}
        <aside className="app-shell__sidebar">
          {renderSidebarSection("메인 메뉴", mainMenu)}
        </aside>

        <main className="app-shell__content">
          <div className="page-container">{children}</div>
        </main>
      </div>

      {layout === "mobile" && <MobileBottomNav />}
    </div>
  );
}

export default AppShell;
