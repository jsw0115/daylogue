// FILE: src/screens/auth/FindIdScreen.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../../shared/ui/auth/AuthShell";
import Icon from "../../shared/ui/Icon";
import api from "../../api";

export default function FindIdScreen() {
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setInfo("");
    setError("");
    setSubmitting(true);

    try {
      // ⚠️ payload는 서버 스펙에 따라 바뀔 수 있음 (근거 부족: find-id API 바디 규격이 대화에 없음)
      // 보안 UX: 존재 여부를 노출하지 않도록 성공 메시지를 통일하는 것을 권장
      await api.post("/api/auth/find-id", { query: query.trim() });

      setInfo("요청이 접수되었습니다. 입력하신 정보로 안내를 진행합니다.");
    } catch (err) {
      const status = err?.response?.status;
      if (!status) setError("네트워크 오류가 발생했습니다. 연결을 확인해 주세요.");
      else setInfo("요청이 접수되었습니다. 입력하신 정보로 안내를 진행합니다."); // 열거 방지
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell badge="Find ID" layout="single">
      <div className="auth-title">ID 찾기</div>
      <div className="auth-subtitle">가입 시 사용한 이메일 또는 휴대폰 번호로 계정을 찾습니다.</div>

      {error ? <div className="auth-alert auth-alert--error">{error}</div> : null}
      {info ? <div className="auth-alert auth-alert--success">{info}</div> : null}

      <form onSubmit={submit} className="auth-form">
        <label className="auth-label">이메일 또는 휴대폰</label>
        <div className="auth-inputWrap">
          <span className="auth-inputIcon"><Icon name="user" size={18} /></span>
          <input
            className="auth-input auth-input--withIcon"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="you@example.com 또는 01012345678"
            autoComplete="username"
          />
        </div>

        <button className="btn btn--primary auth-submit" type="submit" disabled={!query.trim() || submitting}>
          {submitting ? "처리 중..." : "찾기"}
          <Icon name="arrowRight" size={18} />
        </button>
      </form>

      <div className="auth-links">
        <Link to="/login">로그인</Link>
        <Link to="/reset-password">비밀번호 재설정</Link>
        <Link to="/">시작 화면</Link>
      </div>
    </AuthShell>
  );
}
