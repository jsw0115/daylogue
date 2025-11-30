// src/screens/auth/AuthLoginScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import TextInput from "../../components/common/TextInput";
import Checkbox from "../../components/common/Checkbox";
import Button from "../../components/common/Button";
import "../../styles/screens/auth.css";

function AuthLoginScreen() {
  return (
    <div className="screen auth-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">로그인</h2>
          <p className="screen-header__subtitle">
            Daylogue에 다시 오신 걸 환영해요.
          </p>
        </div>
      </header>

      <div className="auth-layout">
        <section className="auth-hero">
          <div className="auth-hero__badge">오늘 하루, 색으로 정리하기</div>
          <h3>하루를 기록하면, 패턴이 보입니다.</h3>
          <p>
            타임바, 할 일, 루틴, 일기를 한 곳에서 관리하고
            <br />
            나만의 시간 팔레트를 만들어보세요.
          </p>
        </section>

        <div className="auth-card">
          <DashboardCard title="이메일로 로그인">
            <form className="auth-form">
              <TextInput label="이메일" placeholder="you@example.com" />
              <TextInput
                label="비밀번호"
                type="password"
                placeholder="비밀번호를 입력하세요"
              />

              <div className="auth-form__extras">
                <Checkbox label="자동 로그인" />
                <button type="button" className="link-button">
                  비밀번호 찾기
                </button>
              </div>

              <Button className="btn--primary btn--full">로그인</Button>
            </form>

            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: "var(--color-muted)",
              }}
            >
              아직 계정이 없으신가요?{" "}
              <button type="button" className="link-button">
                회원가입하기
              </button>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

export default AuthLoginScreen;
