// src/screens/settings/GeneralSettingsScreen.jsx
import React from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import "../../styles/screens/settings.css";

function GeneralSettingsScreen() {
  return (
    <div className="screen settings-screen">
      <header className="screen-header">
        <div className="screen-header__left">
          <h2 className="screen-header__title">환경 설정</h2>
          <p className="screen-header__subtitle">
            시간 관리 모드, 기본 시작 화면 등 전반적인 환경을 설정해요.
          </p>
        </div>
      </header>

      <div className="settings-grid">
        <DashboardCard title="시간 관리 스타일" subtitle="J / P / 밸런스 모드">
          <div className="settings-section">
            <div className="settings-row">
              <div>
                <div className="settings-row__label">J형 플래너 모드</div>
                <div className="settings-row__desc">
                  계획을 먼저 세우고 체크하는 방식
                </div>
              </div>
            </div>
            <div className="settings-row">
              <div>
                <div className="settings-row__label">P형 타임라인 모드</div>
                <div className="settings-row__desc">
                  지나간 시간을 기록하면서 패턴을 보는 방식
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="기본 화면" subtitle="앱을 켰을 때 처음 보이는 화면">
          <div className="settings-section">
            <div className="settings-row">
              <span className="settings-row__label">기본 시작 화면</span>
              <span className="settings-row__desc">홈 대시보드</span>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

export default GeneralSettingsScreen;
