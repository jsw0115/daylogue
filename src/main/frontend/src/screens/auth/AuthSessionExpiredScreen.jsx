// FILE: src/main/frontend/src/screens/auth/AuthSessionExpiredScreen.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageContainer from "../../layout/PageContainer";
import Button from "../../components/common/Button";

function AuthSessionExpiredScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // (선택) 세션 만료 전 접근하려던 경로
  const from = location?.state?.from || "/plan/daily";

  const goLogin = () => {
    navigate("/auth/login", { replace: true, state: { from } });
  };

  return (
    <PageContainer
      screenId="AUTH-014"
      title="세션 만료"
      subtitle="보안을 위해 다시 로그인해 주세요."
    >
      <div className="screen auth-screen">
        <div className="auth-layout">
          <section className="auth-card">
            <header className="auth-card__header">
              <h2 className="auth-card__title">다시 로그인 필요</h2>
              <p className="auth-card__subtitle">
                로그인 정보가 만료되었거나 다른 기기에서 로그아웃되었을 수 있어요.
              </p>
            </header>

            <div className="auth-form">
              <Button type="button" variant="primary" fullWidth onClick={goLogin}>
                로그인으로 이동
              </Button>

              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => navigate("/", { replace: true })}
              >
                홈으로 이동
              </Button>
            </div>
          </section>

          <aside className="auth-side">
            <h3 className="auth-side__title">팁</h3>
            <p className="auth-side__text">
              공용 기기에서는 사용 후 로그아웃을 권장합니다.
            </p>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

export default AuthSessionExpiredScreen;
