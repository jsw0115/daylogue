// src/screens/auth/AuthLayout.jsx
import React from "react";
import "../../styles/screens/auth.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-screen">
      <div className="auth-bg" />
      <div className="auth-wrap">
        <div className="auth-brand">
          <div className="auth-logo">Timebar Diary</div>
          <div className="auth-desc">
            일/주/월 플래너, 루틴, 포커스, 다이어리를 한 번에 관리하세요.
          </div>
        </div>

        <div className="auth-card">{children}</div>
      </div>
    </div>
  );
}
