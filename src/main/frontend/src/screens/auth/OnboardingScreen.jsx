// FILE: src/main/frontend/src/screens/auth/OnboardingScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../layout/PageContainer";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import { useAppMode, APP_MODES } from "../../shared/context/AppModeContext";

function OnboardingScreen() {
  const navigate = useNavigate();
  const { mode, setMode } = useAppMode();

  const [startScreen, setStartScreen] = useState("home");
  const [defaultVisibility, setDefaultVisibility] = useState("attendees");

  const handleComplete = (e) => {
    e.preventDefault();
    // TODO: AUTH-005-F01 / MODE-001-F01 온보딩 설정 저장 API 연동
    // - mode, startScreen, defaultVisibility 등 사용자 프로필에 저장
    navigate("/plan/daily");
  };

  const renderModeDescription = (currentMode) => {
    if (currentMode === APP_MODES.J) {
      return "J 모드 · 계획형 · 오늘/이번 주 Plan과 Plan vs Actual을 가장 먼저 보여줄게요.";
    }
    if (currentMode === APP_MODES.P) {
      return "P 모드 · 기록형 · 실제 사용한 시간, 포커스, 스트릭을 중심으로 보여줄게요.";
    }
    return "B 모드 · 밸런스형 · 계획 · 실행 · 회고를 균형 있게 섞어서 보여줄게요.";
  };

  return (
    <PageContainer
      screenId="AUTH-005"
      title="처음 오신 걸 환영해요"
      subtitle="시간관리 모드와 기본 환경을 먼저 설정해 볼게요."
    >
      <div className="screen auth-screen">
        <div className="auth-layout auth-layout--onboarding">
          <section className="auth-card">
            <header className="auth-card__header">
              <h2 className="auth-card__title">나에게 맞는 시간관리 모드</h2>
              <p className="auth-card__subtitle">
                J / P / B 중 하나를 선택하면 홈, 플래너, 통계 레이아웃과
                갓생 점수 가중치가 자동으로 맞춰져요.
              </p>
            </header>

            <form className="auth-form" onSubmit={handleComplete}>
              <div className="mode-select-row">
                <Button
                  type="button"
                  variant={mode === APP_MODES.J ? "primary" : "ghost"}
                  className="mode-select-button"
                  onClick={() => setMode(APP_MODES.J)}
                >
                  J · Plan 중심
                </Button>
                <Button
                  type="button"
                  variant={mode === APP_MODES.P ? "primary" : "ghost"}
                  className="mode-select-button"
                  onClick={() => setMode(APP_MODES.P)}
                >
                  P · 기록 중심
                </Button>
                <Button
                  type="button"
                  variant={mode === APP_MODES.B ? "primary" : "ghost"}
                  className="mode-select-button"
                  onClick={() => setMode(APP_MODES.B)}
                >
                  B · Plan + Actual
                </Button>
              </div>

              <p className="mode-select-description">
                {renderModeDescription(mode)}
              </p>

              <Select
                label="기본 시작 화면"
                value={startScreen}
                onChange={setStartScreen}
                options={[
                  { value: "home", label: "홈 대시보드" },
                  { value: "plan_daily", label: "일간 플래너" },
                  { value: "stat", label: "통합 통계" },
                ]}
                className="mt-4"
              />

              <Select
                label="일정 기본 공개 범위"
                value={defaultVisibility}
                onChange={setDefaultVisibility}
                options={[
                  { value: "public", label: "모두" },
                  { value: "attendees", label: "참석자만" },
                  { value: "busy", label: "바쁨만" },
                  { value: "private", label: "나만" },
                ]}
                className="mt-2"
              />

              <div className="auth-form__footer auth-form__footer--onboarding">
                <Button type="submit" variant="primary">
                  설정 완료하고 시작하기
                </Button>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => navigate("/plan/daily")}
                >
                  나중에 설정할게요
                </button>
              </div>
            </form>
          </section>

          <aside className="auth-side">
            <h3 className="auth-side__title">Timebar Diary는 이렇게 활용해요</h3>
            <p className="auth-side__text">
              · J 모드: 내일/이번 주 계획을 세우고 Plan vs Actual을 체크하는 분<br />
              · P 모드: 오늘 실제로 어디에 시간을 썼는지 기록하고 싶은 분<br />
              · B 모드: 계획·실행·회고를 모두 챙기고 싶은 분
            </p>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

export default OnboardingScreen;
