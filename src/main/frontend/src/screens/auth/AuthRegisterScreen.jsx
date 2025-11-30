// src/screens/auth/AuthRegisterScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import TextInput from "../../components/common/TextInput";
import Button from "../../components/common/Button";
import "../../styles/screens/auth.css";

function AuthRegisterScreen() {
  return (
    <div className="screen auth-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">회원가입</h2>
          <p className="screen-header__subtitle">
            Daylogue와 함께 나만의 시간 관리 루틴을 만들어보세요.
          </p>
        </div>
      </header>

      <div className="auth-layout">
        <section className="auth-hero">
          <div className="auth-hero__badge">첫 시작을 위한 설정</div>
          <h3>오늘부터의 기록이 쌓여 내일을 바꿉니다.</h3>
          <p>MBTI J/P 스타일에 맞춰 플래너 템플릿을 추천해 드릴게요.</p>
        </section>

        <div className="auth-card">
          <DashboardCard title="기본 정보 입력">
            <form className="auth-form">
              <TextInput label="이름 또는 닉네임" placeholder="예) 성원" />
              <TextInput label="이메일" placeholder="you@example.com" />
              <TextInput
                label="비밀번호"
                type="password"
                placeholder="8자 이상 입력"
              />
              <TextInput
                label="비밀번호 확인"
                type="password"
                placeholder="다시 한 번 입력"
              />

              <Button className="btn--primary btn--full">가입하기</Button>
            </form>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

export default AuthRegisterScreen;
