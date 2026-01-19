import React from "react";
import { useNavigate } from "react-router-dom";
import AuthShell from "./components/AuthShell";

export default function AuthEntryScreen() {
  const nav = useNavigate();

  return (
    <AuthShell
      title="시작하기"
      subtitle="로그인 또는 회원가입을 선택해 주세요."
      foot={
        <div className="tf-muted">
          계속 진행하면 이용약관 및 개인정보 처리방침에 동의한 것으로 간주됩니다.
        </div>
      }
    >
      <div className="tf-entryGrid">
        <button className="tf-btn tf-btn--primary" onClick={() => nav("/login")}>
          로그인 <span className="tf-arrow">→</span>
        </button>
        <button className="tf-btn tf-btn--ghost" onClick={() => nav("/register")}>
          회원가입 <span className="tf-arrow">→</span>
        </button>
      </div>

      <div className="tf-divider" />

      <div className="tf-entryLinks">
        <button className="tf-linkBtn" onClick={() => nav("/reset-password")}>비밀번호 재설정</button>
        <button className="tf-linkBtn" onClick={() => nav("/find-id")}>ID 찾기</button>
      </div>
    </AuthShell>
  );
}
