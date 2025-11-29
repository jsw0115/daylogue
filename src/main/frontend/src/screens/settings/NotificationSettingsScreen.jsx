// src/main/frontend/src/screens/settings/NotificationSettingsScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/settings.css";

function NotificationSettingsScreen() {
  return (
    <AppShell title="알림 설정">
      <div className="screen settings-notification-screen">
        <header className="screen-header">
          <h2>알림 설정</h2>
        </header>

        <section className="settings-section">
          <h3>알림 채널</h3>
          <label className="checkbox">
            <input type="checkbox" defaultChecked />
            <span className="checkbox__box" />
            <span className="checkbox__label">푸시 알림</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" />
            <span className="checkbox__box" />
            <span className="checkbox__label">이메일 알림</span>
          </label>
        </section>

        <section className="settings-section">
          <h3>기본 알림</h3>
          <label className="field">
            <span className="field__label">일정 시작 전</span>
            <select className="field__control">
              <option>10분 전</option>
              <option>30분 전</option>
              <option>1시간 전</option>
            </select>
          </label>
        </section>

        <section className="settings-section">
          <h3>조용한 시간(Do Not Disturb)</h3>
          <div className="settings-row">
            <input type="time" className="field__control" defaultValue="23:00" />
            <span>~</span>
            <input type="time" className="field__control" defaultValue="07:00" />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default NotificationSettingsScreen;

