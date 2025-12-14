// src/screens/auth/FindIdScreen.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/screens/auth.css";

export default function FindIdScreen() {
  const [phoneOrEmail, setPhoneOrEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();
    alert("서버 연동 전: ID 찾기 UI만 제공됩니다.");
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-title">ID 찾기</div>
        <div className="auth-subtitle">가입 시 사용한 정보로 계정을 찾습니다.</div>

        <form onSubmit={submit} className="auth-form">
          <label className="auth-label">이메일 또는 휴대폰</label>
          <input className="auth-input" value={phoneOrEmail} onChange={(e) => setPhoneOrEmail(e.target.value)} />

          <button className="btn btn--primary auth-submit" type="submit" disabled={!phoneOrEmail}>
            찾기
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
