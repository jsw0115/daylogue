// src/main/frontend/src/screens/share/ShareVisibilityScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/share.css";

function ShareVisibilityScreen() {
  return (
    <AppShell title="공유 가시성 설정">
      <div className="screen share-visibility-screen">
        <header className="screen-header">
          <h2>공유 일정 가시성</h2>
        </header>

        <section className="share-visibility-options">
          <h3>기본 공개 범위</h3>
          <div className="settings-radio-group">
            <label>
              <input type="radio" name="defaultVisibility" defaultChecked />
              모두 보기
            </label>
            <label>
              <input type="radio" name="defaultVisibility" />
              참석자만
            </label>
            <label>
              <input type="radio" name="defaultVisibility" />
              바쁨만 표시
            </label>
            <label>
              <input type="radio" name="defaultVisibility" />
              나만 보기
            </label>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default ShareVisibilityScreen;

