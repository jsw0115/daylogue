// FILE: src/main/frontend/src/screens/auth/AuthRegisterScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../layout/PageContainer";
import TextInput from "../../components/common/TextInput";
import Button from "../../components/common/Button";

function AuthRegisterScreen() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: AUTH-002-F01 회원가입 API 연동
  };

  return (
    <PageContainer
      screenId="AUTH-002"
      title="회원가입"
      subtitle="새 계정을 만들고 나만의 타임바 다이어리를 시작해요."
    >
      <div className="screen auth-screen">
        <div className="auth-layout">
          <section className="auth-card">
            <header className="auth-card__header">
              <h2 className="auth-card__title">계정 만들기</h2>
              <p className="auth-card__subtitle">
                기본 정보만 입력하면 바로 플래너를 사용할 수 있어요.
              </p>
            </header>

            <form className="auth-form" onSubmit={handleSubmit}>
              <TextInput
                label="이름"
                name="name"
                placeholder="홍길동"
                fullWidth
                required
              />
              <TextInput
                label="닉네임"
                name="nickname"
                placeholder="표시될 닉네임을 입력하세요"
                fullWidth
              />
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
                placeholder="8자 이상 입력하세요"
                fullWidth
                required
              />
              <TextInput
                label="비밀번호 확인"
                type="password"
                name="passwordConfirm"
                placeholder="비밀번호를 한 번 더 입력하세요"
                fullWidth
                required
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
              >
                회원가입 완료
              </Button>

              <div className="auth-form__footer">
                <span>이미 계정이 있나요?</span>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => navigate("/auth/login")}
                >
                  로그인
                </button>
              </div>
            </form>
          </section>

          <aside className="auth-side">
            <h3 className="auth-side__title">J / P / B 모드로 나에게 맞는 플래너</h3>
            <p className="auth-side__text">
              가입 후 첫 로그인에서 시간관리 모드와 기본 시작 화면을 고르면
              홈과 플래너, 통계 레이아웃이 자동으로 맞춰져요.
            </p>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

export default AuthRegisterScreen;
