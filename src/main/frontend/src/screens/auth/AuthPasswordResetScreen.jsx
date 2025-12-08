// FILE: src/main/frontend/src/screens/auth/AuthPasswordResetScreen.jsx
import React, { useState } from "react";
import PageContainer from "../../layout/PageContainer";
import TextInput from "../../components/common/TextInput";
import Button from "../../components/common/Button";

function AuthPasswordResetScreen() {
  const [step, setStep] = useState("request"); // 'request' | 'reset'

  const handleRequest = (e) => {
    e.preventDefault();
    // TODO: AUTH-003-F01 비밀번호 재설정 메일 발송 API
    setStep("reset");
  };

  const handleReset = (e) => {
    e.preventDefault();
    // TODO: AUTH-003-F02 토큰 기반 비밀번호 변경 API
  };

  return (
    <PageContainer
      screenId="AUTH-003"
      title="비밀번호 재설정"
      subtitle="가입한 이메일로 재설정 링크를 보내고 새 비밀번호를 설정해요."
    >
      <div className="screen auth-screen">
        <div className="auth-layout">
          <section className="auth-card">
            {step === "request" ? (
              <>
                <header className="auth-card__header">
                  <h2 className="auth-card__title">재설정 링크 보내기</h2>
                  <p className="auth-card__subtitle">
                    가입한 이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드려요.
                  </p>
                </header>
                <form className="auth-form" onSubmit={handleRequest}>
                  <TextInput
                    label="이메일"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    fullWidth
                    required
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                  >
                    메일 보내기
                  </Button>
                </form>
              </>
            ) : (
              <>
                <header className="auth-card__header">
                  <h2 className="auth-card__title">새 비밀번호 설정</h2>
                  <p className="auth-card__subtitle">
                    메일에서 온 링크를 통해 진입했다고 가정하고, 새 비밀번호를 입력합니다.
                  </p>
                </header>
                <form className="auth-form" onSubmit={handleReset}>
                  <TextInput
                    label="새 비밀번호"
                    type="password"
                    name="newPassword"
                    placeholder="새 비밀번호를 입력하세요"
                    fullWidth
                    required
                  />
                  <TextInput
                    label="비밀번호 확인"
                    type="password"
                    name="confirmPassword"
                    placeholder="새 비밀번호를 한 번 더 입력하세요"
                    fullWidth
                    required
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                  >
                    비밀번호 변경
                  </Button>
                </form>
              </>
            )}
          </section>

          <aside className="auth-side">
            <h3 className="auth-side__title">계정을 안전하게 보호하세요</h3>
            <p className="auth-side__text">
              다른 서비스와 다른 비밀번호를 사용하고, 주기적으로 변경해 주세요.
            </p>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

export default AuthPasswordResetScreen;
