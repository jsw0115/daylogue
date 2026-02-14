// FILE: src/main/frontend/src/layout/SettingsLayout.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Palette, User, Bell, Shield, ArrowLeft } from "lucide-react";
import "../styles/layout/SettingsLayout.css"; // 아래 CSS 파일 참조

const SETTINGS_MENU = [
  { path: "/settings/theme", label: "테마 / 스타일", icon: Palette },
  { path: "/settings/account", label: "계정 / 프로필", icon: User },
  { path: "/settings/notifications", label: "알림 설정", icon: Bell },
  { path: "/settings/privacy", label: "공개 / 보안", icon: Shield },
];

export default function SettingsLayout() {
  return (
    <div className="tf-page settings-page-wrapper">
      <div className="tf-page__header">
        <div className="tf-title">설정</div>
        <div className="tf-subtitle">앱의 환경을 나에게 맞게 설정합니다.</div>
      </div>

      <div className="settings-container tf-card">
        {/* Left: Settings Sidebar */}
        <aside className="settings-sidebar-col">
          <nav className="settings-nav">
            {SETTINGS_MENU.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({ isActive }) => `settings-nav-item ${isActive ? "active" : ""}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Right: Content Area (여기에 ThemeScreen이 나옵니다) */}
        <main className="settings-content-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}