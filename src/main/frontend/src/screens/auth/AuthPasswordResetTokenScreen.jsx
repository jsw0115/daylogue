// FILE: src/main/frontend/src/screens/auth/AuthPasswordResetTokenScreen.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageContainer from "../../layout/PageContainer";
import TextInput from "../../components/common/TextInput";
import Button from "../../components/common/Button";

function AuthPasswordResetTokenScreen() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validation = useMemo(() => {
    const errs = [];
    if (!token) errs.push("재설정 토큰이 없습니다.");
    if (!newPassword || newPassword.length < 8) errs.push("비밀번호는 8자 이상이어야 합니다.");
    if (newPassword !== confirmPassword) errs.push("비밀번호 확인이 일치하지 않습니다.");
    return { ok: errs.length === 0, errs };
  }, [token, newPassword, confirmPassword]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validation.ok) {
      setError(validation.errs[0]);
      return;
    }

    setSubmitting(true);
    try {
      // TODO: AUTH-003-F02 토큰 기반 비밀번호 변경 API
      // POST /api/auth/password-reset
      // { token, newPassword }
      //
      // const res = await fetch("/api/auth/password-reset", {...})
      // if (!res.ok) throw new Error("fail")

      navigate("/auth/login", { replace: true });
    } catch {
      // 토큰 만료/무효/이미 사용 등은 별도 화면으로 보내는게 UX가 좋음
      navigate("/auth/password-reset/invalid", { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  // 토큰이 아예 없으면 바로 invalid로
  if (!token) {
    return (
      <PageContainer
        screenId="AUTH-003-T"
        title="비밀번호 재설정"
        subtitle="링크 정보가 올바르지 않습니다."
      >
        <div className="screen auth-screen">
          <div className="auth-layout">
            <section className="auth-card">
              <header className="auth-card__header">
                <h2 className="auth-card__title">링크 오류</h2>
                <p className="auth-card__subtitle">
                  재설정 링크가 올바르지 않습니다. 다시 요청해 주세요.
                </p>
              </header>

              <div className="auth-form">
                <Button
                  type="button"
                  variant="primary"
                  fullWidth
                  onClick={() => navigate("/auth/password-reset")}
                >
                  재설정 다시 요청하기
                </Button>
              </div>
            </section>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      screenId="AUTH-003-T"
      title="새 비밀번호 설정"
      subtitle="새 비밀번호를 입력하고 계정을 안전하게 유지하세요."
    >
      <div className="screen auth-screen">
        <div className="auth-layout">
          <section className="auth-card">
            <header className="auth-card__header">
              <h2 className="auth-card__title">비밀번호 변경</h2>
              <p className="auth-card__subtitle">8자 이상 비밀번호를 권장합니다.</p>
            </header>

            <form className="auth-form" onSubmit={submit}>
              <TextInput
                label="새 비밀번호"
                type="password"
                name="newPassword"
                placeholder="새 비밀번호"
                fullWidth
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextInput
                label="비밀번호 확인"
                type="password"
                name="confirmPassword"
                placeholder="새 비밀번호 확인"
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {error ? (
                <div className="auth-error" role="alert" style={{ marginTop: 10 }}>
                  {error}
                </div>
              ) : null}

              <Button type="submit" variant="primary" fullWidth disabled={submitting || !validation.ok}>
                {submitting ? "변경 중..." : "비밀번호 변경"}
              </Button>
            </form>
          </section>

          <aside className="auth-side">
            <h3 className="auth-side__title">보안 팁</h3>
            <p className="auth-side__text">
              다른 서비스와 다른 비밀번호를 사용하고, 주기적으로 변경해 주세요.
            </p>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

export default AuthPasswordResetTokenScreen;
