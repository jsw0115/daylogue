import React from "react";
import { NavLink } from "react-router-dom";
import { useResponsiveLayout } from "../shared/hooks/useResponsiveLayout";
import MobileBottomNav from "./MobileBottomNav";
import PageContainer from "./PageContainer";

const MAIN_MENU = [
  { path: "/home", label: "홈" },
  { path: "/plan/daily", label: "일간" },
  { path: "/plan/weekly", label: "주간" },
  { path: "/plan/monthly", label: "월간" },
  { path: "/plan/yearly", label: "연간" },
  { path: "/tasks", label: "할 일" },
  { path: "/diary/daily", label: "다이어리" },
];

function AppShell({ children }) {
  const { isMobile, isTablet, isDesktop } = useResponsiveLayout();

  const shellClassName = [
    "app-shell",
    isMobile ? "app-shell--mobile" : "",
    isTablet ? "app-shell--tablet" : "",
    isDesktop ? "app-shell--desktop" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={shellClassName}>
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
          {/* J / P / Balance 모드 토글 (임시 로컬 상태) */}
          <div className="app-shell__header-actions">
            <button className="header-link header-link--accent">J 모드</button>
            <button className="header-link">P 모드</button>
            <button className="header-link">Balance</button>
          </div>

          {/* 오른쪽 사용자 미니 카드 */}
          <div className="app-shell__user">
            <div className="app-shell__user-avatar">D</div>
            <div className="app-shell__user-meta">
              <div className="app-shell__user-name">DATA</div>
              <div className="app-shell__user-role">관리자</div>
            </div>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <div className="app-shell__body">
        {/* 좌측 사이드바 */}
        {!isMobile && (
          <aside className="app-shell__sidebar">
            <div className="app-shell__sidebar-section">
              <div className="app-shell__sidebar-title">메인 메뉴</div>
              <ul className="app-shell__sidebar-list">
                {MAIN_MENU.map((item) => (
                  <li key={item.path} className="app-shell__sidebar-item">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        "app-shell__sidebar-link" +
                        (isActive ? " app-shell__sidebar-link--active" : "")
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="app-shell__sidebar-section">
              <div className="app-shell__sidebar-title">설정</div>
              <ul className="app-shell__sidebar-list">
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
                    관리자 화면
                  </NavLink>
                </li>
              </ul>
            </div>
          </aside>
        )}

        {/* 메인 컨텐츠 */}
        <main className="app-shell__content">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>

      {/* 모바일 하단 네비 */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
}

export default AppShell;
