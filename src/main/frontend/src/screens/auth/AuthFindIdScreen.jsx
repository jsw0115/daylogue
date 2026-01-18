// FILE: src/main/frontend/src/screens/auth/AuthFindIdScreen.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../layout/PageContainer";
import TextInput from "../../components/common/TextInput";
import Button from "../../components/common/Button";

function normalizeDigits(v) {
  return String(v || "").replace(/\D/g, "");
}
function isLikelyEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

function AuthFindIdScreen() {
  const navigate = useNavigate();
  const [value, setValue] = useState(""); // email or phone
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const normalized = useMemo(() => {
    const trimmed = value.trim();
    const digits = normalizeDigits(trimmed);
    return {
      raw: trimmed,
      digits,
      isEmail: isLikelyEmail(trimmed),
      isPhone: digits.length >= 10 && digits.length <= 11,
    };
  }, [value]);

  const canSubmit = normalized.raw.length > 0 && (normalized.isEmail || normalized.isPhone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("이메일 또는 휴대폰 번호 형식을 확인해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      // TODO: AUTH-006-F01 아이디(계정) 찾기 요청 API
      // 보안 권장: 존재 여부를 직접 노출하지 않고, 항상 '요청 처리됨' UX로 통일
      // 예)
      // POST /api/auth/find-id
      // { type: "EMAIL"|"PHONE", email?, phone? }
      //
      // await fetch("/api/auth/find-id", { ... })

      navigate("/auth/find-id/result", {
        replace: true,
        state: {
          // 화면 메시지용(민감정보 직접 노출은 피하기)
          hintType: normalized.isEmail ? "EMAIL" : "PHONE",
        },
      });
    } catch {
      // 존재 여부, 서버 상태 등 구체 메시지는 피하는 편이 안전
      navigate("/auth/find-id/result", {
        replace: true,
        state: { hintType: normalized.isEmail ? "EMAIL" : "PHONE" },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      screenId="AUTH-006"
      title="아이디 찾기"
      subtitle="가입 시 사용한 이메일 또는 휴대폰으로 계정 안내를 받을 수 있어요."
    >
      <div className="screen auth-screen">
        <div className="auth-layout">
          <section className="auth-card">
            <header className="auth-card__header">
              <h2 className="auth-card__title">계정 찾기</h2>
              <p className="auth-card__subtitle">
                이메일 또는 휴대폰 번호를 입력하면 안내를 전송해 드려요.
              </p>
            </header>

            <form className="auth-form" onSubmit={handleSubmit}>
              <TextInput
                label="이메일 또는 휴대폰"
                name="emailOrPhone"
                placeholder="you@example.com 또는 010-1234-5678"
                fullWidth
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />

              {error ? (
                <div className="auth-error" role="alert" style={{ marginTop: 10 }}>
                  {error}
                </div>
              ) : null}

              <Button type="submit" variant="primary" fullWidth disabled={!canSubmit || submitting}>
                {submitting ? "처리 중..." : "안내 받기"}
              </Button>

              <div className="auth-form__footer">
                <button
                  type="button"
                  className="link-button"
                  onClick={() => navigate("/auth/login")}
                >
                  로그인으로 돌아가기
                </button>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => navigate("/auth/password-reset")}
                >
                  비밀번호 재설정
                </button>
              </div>
            </form>
          </section>

          <aside className="auth-side">
            <h3 className="auth-side__title">보안 안내</h3>
            <p className="auth-side__text">
              계정 존재 여부를 직접 노출하지 않기 위해, 안내는 요청 접수 형태로 처리됩니다.
            </p>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

export default AuthFindIdScreen;
