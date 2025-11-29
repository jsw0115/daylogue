// src/main/frontend/src/screens/auth/AuthPasswordResetScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import TextInput from "../../components/common/TextInput";
import Button from "../../components/common/Button";
import "../../styles/screens/auth.css";

function AuthPasswordResetScreen() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: authApi.requestPasswordReset(email)
    console.log("password reset request", email);
  };

  return (
    <AppShell title="비밀번호 재설정">
      <div className="screen auth-screen auth-screen--reset">
        <header className="auth-header">
          <h2>비밀번호 재설정</h2>
          <p>가입하신 이메일로 재설정 링크를 보내드립니다.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <TextInput label="이메일"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
          />
          <Button type="submit" fullWidth>
            재설정 이메일 보내기
          </Button>
        </form>
      </div>
    </AppShell>
  );
}

export default AuthPasswordResetScreen;

