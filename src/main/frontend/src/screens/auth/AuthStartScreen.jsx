// FILE: src/screens/auth/AuthStartScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../../shared/ui/auth/AuthShell";
import Icon from "../../shared/ui/Icon";

export default function AuthStartScreen() {
  const nav = useNavigate();

  return (
    <AuthShell
      badge="Start here"
      footer={<div>로그인 후 토큰이 저장되며 보호 API 호출 시 Authorization 헤더를 자동으로 붙일 수 있습니다.</div>}
      layout="split"
    >
      <div className="auth-title">시작하기</div>
      <div className="auth-subtitle">로그인 또는 회원가입을 선택하세요.</div>

      <div className="auth-actions">
        <button className="btn btn--primary btn--wide" onClick={() => nav("/login")} type="button">
          <span>로그인</span>
          <Icon name="arrowRight" size={18} />
        </button>

        <button className="btn btn--ghost btn--wide" onClick={() => nav("/register")} type="button">
          <span>회원가입</span>
          <Icon name="arrowRight" size={18} />
        </button>
      </div>

      <div className="auth-divider" />

      <div className="auth-start__tips">
        <div>• 이메일/비밀번호로 로그인합니다.</div>
        <div>• 회원가입 후 바로 로그인할 수 있습니다.</div>
        <div>• 비밀번호 재설정/ID 찾기는 계정 정보 노출을 최소화합니다.</div>
      </div>
    </AuthShell>
  );
}
