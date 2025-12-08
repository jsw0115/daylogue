// FILE: src/main/frontend/src/screens/admin/AdminStatsScreen.jsx
import React from "react";
import PageContainer from "../../layout/PageContainer";
import DashboardCard from "../../components/dashboard/DashboardCard";
import StatValue from "../../components/dashboard/StatValue";

function AdminStatsScreen() {
  return (
    <PageContainer
      screenId="ADM-004"
      title="관리자 통계 리포트"
      subtitle="전체 사용자 기준 서비스 이용 통계와 모드별 사용 패턴을 확인합니다."
    >
      <div className="screen admin-screen">
        <div className="stat-dashboard-grid">
          <DashboardCard
            title="전체 사용자 현황"
            subtitle="가입자, 활성 사용자, 유지율"
          >
            <div className="stat-dashboard-row">
              <StatValue label="총 가입자" value="12,340" unit="명" />
              <StatValue label="월간 활성 사용자(MAU)" value="3,210" unit="명" />
              <StatValue
                label="30일 유지율"
                value="68"
                unit="%"
                trend={{ direction: "up", text: "지난 달 대비 +4%p" }}
              />
            </div>
          </DashboardCard>

          <DashboardCard
            title="모드별(J/P/B) 사용 비중"
            subtitle="최근 30일 기준 세션 수/시간 비중"
          >
            <div className="stat-dashboard-row">
              <StatValue label="J 모드" value="42" unit="%" />
              <StatValue label="P 모드" value="31" unit="%" />
              <StatValue label="B 모드" value="27" unit="%" />
            </div>
          </DashboardCard>

          <DashboardCard
            title="타임바 / 포커스 사용량"
            subtitle="플래너 타임바·포커스 세션 기반 활동량 지표"
          >
            <div className="stat-dashboard-row">
              <StatValue
                label="일간 평균 타임블록"
                value="18"
                unit="개"
                trend={{ direction: "up", text: "지난 주 대비 +2개" }}
              />
              <StatValue
                label="일간 평균 포커스 시간"
                value="3.1"
                unit="h"
                trend={{ direction: "up", text: "지난 주 대비 +0.4h" }}
              />
            </div>
          </DashboardCard>

          <DashboardCard
            title="리포트 다운로드"
            subtitle="CSV / Excel로 내보내기"
            right={
              <button
                type="button"
                className="btn btn--primary btn--sm admin-export-button"
              >
                CSV 내보내기
              </button>
            }
          >
            <p className="admin-stats-description">
              실제 서비스에서는 기간/모드/플랫폼별 필터를 적용하여
              다운로드할 수 있습니다.
            </p>
          </DashboardCard>
        </div>
      </div>
    </PageContainer>
  );
}

export default AdminStatsScreen;
