import React, { useMemo, useState } from "react";
import { safeStorage } from "../../../shared/utils/safeStorage";

function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function MonthlyCalendarPortlet() {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const eventsByDate = useMemo(() => {
    const all = safeStorage.getJSON("events.mock", []);
    const map = {};
    for (const e of all) {
      const k = e.date;
      map[k] = map[k] || [];
      map[k].push(e);
    }
    return map;
  }, []);

  const days = useMemo(() => {
    const first = new Date(cursor);
    const start = new Date(first);
    start.setDate(1);

    const startDay = start.getDay(); // 0 Sun
    const gridStart = new Date(start);
    gridStart.setDate(start.getDate() - startDay);

    const arr = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [cursor]);

  const monthLabel = `${cursor.getFullYear()}.${String(cursor.getMonth() + 1).padStart(2, "0")}`;

  const prev = () => {
    const d = new Date(cursor);
    d.setMonth(d.getMonth() - 1);
    setCursor(d);
  };
  const next = () => {
    const d = new Date(cursor);
    d.setMonth(d.getMonth() + 1);
    setCursor(d);
  };

  const curMonth = cursor.getMonth();

  return (
    <div className="monthCal">
      <div className="monthCal__head">
        <button className="btn btn--xs" type="button" onClick={prev}>←</button>
        <div className="monthCal__label">{monthLabel}</div>
        <button className="btn btn--xs" type="button" onClick={next}>→</button>
      </div>

      <div className="monthCal__dow">
        {["일","월","화","수","목","금","토"].map((x) => (
          <div key={x} className="monthCal__dowItem">{x}</div>
        ))}
      </div>

      <div className="monthCal__grid">
        {days.map((d) => {
          const key = ymd(d);
          const inMonth = d.getMonth() === curMonth;
          const cnt = eventsByDate[key]?.length || 0;

          return (
            <div key={key} className={"monthCal__cell " + (inMonth ? "" : "is-dim")}>
              <div className="monthCal__date">{d.getDate()}</div>
              {cnt ? <div className="monthCal__dot">{cnt}</div> : null}
            </div>
          );
        })}
      </div>

      <div className="text-muted font-small" style={{ marginTop: 8 }}>
        일정 데이터는 현재 임시 저장소(events.mock) 기반입니다.
      </div>
    </div>
  );
}
