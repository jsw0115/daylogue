import React, { useState } from "react";
import PageContainer from "../../layout/PageContainer";
import Select from "../../components/common/Select";
import DatePicker from "../../components/common/DatePicker";
import DashboardCard from "../../components/dashboard/DashboardCard";
import StatValue from "../../components/dashboard/StatValue";

function StatCategoryScreen() {
  const [rangeType, setRangeType] = useState("weekly");

  return (
    <PageContainer
      screenId="STAT-002"
      title="카테고리별 통계"
      subtitle="기간별 카테고리별 수행량/시간을 Plan vs Actual 기준으로 살펴봅니다."
    >
      <div className="screen stat-category-screen">
        {/* 필터 영역 */}
        <div className="stat-filter-row">
          <Select
            label="기간 단위"
            value={rangeType}
            onChange={setRangeType}
            options={[
              { value: "daily", label: "일간" },
              { value: "weekly", label: "주간" },
              { value: "monthly", label: "월간" },
              { value: "custom", label: "사용자 지정" },
            ]}
          />
          <DatePicker label="시작일" />
          <DatePicker label="종료일" />
          <Select
            label="기준"
            options={[
              { value: "actual", label: "실행 기준" },
              { value: "plan", label: "계획 기준" },
            ]}
          />
        </div>

        <div className="stat-screen-grid">
          {/* 도넛/막대 차트 자리 */}
          <DashboardCard
            title="카테고리별 시간 비율"
            subtitle="도넛 또는 막대 그래프로 카테고리별 사용 비율을 볼 수 있습니다."
          >
            <div className="stat-chart-placeholder">
              카테고리별 통계 차트 영역입니다.
            </div>
          </DashboardCard>

          {/* 요약 KPI */}
          <DashboardCard
            title="요약 지표"
            subtitle="가장 많이 사용한 카테고리와 균형 정도를 간단히 확인합니다."
          >
            <div className="stat-summary-row">
              <StatValue label="총 사용 시간" value="42" unit="h" />
              <StatValue label="최대 카테고리" value="공부" unit="" />
              <StatValue label="휴식 비율" value="18" unit="%" />
            </div>
          </DashboardCard>

          {/* 상세 리스트 */}
          <DashboardCard
            title="카테고리 상세 목록"
            subtitle="각 카테고리별 시간/비율을 내림차순으로 보여줍니다."
          >
            <table className="stat-category-table">
              <thead>
                <tr>
                  <th>카테고리</th>
                  <th>시간</th>
                  <th>비율</th>
                  <th>Plan 대비</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>공부</td>
                  <td>18h</td>
                  <td>43%</td>
                  <td>+3h</td>
                </tr>
                <tr>
                  <td>업무</td>
                  <td>12h</td>
                  <td>29%</td>
                  <td>-1h</td>
                </tr>
                <tr>
                  <td>운동/건강</td>
                  <td>4h</td>
                  <td>10%</td>
                  <td>+1h</td>
                </tr>
                <tr>
                  <td>휴식</td>
                  <td>3h</td>
                  <td>7%</td>
                  <td>-2h</td>
                </tr>
              </tbody>
            </table>
          </DashboardCard>
        </div>
      </div>
    </PageContainer>
  );
}

export default StatCategoryScreen;
