// src/screens/auth/RegisterScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/screens/auth.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhone(raw) {
  return (raw || "").replace(/\D/g, ""); // 숫자만
}
function isValidKoreanMobileDigits(digits) {
  // 010xxxxxxxx(11) 또는 지역/옛번호까지 넓히면 더 복잡해지니 MVP는 10~11자리만 허용
  return digits.length === 10 || digits.length === 11;
}
function mmss(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  return `${m}:${s}`;
}

export default function RegisterScreen() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");

  const [phone, setPhone] = useState("");
  const [smsCode, setSmsCode] = useState("");

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  // 필수 동의 + 선택 동의
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formInfo, setFormInfo] = useState("");

  // SMS 인증 상태
  const [smsSending, setSmsSending] = useState(false);
  const [smsVerifying, setSmsVerifying] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [smsCooldownSec, setSmsCooldownSec] = useState(0); // 재전송 쿨다운/만료 타이머
  const [smsVerified, setSmsVerified] = useState(false);

  // 서버가 발급하는 요청 ID/토큰이 있다면 저장(권장)
  const [smsRequestId, setSmsRequestId] = useState(null);
  const [smsVerifyToken, setSmsVerifyToken] = useState(null);

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
      smsCodeDigits: normalizePhone(smsCode),
    };
  }, [email, nick, phone, pw, pw2, smsCode]);

  // SMS 발송 후 타이머(예: 3분) 카운트다운
  useEffect(() => {
    if (!smsSent) return;
    if (smsCooldownSec <= 0) return;

    const id = setInterval(() => {
      setSmsCooldownSec((c) => {
        if (c <= 1) {
          clearInterval(id);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smsSent, smsCooldownSec]);

  // 휴대폰 번호 변경 시 인증 상태 초기화
  useEffect(() => {
    setSmsVerified(false);
    setSmsVerifyToken(null);
    setSmsRequestId(null);
    setSmsSent(false);
    setSmsCode("");
    setSmsCooldownSec(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalized.phoneDigits]);

  const validation = useMemo(() => {
    const errors = [];

    if (!normalized.email) errors.push("이메일을 입력해 주세요.");
    else if (!EMAIL_RE.test(normalized.email)) errors.push("이메일 형식이 올바르지 않습니다.");

    if (!normalized.nick) errors.push("닉네임을 입력해 주세요.");
    else if (normalized.nick.length > 80) errors.push("닉네임은 80자 이내로 입력해 주세요.");

    if (!normalized.phoneDigits) errors.push("휴대폰 번호를 입력해 주세요.");
    else if (!isValidKoreanMobileDigits(normalized.phoneDigits)) errors.push("휴대폰 번호 형식이 올바르지 않습니다.");

    if (!normalized.pw) errors.push("비밀번호를 입력해 주세요.");
    else if (normalized.pw.length < 8) errors.push("비밀번호는 8자 이상이어야 합니다.");
    else if (normalized.pw.length > 128) errors.push("비밀번호가 너무 깁니다(128자 이내 권장).");

    if (normalized.pw !== normalized.pw2) errors.push("비밀번호 확인이 일치하지 않습니다.");

    if (!agreeTerms) errors.push("이용약관에 동의해 주세요.");
    if (!agreePrivacy) errors.push("개인정보 처리방침에 동의해 주세요.");

    // 가입 완료 전, 휴대폰 인증 완료를 요구(정책)
    if (!smsVerified) errors.push("휴대폰 인증을 완료해 주세요.");

    return { ok: errors.length === 0, errors };
  }, [normalized, agreeTerms, agreePrivacy, smsVerified]);

  const requestSmsCode = async () => {
    setFormError("");
    setFormInfo("");

    if (!normalized.phoneDigits) {
      setFormError("휴대폰 번호를 입력해 주세요.");
      return;
    }
    if (!isValidKoreanMobileDigits(normalized.phoneDigits)) {
      setFormError("휴대폰 번호 형식이 올바르지 않습니다.");
      return;
    }
    if (smsCooldownSec > 0) return;

    setSmsSending(true);
    try {
      // TODO: 실제 백엔드 경로/스펙에 맞추기
      // 권장: purpose=SIGNUP, ttlSeconds=180, rateLimit 서버에서 강제
      const res = await fetch("/api/auth/phone/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalized.phoneDigits,
          purpose: "SIGNUP",
        }),
      });

      // 보안 관점: 존재 여부 등 정보 노출 최소화(가능하면 ok처럼 처리)
      if (res.ok) {
        let data = null;
        try {
          data = await res.json();
        } catch {
          // no body ok
        }

        setSmsSent(true);
        setSmsVerified(false);
        setSmsCode("");
        setSmsCooldownSec(180); // 3분 타이머(예시)
        setSmsRequestId(data?.requestId ?? null);
        setFormInfo("인증번호를 발송했습니다. 문자 메시지를 확인해 주세요.");
        return;
      }

      // 실패 메시지는 과도하게 구체화하지 않음
      setFormError("인증번호 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } catch {
      setFormError("네트워크 오류가 발생했습니다. 연결을 확인해 주세요.");
    } finally {
      setSmsSending(false);
    }
  };

  const verifySmsCode = async () => {
    setFormError("");
    setFormInfo("");

    if (!smsSent) {
      setFormError("먼저 인증번호를 발송해 주세요.");
      return;
    }
    const code = normalized.smsCodeDigits;
    if (!code || code.length < 4) {
      setFormError("인증번호를 입력해 주세요.");
      return;
    }

    setSmsVerifying(true);
    try {
      // TODO: 실제 백엔드 경로/스펙에 맞추기
      const res = await fetch("/api/auth/phone/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalized.phoneDigits,
          code,
          requestId: smsRequestId, // 있으면 같이 전달
          purpose: "SIGNUP",
        }),
      });

      if (res.ok) {
        let data = null;
        try {
          data = await res.json();
        } catch {
          // no body ok
        }
        // 권장: 서버가 "verifyToken"을 내려주고, 가입 API에서 이 토큰이 유효해야 가입 완료
        setSmsVerified(true);
        setSmsVerifyToken(data?.verifyToken ?? "VERIFIED"); // 임시 fallback(서버 연동 시 제거 권장)
        setFormInfo("휴대폰 인증이 완료되었습니다.");
        return;
      }

      setFormError("인증번호가 올바르지 않거나 만료되었습니다.");
    } catch {
      setFormError("네트워크 오류가 발생했습니다. 연결을 확인해 주세요.");
    } finally {
      setSmsVerifying(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormInfo("");

    if (!validation.ok) {
      setFormError(validation.errors[0]); // 첫 에러만 노출
      return;
    }

    setSubmitting(true);
    try {
      // TODO: 실제 백엔드 엔드포인트로 맞추기
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalized.email,
          nick: normalized.nick,
          phone: normalized.phoneDigits,
          phoneVerifyToken: smsVerifyToken, // 서버 토큰 검증 기반 권장
          password: normalized.pw,
          tz,
          agreeTerms: true,
          agreePrivacy: true,
          marketingOptIn: !!agreeMarketing,
        }),
      });

      // 계정/휴대폰 존재 여부 등 열거 방지: 409(중복)도 동일 UX로 처리하는 편이 안전
      if (res.ok || res.status === 409) {
        setFormInfo("가입 요청이 처리되었습니다. 로그인해 주세요.");
        nav("/login");
        return;
      }

      setFormError("가입 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } catch {
      setFormError("네트워크 오류가 발생했습니다. 연결을 확인해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const sendBtnLabel = smsSent ? (smsCooldownSec > 0 ? `재전송 (${mmss(smsCooldownSec)})` : "인증번호 재전송") : "인증번호 받기";

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-title">회원가입</div>
        <div className="auth-subtitle">계정을 생성합니다.</div>

        {formError ? (
          <div className="auth-error" role="alert" style={{ marginTop: 10 }}>
            {formError}
          </div>
        ) : null}
        {formInfo ? (
          <div className="auth-success" role="status" style={{ marginTop: 10 }}>
            {formInfo}
          </div>
        ) : null}

        <form onSubmit={submit} className="auth-form">
          <label className="auth-label" htmlFor="reg-email">
            이메일
          </label>
          <input
            id="reg-email"
            className="auth-input"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <label className="auth-label" htmlFor="reg-nick">
            닉네임
          </label>
          <input
            id="reg-nick"
            className="auth-input"
            autoComplete="nickname"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            placeholder="표시될 닉네임"
            maxLength={80}
          />

          <label className="auth-label" htmlFor="reg-phone">
            휴대폰 번호
          </label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              id="reg-phone"
              className="auth-input"
              style={{ flex: 1 }}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              disabled={smsSending || smsVerifying || smsVerified}
            />
            <button
              type="button"
              className="btn"
              onClick={requestSmsCode}
              disabled={smsSending || smsVerifying || smsVerified || !isValidKoreanMobileDigits(normalized.phoneDigits) || smsCooldownSec > 0}
              style={{ whiteSpace: "nowrap" }}
            >
              {smsSending ? "발송 중..." : smsVerified ? "인증완료" : sendBtnLabel}
            </button>
          </div>

          {/* 인증번호 입력/검증 */}
          {smsSent && !smsVerified ? (
            <div style={{ marginTop: 10 }}>
              <label className="auth-label" htmlFor="reg-sms-code">
                인증번호
              </label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  id="reg-sms-code"
                  className="auth-input"
                  style={{ flex: 1 }}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  placeholder="문자로 받은 인증번호"
                />
                <button
                  type="button"
                  className="btn"
                  onClick={verifySmsCode}
                  disabled={smsVerifying || normalizePhone(smsCode).length < 4}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {smsVerifying ? "확인 중..." : "인증하기"}
                </button>
              </div>
              <div className="auth-hint" style={{ marginTop: 6 }}>
                {smsCooldownSec > 0 ? `유효시간: ${mmss(smsCooldownSec)}` : "인증번호가 만료되었습니다. 재전송해 주세요."}
              </div>
            </div>
          ) : null}

          {smsVerified ? (
            <div className="auth-hint" style={{ marginTop: 10 }}>
              휴대폰 인증 완료
            </div>
          ) : null}

          <label className="auth-label" htmlFor="reg-pw" style={{ marginTop: 10 }}>
            비밀번호
          </label>
          <input
            id="reg-pw"
            className="auth-input"
            type="password"
            autoComplete="new-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="8자 이상(권장: 12자 이상)"
          />

          <label className="auth-label" htmlFor="reg-pw2">
            비밀번호 확인
          </label>
          <input
            id="reg-pw2"
            className="auth-input"
            type="password"
            autoComplete="new-password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            placeholder="비밀번호를 한번 더 입력"
          />

          {/* 동의 체크 */}
          <div style={{ marginTop: 10 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
              <span>
                <Link to="/legal/terms">이용약관</Link> 동의(필수)
              </span>
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
              <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} />
              <span>
                <Link to="/legal/privacy">개인정보 처리방침</Link> 동의(필수)
              </span>
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
              <input type="checkbox" checked={agreeMarketing} onChange={(e) => setAgreeMarketing(e.target.checked)} />
              <span>마케팅 수신 동의(선택)</span>
            </label>

            <div className="auth-hint" style={{ marginTop: 6 }}>
              시간대: {tz}
            </div>
          </div>

          <button className="btn btn--primary auth-submit" type="submit" disabled={submitting || !validation.ok}>
            {submitting ? "처리 중..." : "가입하기"}
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
