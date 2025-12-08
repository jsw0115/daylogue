import React from "react";
import PageContainer from "../../layout/PageContainer";
import DashboardCard from "../../components/dashboard/DashboardCard";
import StatValue from "../../components/dashboard/StatValue";
import { useAppMode, APP_MODES } from "../../shared/context/AppModeContext";

/**
 * STAT-004-F01, STAT-004-F02, MODE-001-F04
 * - 포커스/학습 통계 + 갓생 점수/루틴 리포트
 * - 모드(J/P/B)에 따라 가중치 프리셋을 설명용으로 표시
 */

const MODE_WEIGHTS = {
  [APP_MODES.J]: {
    label: "J (계획형)",
    planActual: 50,
    routine: 20,
    task: 20,
    focus: 5,
    streak: 5,
  },
  [APP_MODES.P]: {
    label: "P (기록형)",
    planActual: 20,
    routine: 20,
    task: 15,
    focus: 30,
    streak: 15,
  },
  [APP_MODES.B]: {
    label: "B (밸런스형)",
    planActual: 40,
    routine: 25,
    task: 20,
    focus: 10,
    streak: 5,
  },
};

function StatFocusReportScreen() {
  const { mode } = useAppMode();
  const weights = MODE_WEIGHTS[mode] || MODE_WEIGHTS[APP_MODES.B];

  // 실제 값은 statApi, focusApi, routineApi 연동 필요 (현재 목업)
  const focusStats = {
    todaySessions: 3,
    todayMinutes: 120,
    weekMinutes: 540,
    longestSession: 90,
  };

  const routineStats = {
    weekRate: 82,
    monthRate: 78,
    activeRoutines: 6,
  };

  const godLife = {
    score: 88,
    rankPercent: 12,
    streakDays: 14,
    completedTasksWeek: 37,
  };

  return (
    <PageContainer
      screenId="STAT-004"
      title="포커스 & 갓생 리포트"
      subtitle="포커스 세션, 루틴, Task, 타임바 기반으로 갓생 점수를 계산합니다."
    >
      <div className="screen stat-focus-report-screen">
        <div className="stat-focus-grid">
          {/* 포커스/학습 섹션 */}
          <DashboardCard
            title="포커스 & 학습 통계"
            subtitle="집중 세션과 학습 시간을 요약합니다."
          >
            <div className="stat-dashboard-row">
              <StatValue
                label="오늘 포커스 세션"
                value={focusStats.todaySessions}
                unit="회"
              />
              <StatValue
                label="오늘 집중시간"
                value={focusStats.todayMinutes}
                unit="분"
              />
              <StatValue
                label="이번 주 누적 집중시간"
                value={Math.round(focusStats.weekMinutes / 60)}
                unit="h"
              />
              <StatValue
                label="최장 세션"
                value={focusStats.longestSession}
                unit="분"
              />
            </div>
            <p className="stat-dashboard-placeholder">
              카테고리별 집중시간(공부/업무 등) 막대/도넛 차트 영역입니다.
            </p>
          </DashboardCard>

          {/* 루틴/갓생 섹션 */}
          <DashboardCard
            title="루틴 & 갓생 지표"
            subtitle="루틴 달성률과 Task, 스트릭을 한 번에 봅니다."
          >
            <div className="stat-dashboard-row">
              <StatValue
                label="루틴 달성률(주간)"
                value={routineStats.weekRate}
                unit="%"
              />
              <StatValue
                label="루틴 달성률(월간)"
                value={routineStats.monthRate}
                unit="%"
              />
              <StatValue
                label="활성 루틴 수"
                value={routineStats.activeRoutines}
                unit="개"
              />
            </div>
            <div className="stat-dashboard-row">
              <StatValue
                label="갓생 점수"
                value={godLife.score}
                unit="/100"
                trend={{
                  direction: "up",
                  text: `상위 ${godLife.rankPercent}%`,
                }}
              />
              <StatValue
                label="연속 갓생일"
                value={godLife.streakDays}
                unit="일"
              />
              <StatValue
                label="이번 주 완료 Task"
                value={godLife.completedTasksWeek}
                unit="개"
              />
            </div>
          </DashboardCard>

          {/* 모드별 가중치 설명 섹션 */}
          <DashboardCard
            title="모드별 갓생 점수 가중치"
            subtitle={`현재 모드: ${weights.label}`}
          >
            <table className="godlife-weight-table">
              <thead>
                <tr>
                  <th>지표</th>
                  <th>가중치</th>
                  <th>설명</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Plan vs Actual</td>
                  <td>{weights.planActual}%</td>
                  <td>계획 대비 실제 사용시간/Task 달성률</td>
                </tr>
                <tr>
                  <td>루틴 달성률</td>
                  <td>{weights.routine}%</td>
                  <td>설정된 루틴의 기간별 달성률</td>
                </tr>
                <tr>
                  <td>Task 완료도</td>
                  <td>{weights.task}%</td>
                  <td>할 일 완료 비율, 특히 학습/프로젝트 Task</td>
                </tr>
                <tr>
                  <td>집중 시간</td>
                  <td>{weights.focus}%</td>
                  <td>포커스 세션 기반 집중시간</td>
                </tr>
                <tr>
                  <td>스트릭</td>
                  <td>{weights.streak}%</td>
                  <td>연속 일수/주차 기반 꾸준함</td>
                </tr>
              </tbody>
            </table>
            <p className="stat-dashboard-description">
              실제 점수 계산은 각 지표를 0~1로 정규화한 뒤, 위 가중치를 곱해 합산한
              값(0~100)을 사용합니다. 추후 실제 사용 데이터에 맞게 튜닝할 수 있습니다.
            </p>
          </DashboardCard>
        </div>
      </div>
    </PageContainer>
  );
}

export default StatFocusReportScreen;
