// FILE: src/main/frontend/src/screens/auth/AuthPasswordResetInvalidTokenScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../layout/PageContainer";
import Button from "../../components/common/Button";

function AuthPasswordResetInvalidTokenScreen() {
  const navigate = useNavigate();

  return (
    <PageContainer
      screenId="AUTH-008"
      title="재설정 링크 오류"
      subtitle="링크가 만료되었거나 이미 사용되었을 수 있어요."
    >
      <div className="screen auth-screen">
        <div className="auth-layout">
          <section className="auth-card">
            <header className="auth-card__header">
              <h2 className="auth-card__title">링크를 사용할 수 없어요</h2>
              <p className="auth-card__subtitle">
                보안을 위해 재설정 링크는 일정 시간이 지나면 만료됩니다.
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

              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => navigate("/auth/login")}
              >
                로그인으로 돌아가기
              </Button>
            </div>
          </section>

          <aside className="auth-side">
            <h3 className="auth-side__title">안내</h3>
            <p className="auth-side__text">
              메일을 여러 번 클릭했거나 오래된 링크를 사용한 경우 이 화면이 나타날 수 있어요.
            </p>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

export default AuthPasswordResetInvalidTokenScreen;
