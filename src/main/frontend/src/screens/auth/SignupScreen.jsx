// src/screens/auth/SignupScreen.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";

export default function SignupScreen() {
  const nav = useNavigate();
  const [name, setName] = useState("홍길동");
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("you@example.com");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  return (
    <AuthLayout>
      <h1 className="auth-title">회원가입</h1>
      <div className="auth-subtitle">새 계정을 만들고 타임바 다이어리를 시작하세요.</div>

      <div className="auth-field">
        <label>이름</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="auth-field">
        <label>닉네임</label>
        <input value={nick} onChange={(e) => setNick(e.target.value)} placeholder="표시될 닉네임" />
      </div>

      <div className="auth-field">
        <label>이메일</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="auth-field">
        <label>비밀번호</label>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="8자 이상" />
      </div>

      <div className="auth-field">
        <label>비밀번호 확인</label>
        <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
      </div>

      <button
        className="auth-btn"
        onClick={() => {
          // TODO: API 연동 + 검증
          nav("/auth/login");
        }}
      >
        회원가입 완료
      </button>

      <div style={{ marginTop: 10 }}>
        <Link className="auth-link" to="/auth/login">이미 계정이 있나요? 로그인</Link>
      </div>
    </AuthLayout>
  );
}
