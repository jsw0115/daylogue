// src/main/frontend/src/screens/settings/GeneralSettingsScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/settings.css";

function GeneralSettingsScreen() {
  const [mode, setMode] = useState("balance");
  const [defaultPage, setDefaultPage] = useState("home");

  return (
    <AppShell title="환경 설정">
      <div className="screen settings-general-screen">
        <header className="screen-header">
          <h2>환경 설정</h2>
        </header>

        <section className="settings-section">
          <h3>시간관리 모드(J/P)</h3>
          <div className="settings-radio-group">
            <label>
              <input type="radio"
                name="mode"
                value="j"
                checked={mode === "j"}
                onChange={(e) => setMode(e.target.value)}
              />
              J형 (계획 중심)
            </label>
            <label>
              <input type="radio"
                name="mode"
                value="balance"
                checked={mode === "balance"}
                onChange={(e) => setMode(e.target.value)}
              />
              밸런스
            </label>
            <label>
              <input type="radio"
                name="mode"
                value="p"
                checked={mode === "p"}
                onChange={(e) => setMode(e.target.value)}
              />
              P형 (유연 중심)
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h3>기본 시작 화면</h3>
          <select value={defaultPage}
            onChange={(e) => setDefaultPage(e.target.value)}
          >
            <option value="home">홈 대시보드</option>
            <option value="daily">일간 플래너</option>
            <option value="weekly">주간 플래너</option>
          </select>
        </section>
      </div>
    </AppShell>
  );
}

export default GeneralSettingsScreen;

