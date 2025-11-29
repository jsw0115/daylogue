// src/main/frontend/src/screens/settings/SecuritySettingsScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/settings.css";

function SecuritySettingsScreen() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");

  return (
    <AppShell title="보안 / 로그인">
      <div className="screen settings-security-screen">
        <header className="screen-header">
          <h2>보안 설정</h2>
        </header>

        <section className="settings-section">
          <h3>비밀번호 변경</h3>
          <div className="field">
            <label className="field__label">현재 비밀번호</label>
            <input type="password"
              className="field__control"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field__label">새 비밀번호</label>
            <input type="password"
              className="field__control"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
          </div>
          <button className="primary-button">비밀번호 변경</button>
        </section>

        <section className="settings-section">
          <h3>로그인 기기 관리</h3>
          <ul className="device-list">
            <li>Chrome · Windows · 마지막 접속: 2025-03-16</li>
            <li>iOS 앱 · iPhone · 마지막 접속: 2025-03-15</li>
          </ul>
          <button className="ghost-button">다른 기기 로그아웃</button>
        </section>
      </div>
    </AppShell>
  );
}

export default SecuritySettingsScreen;

