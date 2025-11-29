// src/main/frontend/src/screens/admin/AdminStatsScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import DashboardCard from "../../components/dashboard/DashboardCard";
import "../../styles/screens/admin.css";

function AdminStatsScreen() {
  return (
    <AppShell title="관리자 - 서비스 통계">
      <div className="screen admin-stats-screen">
        <header className="screen-header">
          <h2>서비스 전체 통계</h2>
        </header>

        <div className="admin-stats-grid">
          <DashboardCard title="총 가입자 수" subtitle="누적">
            <p className="stat-value">12,345</p>
          </DashboardCard>
          <DashboardCard title="월 활성 사용자(MAU)" subtitle="이번 달">
            <p className="stat-value">4,321</p>
          </DashboardCard>
          <DashboardCard title="일 평균 포커스 세션" subtitle="최근 7일">
            <p className="stat-value">98</p>
          </DashboardCard>
          <DashboardCard title="평균 루틴 달성률" subtitle="전체 사용자">
            <p className="stat-value">73%</p>
          </DashboardCard>
        </div>
      </div>
    </AppShell>
  );
}

export default AdminStatsScreen;

