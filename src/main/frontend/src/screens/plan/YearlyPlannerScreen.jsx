import React, { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import moment from "moment";
import "../../styles/screens/yearly-planner.css";
import { getEventsForDate } from "../../shared/utils/plannerStore";

import PlannerViewTabs from "./_components/PlannerViewTabs";

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

  const months = useMemo(
    () => Array.from({ length: 12 }).map((_, i) => moment().year(year).month(i).date(1)),
    [year]
  );

  // “일정 있는 날짜 수” (가벼운 연간 인사이트)
  const monthStats = useMemo(() => {
    const map = {};
    for (const m of months) {
      const start = m.clone().startOf("month");
      const days = m.daysInMonth();
      let dayWithEvent = 0;
      for (let i = 0; i < days; i++) {
        const k = start.clone().add(i, "day").format("YYYY-MM-DD");
        if (getEventsForDate(k).length) dayWithEvent += 1;
      }
      map[m.month()] = dayWithEvent;
    }
    return map;
  }, [months]);

  return (
    <div className="yearly-planner-screen">
      <div className="screen-header">
        <div className="screen-header__title">연간 플래너</div>
        <PlannerViewTabs dateKey={dateKey} />
      </div>

      <div className="yearly-topbar">
        <div className="yearly-topbar__left">
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => setYear((y) => y - 1)}>←</button>
          <div className="yearly-topbar__label text-primary">{year}년</div>
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => setYear((y) => y + 1)}>→</button>
        </div>
        <div className="text-muted font-small">월을 클릭하면 월간 플래너로 이동합니다.</div>
      </div>

      <div className="yearly-grid">
        {months.map((m) => {
          const idx = m.month();
          const monthLabel = m.format("M월");
          const daysWithEvent = monthStats[idx] || 0;

          return (
            <button
              key={idx}
              type="button"
              className="yearly-card"
              onClick={() => nav(`/planner/monthly?date=${m.format("YYYY-MM-DD")}`)}
            >
              <div className="yearly-card__title">{monthLabel}</div>
              <div className="yearly-card__meta text-muted font-small">
                일정 있는 날짜: {daysWithEvent}일
              </div>
              <div className="yearly-card__cta">월간으로 보기 →</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
