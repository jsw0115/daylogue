// src/main/frontend/src/screens/stat/StatDashboardScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import { useResponsiveLayout } from "../../shared/hooks/useResponsiveLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";

function StatDashboardScreen() {
  const viewport = useResponsiveLayout();

  return (
    <AppShell title="통합 통계 대시보드">
      <div className={`screen screen--stat-dashboard screen--${viewport}`}>
        <header className="screen-header">
          <div className="screen-header__center">
            <h2>이번 주 요약</h2>
          </div>
        </header>

        <div className="stat-grid">
          <DashboardCard title="완료한 할 일 수" subtitle="이번 주">
            <p className="stat-value">23개</p>
          </DashboardCard>

          <DashboardCard title="루틴 평균 달성률" subtitle="이번 주">
            <p className="stat-value">78%</p>
          </DashboardCard>

          <DashboardCard title="집중 모드 누적 시간" subtitle="이번 주">
            <p className="stat-value">7시간 30분</p>
          </DashboardCard>

          <DashboardCard title="일기 작성일 수" subtitle="이번 주">
            <p className="stat-value">5일</p>
          </DashboardCard>
        </div>
      </div>
    </AppShell>
  );
}

export default StatDashboardScreen;
