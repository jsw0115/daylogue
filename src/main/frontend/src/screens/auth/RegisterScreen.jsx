// FILE: src/screens/auth/RegisterScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/screens/auth.css";
import api from "../../api";
import AuthShell from "../../shared/ui/auth/AuthShell";
import Icon from "../../shared/ui/Icon";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhone(raw) {
  return (raw || "").replace(/\D/g, "");
}
function isValidKoreanMobileDigits(digits) {
  return digits.length === 10 || digits.length === 11;
}

export default function RegisterScreen() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formInfo, setFormInfo] = useState("");

  const tz = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Seoul";
    } catch {
      return "Asia/Seoul";
    }
  }, []);

  const normalized = useMemo(() => {
    return {
      email: email.trim().toLowerCase(),
      nick: nick.trim(),
      phoneDigits: normalizePhone(phone),
      pw,
      pw2,
    };
  }, [email, nick, phone, pw, pw2]);

  useEffect(() => {
    setFormError("");
    setFormInfo("");
  }, [email, nick, phone, pw, pw2, agreeTerms, agreePrivacy, agreeMarketing]);

  const validation = useMemo(() => {
    const errors = [];

    if (!normalized.email) errors.push("이메일을 입력해 주세요.");
    else if (!EMAIL_RE.test(normalized.email)) errors.push("이메일 형식이 올바르지 않습니다.");

    if (!normalized.nick) errors.push("닉네임을 입력해 주세요.");
    else if (normalized.nick.length < 2) errors.push("닉네임은 2자 이상 입력해 주세요.");
    else if (normalized.nick.length > 80) errors.push("닉네임은 80자 이내로 입력해 주세요.");

    if (normalized.phoneDigits && !isValidKoreanMobileDigits(normalized.phoneDigits)) {
      errors.push("휴대폰 번호 형식이 올바르지 않습니다.");
    }

    if (!normalized.pw) errors.push("비밀번호를 입력해 주세요.");
    else if (normalized.pw.length < 8) errors.push("비밀번호는 8자 이상이어야 합니다.");

    if (normalized.pw !== normalized.pw2) errors.push("비밀번호 확인이 일치하지 않습니다.");

    if (!agreeTerms) errors.push("이용약관에 동의해 주세요.");
    if (!agreePrivacy) errors.push("개인정보 처리방침에 동의해 주세요.");

    return { ok: errors.length === 0, errors };
  }, [normalized, agreeTerms, agreePrivacy]);

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormInfo("");

    if (!validation.ok) {
      setFormError(validation.errors[0]);
      return;
    }

    setSubmitting(true);
    try {
      const requestBody = {
        email: normalized.email,
        nickname: normalized.nick,
        phone: normalized.phoneDigits || null,
        phoneVerifyToken: null,
        password: normalized.pw,
        tz,
        agreeTerms: true,
        agreePrivacy: true,
        marketingOptIn: !!agreeMarketing,
      };

      const res = await api.post("/api/auth/signup", requestBody);

      // axios는 res.data로 받음
      if (res.status === 201 || res.status === 200) {
        setFormInfo("가입 요청이 처리되었습니다. 로그인해 주세요.");
        nav("/login");
        return;
      }

      setFormError("가입 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } catch (err) {
      const status = err?.response?.status;
      const payload = err?.response?.data;

      if (status === 409) {
        // 정책상 동일 UX로 처리하고 싶으면 formInfo로 바꿔도 됨
        setFormError("이미 가입된 사용자입니다.");
        return;
      }
      if (status === 400) {
        setFormError(payload?.message || "입력값을 확인해 주세요.");
        return;
      }
      if (!status) {
        setFormError("네트워크 오류가 발생했습니다. 연결을 확인해 주세요.");
        return;
      }
      setFormError("가입 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell badge="Register">
      <div className="auth-title">회원가입</div>
      <div className="auth-subtitle">계정을 생성합니다.</div>

      {formError ? (
        <div className="auth-alert auth-alert--error" role="alert">
          {formError}
        </div>
      ) : null}
      {formInfo ? (
        <div className="auth-alert auth-alert--success" role="status">
          {formInfo}
        </div>
      ) : null}

      <form onSubmit={submit} className="auth-form">
        <label className="auth-label" htmlFor="reg-email">이메일</label>
        <div className="auth-inputWrap">
          <span className="auth-inputIcon" aria-hidden="true">
            <Icon name="mail" size={18} />
          </span>
          <input
            id="reg-email"
            className="auth-input auth-input--withIcon"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <label className="auth-label" htmlFor="reg-nick" style={{ marginTop: 12 }}>닉네임</label>
        <div className="auth-inputWrap">
          <span className="auth-inputIcon" aria-hidden="true">
            <Icon name="user" size={18} />
          </span>
          <input
            id="reg-nick"
            className="auth-input auth-input--withIcon"
            autoComplete="nickname"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            placeholder="표시될 닉네임"
            maxLength={80}
          />
        </div>

        <label className="auth-label" htmlFor="reg-phone" style={{ marginTop: 12 }}>휴대폰 번호(선택)</label>
        <div className="auth-inputWrap">
          <span className="auth-inputIcon" aria-hidden="true">
            <Icon name="phone" size={18} />
          </span>
          <input
            id="reg-phone"
            className="auth-input auth-input--withIcon"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01012345678"
          />
        </div>

        <label className="auth-label" htmlFor="reg-pw" style={{ marginTop: 12 }}>비밀번호</label>
        <div className="auth-inputWrap">
          <span className="auth-inputIcon" aria-hidden="true">
            <Icon name="lock" size={18} />
          </span>
          <input
            id="reg-pw"
            className="auth-input auth-input--withIcon"
            type="password"
            autoComplete="new-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="8자 이상"
          />
        </div>

        <label className="auth-label" htmlFor="reg-pw2" style={{ marginTop: 12 }}>비밀번호 확인</label>
        <div className="auth-inputWrap">
          <span className="auth-inputIcon" aria-hidden="true">
            <Icon name="lock" size={18} />
          </span>
          <input
            id="reg-pw2"
            className="auth-input auth-input--withIcon"
            type="password"
            autoComplete="new-password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            placeholder="비밀번호를 한번 더 입력"
          />
        </div>

        <div className="auth-checks">
          <label className="auth-check">
            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
            <span>
              <Link to="/legal/terms">이용약관</Link> 동의(필수)
            </span>
          </label>

          <label className="auth-check">
            <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} />
            <span>
              <Link to="/legal/privacy">개인정보 처리방침</Link> 동의(필수)
            </span>
          </label>

          <label className="auth-check">
            <input type="checkbox" checked={agreeMarketing} onChange={(e) => setAgreeMarketing(e.target.checked)} />
            <span>마케팅 수신 동의(선택)</span>
          </label>

          <div className="auth-hint">시간대: {tz}</div>
        </div>

        <button className="btn btn--primary auth-submit" type="submit" disabled={submitting || !validation.ok}>
          {submitting ? "처리 중..." : "가입하기"}
          <Icon name="arrowRight" size={18} />
        </button>
      </form>

      <div className="auth-links">
        <Link to="/login">로그인</Link>
        <Link to="/reset-password">비밀번호 재설정</Link>
      </div>

      <div className="auth-bottom">
        <button type="button" className="btn btn--ghost" onClick={() => nav("/start")}>
          시작 화면으로
        </button>
      </div>
    </AuthShell>
  );
}
