// src/main/frontend/src/screens/settings/ProfileScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/settings.css";

function ProfileScreen() {
  const [nickname, setNickname] = useState("푸딩곰");
  const [email] = useState("user@example.com");

  return (
    <AppShell title="프로필">
      <div className="screen settings-profile-screen">
        <header className="screen-header">
          <h2>내 프로필</h2>
        </header>

        <section className="settings-section">
          <div className="profile-avatar">
            <div className="profile-avatar__circle">🙂</div>
            <button className="ghost-button">이미지 변경</button>
          </div>

          <div className="field">
            <label className="field__label">이메일</label>
            <input className="field__control" value={email} disabled />
          </div>

          <div className="field">
            <label className="field__label">닉네임</label>
            <input className="field__control"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default ProfileScreen;

