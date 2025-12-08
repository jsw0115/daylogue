// FILE: src/screens/routine/RoutineHistoryScreen.jsx
import React, { useState } from "react";
import PageContainer from "../../layout/PageContainer";
import DatePicker from "../../components/common/DatePicker";
import Select from "../../components/common/Select";
import DashboardCard from "../../components/dashboard/DashboardCard";
import StatValue from "../../components/dashboard/StatValue";
import RoutineTrackerGrid from "../../components/routine/RoutineTrackerGrid";

/**
 * ROUT-003-F01: 루틴 체크 (히스토리 표시)
 * ROUT-005-F01: 루틴 히스토리 조회
 * ROUT-005-F02: 루틴 달성률
 */

const MOCK_ROUTINES = [
  { id: "r1", name: "아침 스트레칭", icon: "🌅" },
  { id: "r2", name: "저녁 회고 일기", icon: "📓" },
];

const MOCK_CELLS = [
  { routineId: "r1", date: "2025-11-30", status: "done" },
  { routineId: "r1", date: "2025-12-01", status: "done" },
  { routineId: "r1", date: "2025-12-02", status: "missed" },
  { routineId: "r2", date: "2025-12-01", status: "done" },
  { routineId: "r2", date: "2025-12-03", status: "skip" },
];

function RoutineHistoryScreen() {
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [period, setPeriod] = useState("30");

  const dayCount = period === "7" ? 7 : period === "14" ? 14 : 30;

  // 단순 샘플 달성률
  const completionRate = 76;
  const streak = 4;

  const handleCellToggle = (routineId, dateKey) => {
    // TODO: ROUT-003-F01 토글 → 서버 반영
    console.log("toggle", routineId, dateKey);
  };

  const handleCellLongPress = (routineId, dateKey) => {
    // TODO: ROUT-005-F01 상세 편집 모달 등
    console.log("long press", routineId, dateKey);
  };

  return (
    <PageContainer
      screenId="ROUT-003"
      title="루틴 히스토리 / 달성률"
      subtitle="캘린더/그리드로 루틴 수행 이력을 확인합니다."
    >
      <div className="screen routine-history-screen">
        <section className="filter-bar">
          <div className="filter-bar__row">
            <DatePicker
              label="시작일"
              value={startDate}
              onChange={setStartDate}
            />
            <Select
              label="기간"
              value={period}
              onChange={setPeriod}
              options={[
                { value: "7", label: "7일" },
                { value: "14", label: "14일" },
                { value: "30", label: "30일" },
              ]}
            />
          </div>
        </section>

        <div className="routine-history-layout">
          <DashboardCard
            title="루틴 히스토리 그리드"
            subtitle="각 루틴 × 날짜별 수행 현황"
          >
            <RoutineTrackerGrid
              startDate={startDate}
              dayCount={dayCount}
              routines={MOCK_ROUTINES}
              cells={MOCK_CELLS}
              onCellToggle={handleCellToggle}
              onCellLongPress={handleCellLongPress}
            />
          </DashboardCard>

          <DashboardCard
            title="달성률 / 스트릭"
            subtitle="갓생 점수 계산에 활용되는 핵심 지표"
          >
            <div className="routine-stats-row">
              <StatValue
                label="기간 달성률"
                value={completionRate}
                unit="%"
                trend={{ direction: "up", text: "지난 기간 대비 +5%p" }}
              />
              <StatValue
                label="현재 스트릭"
                value={streak}
                unit="일"
                trend={{ direction: "up", text: "최고 기록에 도전해보세요" }}
              />
            </div>
            <p className="routine-stats-helper">
              루틴 달성률은 STAT-004 갓생 리포트에서도 함께 사용됩니다.
            </p>
          </DashboardCard>
        </div>
      </div>
    </PageContainer>
  );
}

export default RoutineHistoryScreen;
