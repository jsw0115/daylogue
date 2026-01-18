// FILE: src/main/frontend/src/screens/auth/AuthPasswordResetRequestSentScreen.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageContainer from "../../layout/PageContainer";
import Button from "../../components/common/Button";

function AuthPasswordResetRequestSentScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // (선택) 이전 화면에서 state로 email을 넘기면 문구에 활용 가능. 단, 노출은 최소화 권장.
  const emailHint = location?.state?.emailHint;
  const [resending, setResending] = useState(false);
  const [info, setInfo] = useState("");

  const resend = async () => {
    setInfo("");
    setResending(true);
    try {
      // TODO: AUTH-007-F01 비밀번호 재설정 메일 재발송 API
      // await fetch("/api/auth/password-reset/resend", { ... })
      setInfo("재발송 요청이 처리되었습니다. 메일함을 확인해 주세요.");
    } catch {
      setInfo("재발송 요청이 처리되었습니다. 메일함을 확인해 주세요.");
    } finally {
      setResending(false);
    }
  };

  return (
    <PageContainer
      screenId="AUTH-007"
      title="재설정 메일 전송"
      subtitle="메일의 링크로 들어가 새 비밀번호를 설정해요."
    >
      <div className="screen auth-screen">
        <div className="auth-layout">
          <section className="auth-card">
            <header className="auth-card__header">
              <h2 className="auth-card__title">메일을 확인해 주세요</h2>
              <p className="auth-card__subtitle">
                {emailHint ? (
                  <>
                    {emailHint} 으로 재설정 링크를 전송했어요. 스팸함도 확인해 주세요.
                  </>
                ) : (
                  <>
                    재설정 링크를 전송했어요. 스팸함도 확인해 주세요.
                  </>
                )}
              </p>
            </header>

            {info ? (
              <div className="auth-success" role="status" style={{ marginTop: 10 }}>
                {info}
              </div>
            ) : null}

            <div className="auth-form">
              <Button type="button" variant="primary" fullWidth onClick={() => navigate("/auth/login")}>
                로그인으로 돌아가기
              </Button>

              <Button type="button" variant="ghost" fullWidth onClick={resend} disabled={resending}>
                {resending ? "재발송 중..." : "재설정 메일 재발송"}
              </Button>

              <div className="auth-form__footer" style={{ justifyContent: "center" }}>
                <button type="button" className="link-button" onClick={() => navigate("/auth/password-reset")}>
                  이메일을 다시 입력할게요
                </button>
              </div>
            </div>
          </section>

          <aside className="auth-side">
            <h3 className="auth-side__title">안내</h3>
            <p className="auth-side__text">
              링크가 만료되면 새로 재설정 요청이 필요할 수 있어요.
            </p>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

export default AuthPasswordResetRequestSentScreen;
