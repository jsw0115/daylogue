// src/screens/auth/RegisterScreen.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/screens/auth.css";

export default function RegisterScreen() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [pw, setPw] = useState("");

  const submit = (e) => {
    e.preventDefault();
    // 서버 연동 전 임시: 가입 성공으로 가정
    nav("/login");
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-title">회원가입</div>
        <div className="auth-subtitle">계정을 생성합니다.</div>

        <form onSubmit={submit} className="auth-form">
          <label className="auth-label">이메일</label>
          <input className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label className="auth-label">닉네임</label>
          <input className="auth-input" value={nick} onChange={(e) => setNick(e.target.value)} />

          <label className="auth-label">비밀번호</label>
          <input className="auth-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />

          <button className="btn btn--primary auth-submit" type="submit" disabled={!email || !nick || !pw}>
            가입하기
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">로그인</Link>
          <Link to="/reset-password">비밀번호 재설정</Link>
        </div>
      </div>
    </div>
  );
}
