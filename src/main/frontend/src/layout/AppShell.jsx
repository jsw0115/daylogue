// src/main/frontend/src/layout/AppShell.jsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./MainSidebar";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";

import "../styles/appShell.css"; // ✅ 추가 (경로가 다르면 아래 CSS 파일 위치에 맞게 수정)

function useResponsiveLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia("(max-width: 960px)");
    const onChange = (e) => setIsMobile(!!e.matches);

    setIsMobile(!!mql.matches);

    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, []);

  return { isMobile };
}

export default function AppShell() {
  const { isMobile } = useResponsiveLayout();

  return (
    <div className="app-shell">
      <Header />

      <div className="app-shell__body">
        {!isMobile && <Sidebar />}

        <main className="app-shell__main">
          <Outlet />
        </main>
      </div>

      {isMobile && <MobileBottomNav />}
    </div>
  );
}
