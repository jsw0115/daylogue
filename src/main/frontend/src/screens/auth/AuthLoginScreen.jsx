// FILE: src/main/frontend/src/screens/auth/AuthLoginScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../layout/PageContainer";
import TextInput from "../../components/common/TextInput";
import Checkbox from "../../components/common/Checkbox";
import Button from "../../components/common/Button";

function AuthLoginScreen() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: AUTH-001-F01 이메일 로그인 API 연동
  };

  return (
    <PageContainer
      screenId="AUTH-001"
      title="로그인"
      subtitle="이메일/비밀번호로 로그인하고 Timebar Diary를 시작해요."
    >
      <div className="screen auth-screen">
        <div className="auth-layout">
          <section className="auth-card">
            <header className="auth-card__header">
              <h2 className="auth-card__title">Timebar Diary에 로그인</h2>
              <p className="auth-card__subtitle">
                오늘의 타임바와 갓생 기록을 이어서 관리해요.
              </p>
            </header>

            <form className="auth-form" onSubmit={handleSubmit}>
              <TextInput
                label="이메일"
                type="email"
                name="email"
                placeholder="you@example.com"
                fullWidth
                required
              />
              <TextInput
                label="비밀번호"
                type="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                fullWidth
                required
              />

              <div className="auth-form__row">
                <Checkbox
                  label="자동 로그인 유지"
                  defaultChecked={true}
                />
                <button
                  type="button"
                  className="link-button"
                  onClick={() => navigate("/auth/password-reset")}
                >
                  비밀번호 재설정
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
              >
                로그인
              </Button>

              <div className="auth-form__footer">
                <span>아직 계정이 없나요?</span>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => navigate("/auth/register")}
                >
                  회원가입
                </button>
              </div>

              <div className="auth-divider">
                <span className="auth-divider__line" />
                <span className="auth-divider__label">또는</span>
                <span className="auth-divider__line" />
              </div>

              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => navigate("/auth/social-link")}
              >
                소셜 계정으로 계속하기
              </Button>
            </form>
          </section>

          <aside className="auth-side">
            <h3 className="auth-side__title">타임바로 하루를 색으로 기록하기</h3>
            <p className="auth-side__text">
              일/주/월 타임바, 루틴, 포커스, 다이어리를 한 번에 관리하고
              모드(J/P/B)에 맞는 갓생 리포트를 받아볼 수 있어요.
            </p>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

export default AuthLoginScreen;
