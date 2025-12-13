import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./MainSidebar";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";

const useResponsiveLayout = () => ({ isMobile: false });

const AppShell = () => {
  const { isMobile } = useResponsiveLayout();

  return (
    <div className="app-shell">
      <Header />
      <div className="app-shell__body">
        {!isMobile && <Sidebar />}
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default AppShell;
