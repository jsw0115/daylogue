// FILE: src/screens/auth/ResetPasswordScreen.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../../shared/ui/auth/AuthShell";
import Icon from "../../shared/ui/Icon";
import api from "../../api";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setInfo("");
    setError("");
    setSubmitting(true);

    try {
      // ⚠️ 서버 스펙에 따라 path/body는 변경 필요 (근거 부족: password-reset API 규격이 대화에 없음)
      await api.post("/api/auth/password-reset/request", { email: email.trim().toLowerCase() });

      // 열거 방지: 성공 메시지는 통일 권장
      setInfo("요청이 접수되었습니다. 안내 메일이 발송되었는지 확인해 주세요.");
    } catch (err) {
      const status = err?.response?.status;
      if (!status) setError("네트워크 오류가 발생했습니다. 연결을 확인해 주세요.");
      else setInfo("요청이 접수되었습니다. 안내 메일이 발송되었는지 확인해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell badge="Reset Password" layout="single">
      <div className="auth-title">비밀번호 재설정</div>
      <div className="auth-subtitle">가입한 이메일로 재설정 안내를 보냅니다.</div>

      {error ? <div className="auth-alert auth-alert--error">{error}</div> : null}
      {info ? <div className="auth-alert auth-alert--success">{info}</div> : null}

      <form onSubmit={submit} className="auth-form">
        <label className="auth-label">이메일</label>
        <div className="auth-inputWrap">
          <span className="auth-inputIcon"><Icon name="key" size={18} /></span>
          <input
            className="auth-input auth-input--withIcon"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            autoComplete="email"
          />
        </div>

        <button className="btn btn--primary auth-submit" type="submit" disabled={!email.trim() || submitting}>
          {submitting ? "처리 중..." : "재설정 안내 보내기"}
          <Icon name="arrowRight" size={18} />
        </button>
      </form>

      <div className="auth-links">
        <Link to="/login">로그인</Link>
        <Link to="/find-id">ID 찾기</Link>
        <Link to="/">시작 화면</Link>
      </div>
    </AuthShell>
  );
}
