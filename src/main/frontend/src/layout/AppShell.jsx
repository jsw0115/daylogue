// src/main/frontend/src/layout/AppShell.jsx
import React from "react";
import { useResponsiveLayout } from "../shared/hooks/useResponsiveLayout";
import MobileBottomNav from "./MobileBottomNav";
import PageContainer from "./PageContainer";
import "../styles/layout.css";

function AppShell({ title, children }) {
  const viewport = useResponsiveLayout();

  return (
    <div className={`app-shell app-shell--${viewport}`}>
      <header className="app-shell__header">
        <div className="app-shell__brand">Daylogue</div>
        <div className="app-shell__title">{title}</div>
        <div className="app-shell__spacer" />
      </header>

      <div className="app-shell__body">
        {viewport !== "mobile" && (
          <nav className="app-shell__sidebar">
            <ul>
              <li>홈</li>
              <li>플래너</li>
              <li>포커스</li>
              <li>할 일</li>
              <li>루틴</li>
              <li>통계</li>
              <li>다이어리</li>
              <li>설정</li>
            </ul>
          </nav>
        )}

        <main className="app-shell__content">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>

      {viewport === "mobile" && <MobileBottomNav />}
    </div>
  );
}

export default AppShell;

