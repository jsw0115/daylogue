// FILE: src/main/frontend/src/screens/plan/YearlyPlannerScreen.jsx
import React, { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import moment from "moment";
import "../../styles/screens/yearly-planner.css";
import "../../styles/screens/planner-view-modes.css";

import { safeStorage } from "../../shared/utils/safeStorage";
import { getEventsForDate } from "../../shared/utils/plannerStore";
import PlannerViewTabs from "./_components/PlannerViewTabs";
import PlannerModeTabs from "./_components/PlannerModeTabs";

moment.locale("ko");

export default function YearlyPlannerScreen() {
  const [sp] = useSearchParams();
  const nav = useNavigate();

  const baseDate = useMemo(() => {
    const q = sp.get("date");
    const m = q ? moment(q, "YYYY-MM-DD", true) : null;
    return m && m.isValid() ? m.toDate() : new Date();
  }, [sp]);

  const [year, setYear] = useState(moment(baseDate).year());
  const dateKey = useMemo(() => moment(baseDate).format("YYYY-MM-DD"), [baseDate]);

  // 보기 탭: card | list
  const [viewMode, setViewMode] = useState(() => safeStorage.getItem("planner.view.yearly", "card"));
  React.useEffect(() => {
    safeStorage.setItem("planner.view.yearly", viewMode);
  }, [viewMode]);

  const months = useMemo(() => Array.from({ length: 12 }).map((_, i) => moment().year(year).month(i).date(1)), [year]);

  const yearStats = useMemo(() => {
    const out = [];
    for (const m of months) {
      const start = m.clone().startOf("month");
      const days = m.daysInMonth();

      let daysWithEvent = 0;
      let totalEvents = 0;

      for (let i = 0; i < days; i++) {
        const k = start.clone().add(i, "day").format("YYYY-MM-DD");
        const list = getEventsForDate(k);
        if (list.length) daysWithEvent += 1;
        totalEvents += list.length;
      }

      out.push({
        monthIndex: m.month(),
        monthLabel: m.format("M월"),
        monthKey: m.format("YYYY-MM-DD"),
        daysWithEvent,
        totalEvents,
      });
    }
    return out;
  }, [months]);

  return (
    <div className="yearly-planner-screen">
      <div className="screen-header">
        <div className="screen-header__title">연간 플래너</div>
        <div className="screen-header__right">
          <PlannerModeTabs
            value={viewMode}
            options={[
              { key: "card", label: "카드" },
              { key: "list", label: "목록" },
            ]}
            onChange={setViewMode}
          />
          <PlannerViewTabs dateKey={dateKey} />
        </div>
      </div>

      <div className="yearly-topbar">
        <div className="yearly-topbar__left">
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => setYear((y) => y - 1)}>
            ←
          </button>
          <div className="yearly-topbar__label text-primary">{year}년</div>
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => setYear((y) => y + 1)}>
            →
          </button>
        </div>
        <div className="text-muted font-small">월을 클릭하면 월간 플래너로 이동합니다.</div>
      </div>

      {viewMode === "card" ? (
        <div className="yearly-grid">
          {yearStats.map((s) => (
            <button key={s.monthIndex} type="button" className="yearly-card" onClick={() => nav(`/planner/monthly?date=${s.monthKey}`)}>
              <div className="yearly-card__title">{s.monthLabel}</div>
              <div className="yearly-card__meta text-muted font-small">일정 있는 날짜: {s.daysWithEvent}일</div>
              <div className="yearly-card__meta text-muted font-small">총 일정: {s.totalEvents}개</div>
              <div className="yearly-card__cta">월간으로 보기 →</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="card yearly-listCard">
          <div className="yearly-listHead">
            <div style={{ fontWeight: 850 }}>{year}년 월별 요약</div>
            <div className="text-muted font-small">일정 있는 날짜 수 / 총 일정 수</div>
          </div>

          <div className="yearly-list">
            {yearStats.map((s) => (
              <button key={s.monthIndex} type="button" className="yearly-row" onClick={() => nav(`/planner/monthly?date=${s.monthKey}`)}>
                <div className="yearly-row__left">
                  <div className="yearly-row__month">{s.monthLabel}</div>
                  <div className="text-muted font-small">{moment(s.monthKey).format("YYYY.MM")}</div>
                </div>
                <div className="yearly-row__right">
                  <div className="yearly-chip">
                    <span className="label">일정 있는 날짜</span>
                    <span className="val">{s.daysWithEvent}일</span>
                  </div>
                  <div className="yearly-chip">
                    <span className="label">총 일정</span>
                    <span className="val">{s.totalEvents}개</span>
                  </div>
                  <div className="yearly-row__cta">→</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
