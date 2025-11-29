// src/main/frontend/src/screens/auth/AuthSocialLinkScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import Button from "../../components/common/Button";
import "../../styles/screens/auth.css";

function AuthSocialLinkScreen() {
  return (
    <AppShell title="소셜 계정 연동">
      <div className="screen auth-screen auth-screen--social">
        <header className="auth-header">
          <h2>소셜 계정 연동</h2>
          <p>다음 계정들을 Daylogue 계정과 연결할 수 있습니다.</p>
        </header>

        <section className="auth-social-link-list">
          <div className="social-link-item">
            <div className="social-link-item__info">
              <strong>Google</strong>
              <span>연동되지 않음</span>
            </div>
            <Button variant="secondary">연동하기</Button>
          </div>
          <div className="social-link-item">
            <div className="social-link-item__info">
              <strong>Kakao</strong>
              <span>연동됨 · user@kakao.com</span>
            </div>
            <Button variant="ghost">연동 해제</Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default AuthSocialLinkScreen;

