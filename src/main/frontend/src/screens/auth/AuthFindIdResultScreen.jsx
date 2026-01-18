// FILE: src/main/frontend/src/screens/auth/AuthFindIdResultScreen.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageContainer from "../../layout/PageContainer";
import Button from "../../components/common/Button";

function AuthFindIdResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const hintType = location?.state?.hintType; // "EMAIL" | "PHONE" | undefined
  const channelText =
    hintType === "PHONE" ? "문자 메시지" : hintType === "EMAIL" ? "이메일" : "안내 채널";

  return (
    <PageContainer
      screenId="AUTH-006-R"
      title="요청 처리됨"
      subtitle="입력한 정보로 계정 안내를 전송했어요."
    >
      <div className="screen auth-screen">
        <div className="auth-layout">
          <section className="auth-card">
            <header className="auth-card__header">
              <h2 className="auth-card__title">계정 안내 전송</h2>
              <p className="auth-card__subtitle">
                {channelText}로 안내가 전송될 수 있어요. 스팸함/차단함도 함께 확인해 주세요.
              </p>
            </header>

            <div className="auth-form">
              <Button type="button" variant="primary" fullWidth onClick={() => navigate("/auth/login")}>
                로그인으로 이동
              </Button>

              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => navigate("/auth/find-id")}
              >
                다시 시도하기
              </Button>

              <div className="auth-form__footer" style={{ justifyContent: "center" }}>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => navigate("/auth/password-reset")}
                >
                  비밀번호를 잊었나요?
                </button>
              </div>
            </div>
          </section>

          <aside className="auth-side">
            <h3 className="auth-side__title">팁</h3>
            <p className="auth-side__text">
              안내가 오지 않는다면 입력 정보가 최신인지 확인하고, 잠시 후 다시 시도해 주세요.
            </p>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

export default AuthFindIdResultScreen;
