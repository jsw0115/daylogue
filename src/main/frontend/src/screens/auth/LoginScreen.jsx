// src/screens/auth/LoginScreen.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/screens/auth.css";
import safeStorage from "../../shared/utils/safeStorage";

export default function LoginScreen() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const submit = (e) => {
    e.preventDefault();
    // 서버 연동 전 임시 로그인 상태 저장
    safeStorage.setJSON("auth.session", { email, loggedInAt: Date.now() });
    nav("/home");
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-title">로그인</div>
        <div className="auth-subtitle">이메일/비밀번호로 로그인합니다.</div>

        <form onSubmit={submit} className="auth-form">
          <label className="auth-label">이메일</label>
          <input className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />

          <label className="auth-label">비밀번호</label>
          <input className="auth-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" />

          <button className="btn btn--primary auth-submit" type="submit" disabled={!email || !pw}>
            로그인
          </button>
        </form>

        <div className="auth-links">
          <Link to="/register">회원가입</Link>
          <Link to="/reset-password">비밀번호 재설정</Link>
          <Link to="/find-id">ID 찾기</Link>
        </div>
      </div>
    </div>
  );
}
