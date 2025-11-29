// src/main/frontend/src/screens/auth/AuthLoginScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import TextInput from "../../components/common/TextInput";
import Button from "../../components/common/Button";
import "../../styles/screens/auth.css";

function AuthLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: authApi.login(email, password)
    console.log("login", { email, password });
  };

  return (
    <AppShell title="로그인">
      <div className="screen auth-screen auth-screen--login">
        <header className="auth-header">
          <h2>Daylogue에 로그인</h2>
          <p>이메일과 비밀번호를 입력해주세요.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <TextInput label="이메일"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
          />
          <TextInput label="비밀번호"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="비밀번호"
          />

          <div className="auth-form__extras">
            <label className="checkbox">
              <input type="checkbox" />
              <span className="checkbox__box" />
              <span className="checkbox__label">자동 로그인</span>
            </label>
            <button type="button" className="link-button">
              비밀번호 찾기
            </button>
          </div>

          <Button type="submit" fullWidth>
            로그인
          </Button>

          <div className="auth-divider">
            <span>또는</span>
          </div>

          <div className="auth-social-buttons">
            <Button variant="secondary" fullWidth>
              Google로 계속하기
            </Button>
            <Button variant="secondary" fullWidth>
              Kakao로 계속하기
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

export default AuthLoginScreen;

