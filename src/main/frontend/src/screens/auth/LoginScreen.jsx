// FILE: src/screens/auth/LoginScreen.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import safeStorage from "../../shared/utils/safeStorage";
import api from "../../api";
import AuthShell from "../../shared/ui/auth/AuthShell";
import Icon from "../../shared/ui/Icon";

export default function LoginScreen() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await api.post("/api/auth/login", {
        email: email.trim().toLowerCase(),
        password: pw,
      });

      // axios: res.data 사용
      const payload = res.data?.data || res.data;
      const accessToken = payload?.accessToken;
      const refreshToken = payload?.refreshToken;

      if (!accessToken || !refreshToken) {
        setError("로그인 응답에 토큰이 없습니다. 서버 응답 구조를 확인해 주세요.");
        return;
      }

      safeStorage.setJSON("auth.session", {
        userId: payload?.userId,
        email: payload?.email,
        nickname: payload?.nickname,
        role: payload?.role,
        accessToken,
        refreshToken,
        loggedInAt: Date.now(),
      });

      nav("/home");
    } catch (err) {
      const status = err?.response?.status;

      if (status === 401) return setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      if (status === 403) return setError("계정이 비활성화되었거나 접근 권한이 없습니다.");
      if (status === 400) return setError("입력값을 확인해 주세요.");
      if (!status) return setError("네트워크 오류가 발생했습니다. 연결을 확인해 주세요.");

      setError("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell badge="Login" layout="split">
      <div className="auth-title">로그인</div>
      <div className="auth-subtitle">이메일/비밀번호로 로그인합니다.</div>

      {error ? <div className="auth-alert auth-alert--error" role="alert">{error}</div> : null}

      <form onSubmit={submit} className="auth-form">
        <label className="auth-label">이메일</label>
        <div className="auth-inputWrap">
          <span className="auth-inputIcon"><Icon name="mail" size={18} /></span>
          <input
            className="auth-input auth-input--withIcon"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            autoComplete="email"
          />
        </div>

        <label className="auth-label" style={{ marginTop: 12 }}>비밀번호</label>
        <div className="auth-inputWrap">
          <span className="auth-inputIcon"><Icon name="lock" size={18} /></span>
          <input
            className="auth-input auth-input--withIcon auth-input--withRight"
            type={showPw ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button type="button" className="auth-inputAction" onClick={() => setShowPw((v) => !v)} aria-label="비밀번호 보기">
            <Icon name={showPw ? "eyeOff" : "eye"} size={18} />
          </button>
        </div>

        <button className="btn btn--primary auth-submit" type="submit" disabled={!email || !pw || submitting}>
          {submitting ? "처리 중..." : "로그인"}
          <Icon name="arrowRight" size={18} />
        </button>
      </form>

      <div className="auth-links">
        <Link to="/register">회원가입</Link>
        <Link to="/reset-password">비밀번호 재설정</Link>
        <Link to="/find-id">ID 찾기</Link>
        <Link to="/">시작 화면</Link>
      </div>
    </AuthShell>
  );
}
