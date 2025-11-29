// src/main/frontend/src/screens/auth/AuthRegisterScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import TextInput from "../../components/common/TextInput";
import Button from "../../components/common/Button";
import "../../styles/screens/auth.css";

function AuthRegisterScreen() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: authApi.signup(...)
    console.log("signup", { nickname, email, password });
  };

  return (
    <AppShell title="회원가입">
      <div className="screen auth-screen auth-screen--register">
        <header className="auth-header">
          <h2>Daylogue에 가입하기</h2>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <TextInput label="닉네임"
            value={nickname}
            onChange={setNickname}
            placeholder="앱에서 사용할 이름"
          />
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
            placeholder="8자 이상"
          />

          <Button type="submit" fullWidth>
            회원가입
          </Button>
        </form>
      </div>
    </AppShell>
  );
}

export default AuthRegisterScreen;

