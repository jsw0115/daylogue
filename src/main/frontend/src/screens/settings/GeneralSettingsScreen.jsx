// FILE: src/main/frontend/src/screens/settings/GeneralSettingsScreen.jsx
import React from "react";
import PageContainer from "../../layout/PageContainer";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import { useAppMode, APP_MODES } from "../../shared/context/AppModeContext";

function GeneralSettingsScreen() {
  const { mode } = useAppMode();

  const modeLabel =
    mode === APP_MODES.J
      ? "J (계획형)"
      : mode === APP_MODES.P
      ? "P (기록형)"
      : "B (밸런스)";

  return (
    <PageContainer
      screenId="SET-002"
      title="환경 설정"
      subtitle="시간관리 모드, 시작 화면, 공개 범위와 포맷을 설정합니다."
    >
      <div className="screen settings-screen settings-screen--general">
        <div className="settings-card">
          <header className="settings-card__header">
            <h3 className="settings-card__title">기본 환경</h3>
            <p className="settings-card__subtitle">
              현재 모드: <strong>{modeLabel}</strong>
            </p>
          </header>

          <form className="settings-form">
            <Select
              label="시간관리 모드"
              options={[
                { value: "J", label: "J (계획형 · Plan 중심)" },
                { value: "P", label: "P (기록형 · Actual 중심)" },
                { value: "B", label: "B (밸런스 · Plan + Actual)" },
              ]}
            />

            <Select
              label="기본 시작 화면"
              options={[
                { value: "home", label: "홈 대시보드" },
                { value: "plan_daily", label: "일간 플래너" },
                { value: "stat", label: "통합 통계" },
              ]}
            />

            <Select
              label="기본 공개 범위"
              options={[
                { value: "private", label: "나만 보기" },
                { value: "busy", label: "바쁨만 공유" },
                { value: "attendees", label: "참석자에게만" },
                { value: "public", label: "모두에게 공개" },
              ]}
            />

            <Select
              label="기본 알림 리드 타임"
              options={[
                { value: "5", label: "5분 전" },
                { value: "10", label: "10분 전" },
                { value: "30", label: "30분 전" },
                { value: "60", label: "1시간 전" },
              ]}
            />

            <div className="settings-form__group settings-form__group--inline">
              <Select
                label="날짜 포맷"
                options={[
                  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                  { value: "YYYY.MM.DD", label: "YYYY.MM.DD" },
                  { value: "MM/DD", label: "MM/DD" },
                ]}
              />
              <Select
                label="시간 포맷"
                options={[
                  { value: "24", label: "24시간제" },
                  { value: "12", label: "12시간제 (AM/PM)" },
                ]}
              />
            </div>

            <div className="settings-form__actions">
              <Button type="button" variant="primary">
                환경 설정 저장
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}

export default GeneralSettingsScreen;
