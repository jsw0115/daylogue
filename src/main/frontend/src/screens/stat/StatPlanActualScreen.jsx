import React from "react";
import PageContainer from "../../layout/PageContainer";
import Select from "../../components/common/Select";
import DatePicker from "../../components/common/DatePicker";
import DashboardCard from "../../components/dashboard/DashboardCard";
import StatValue from "../../components/dashboard/StatValue";

function StatPlanActualScreen() {
  return (
    <PageContainer
      screenId="STAT-003"
      title="Plan vs Actual 비교"
      subtitle="일/주/월/연 단위로 계획 대비 실제 수행량을 비교합니다."
    >
      <div className="screen stat-plan-actual-screen">
        {/* 필터 영역 */}
        <div className="stat-filter-row">
          <Select
            label="단위"
            options={[
              { value: "daily", label: "일간" },
              { value: "weekly", label: "주간" },
              { value: "monthly", label: "월간" },
              { value: "yearly", label: "연간" },
            ]}
          />
          <DatePicker label="기준 날짜" />
          <Select
            label="보기"
            options={[
              { value: "time", label: "시간 기준" },
              { value: "task", label: "Task 기준" },
            ]}
          />
        </div>

        <div className="stat-screen-grid">
          <DashboardCard
            title="Plan vs Actual 시간 비교"
            subtitle="한 눈에 계획 시간과 실제 사용 시간을 비교합니다."
          >
            <div className="stat-summary-row">
              <StatValue label="계획 시간" value="36" unit="h" />
              <StatValue label="실행 시간" value="29" unit="h" />
              <StatValue label="달성률" value="80" unit="%" />
            </div>
            <div className="stat-chart-placeholder">
              시간 기준 막대/라인 차트 영역입니다.
            </div>
          </DashboardCard>

          <DashboardCard
            title="Plan vs Actual Task 비교"
            subtitle="Task 개수 관점에서 계획 대비 실행을 비교합니다."
          >
            <div className="stat-summary-row">
              <StatValue label="계획 Task" value="25" unit="개" />
              <StatValue label="완료 Task" value="18" unit="개" />
              <StatValue label="Task 완료율" value="72" unit="%" />
            </div>
            <div className="stat-chart-placeholder">
              Task 기준 Plan vs Done 차트 영역입니다.
            </div>
          </DashboardCard>
        </div>
      </div>
    </PageContainer>
  );
}

export default StatPlanActualScreen;
