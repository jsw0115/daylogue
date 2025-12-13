import React, { useMemo, useState } from "react";
import "../../styles/screens/statDashboard.css";
import { safeStorage } from "../../shared/utils/safeStorage";

function KPI({ label, value, sub }) {
  return (
    <div className="kpi">
      <div className="kpi__label">{label}</div>
      <div className="kpi__value">{value}</div>
      {sub ? <div className="kpi__sub">{sub}</div> : null}
    </div>
  );
}

export default function StatDashboardScreen() {
  const [tab, setTab] = useState("overview"); // overview | focus | routine | task

  const mock = useMemo(() => {
    return safeStorage.getJSON("stats.mock", {
      planRate: 85,
      actionRate: 60,
      diaryRate: 95,
      focusMinWeek: 320,
      routineStreak: 7,
      taskDoneWeek: 18,
    });
  }, []);

  return (
    <div className="screen statDash">
      <div className="screen-header">
        <div>
          <h1 className="screen-header__title">통합 통계 대시보드</h1>
          <p className="text-muted font-small">전반적인 활동 분석</p>
        </div>

        <div className="segTabs">
          <button type="button" className={"segTab " + (tab === "overview" ? "is-active" : "")} onClick={() => setTab("overview")}>개요</button>
          <button type="button" className={"segTab " + (tab === "focus" ? "is-active" : "")} onClick={() => setTab("focus")}>포커스</button>
          <button type="button" className={"segTab " + (tab === "routine" ? "is-active" : "")} onClick={() => setTab("routine")}>루틴</button>
          <button type="button" className={"segTab " + (tab === "task" ? "is-active" : "")} onClick={() => setTab("task")}>할 일</button>
        </div>
      </div>

      {tab === "overview" ? (
        <>
          <div className="kpiRow">
            <KPI label="PLAN 달성률" value={`${mock.planRate}%`} sub="기간: 최근 7일" />
            <KPI label="ACTION 완료율" value={`${mock.actionRate}%`} sub="기간: 최근 7일" />
            <KPI label="DIARY 작성율" value={`${mock.diaryRate}%`} sub="기간: 최근 7일" />
          </div>

          <div className="card">
            <div className="card__title">주간 시간 사용 분포</div>
            <div className="text-muted font-small">
              TODO: /api/stats/category, /api/stats/plan-actual 연동
            </div>
          </div>
        </>
      ) : null}

      {tab === "focus" ? (
        <div className="card">
          <div className="card__title">포커스 리포트</div>
          <div className="kpiRow">
            <KPI label="이번 주 집중 시간" value={`${mock.focusMinWeek}분`} sub="포모도로/세션 합산" />
            <KPI label="가장 많이 집중한 요일" value="수요일" sub="TODO: API" />
            <KPI label="세션 완료율" value="72%" sub="TODO: API" />
          </div>
          <div className="text-muted font-small">TODO: /api/stats/focus</div>
        </div>
      ) : null}

      {tab === "routine" ? (
        <div className="card">
          <div className="card__title">루틴</div>
          <div className="kpiRow">
            <KPI label="연속 스트릭" value={`${mock.routineStreak}일`} sub="최대/현재/이번주" />
            <KPI label="완료율" value="68%" sub="TODO: API" />
            <KPI label="상위 루틴" value="Morning Stretch" sub="TODO: API" />
          </div>
          <div className="text-muted font-small">TODO: /api/stats/routine</div>
        </div>
      ) : null}

      {tab === "task" ? (
        <div className="card">
          <div className="card__title">할 일</div>
          <div className="kpiRow">
            <KPI label="이번 주 완료" value={`${mock.taskDoneWeek}개`} sub="완료/생성 추이" />
            <KPI label="미뤄짐" value="3개" sub="TODO: API" />
            <KPI label="평균 소요" value="32분" sub="TODO: API" />
          </div>
          <div className="text-muted font-small">TODO: /api/stats/tasks</div>
        </div>
      ) : null}
    </div>
  );
}
