// src/main/frontend/src/screens/auth/OnboardingScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import Button from "../../components/common/Button";
import TabBar from "../../components/common/TabBar";
import "../../styles/screens/auth.css";

function OnboardingScreen() {
  const [mode, setMode] = useState("balance"); // 'j', 'p', 'balance'
  const [startScreen, setStartScreen] = useState("home");

  return (
    <AppShell title="첫 설정">
      <div className="screen auth-screen auth-screen--onboarding">
        <header className="auth-header">
          <h2>나에게 맞는 시간관리 스타일</h2>
          <p>MBTI의 J / P 느낌으로, 내 스타일을 대략 선택해봅시다.</p>
        </header>

        <section className="onboarding-section">
          <h3>시간관리 모드</h3>
          <TabBar tabs={[
              { key: "j", label: "J형 · 계획 철저" },
              { key: "balance", label: "중간(Balanced)" },
              { key: "p", label: "P형 · 유연하게" },
            ]}
            activeKey={mode}
            onChange={setMode}
          />
          <p className="onboarding-description">
            {mode === "j" &&
              "계획을 시간 단위로 쪼개고 체크하는 걸 좋아하는 스타일이에요."}
            {mode === "p" &&
              "유연하게 흘러가되, 중요한 것만 잘 챙기고 싶은 스타일이에요."}
            {mode === "balance" &&
              "계획도 세우고 여유도 챙기는, 중간 정도의 스타일이에요."}
          </p>
        </section>

        <section className="onboarding-section">
          <h3>앱을 켰을 때 처음 볼 화면</h3>
          <div className="onboarding-start-screen">
            <label>
              <input type="radio"
                name="startScreen"
                value="home"
                checked={startScreen === "home"}
                onChange={(e) => setStartScreen(e.target.value)}
              />
              홈 대시보드
            </label>
            <label>
              <input type="radio"
                name="startScreen"
                value="daily"
                checked={startScreen === "daily"}
                onChange={(e) => setStartScreen(e.target.value)}
              />
              일간 플래너
            </label>
            <label>
              <input type="radio"
                name="startScreen"
                value="weekly"
                checked={startScreen === "weekly"}
                onChange={(e) => setStartScreen(e.target.value)}
              />
              주간 플래너
            </label>
          </div>
        </section>

        <footer className="onboarding-footer">
          <Button fullWidth>시작하기</Button>
        </footer>
      </div>
    </AppShell>
  );
}

export default OnboardingScreen;

