import React, { useMemo, useState } from "react";

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d, n) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function fmt(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function MonthCalendarPortlet() {
  const [base, setBase] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());

  const grid = useMemo(() => {
    const s = startOfMonth(base);
    const e = endOfMonth(base);
    const startWeekDay = s.getDay(); // 0 Sun
    const days = e.getDate();

    const cells = [];
    for (let i = 0; i < startWeekDay; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(new Date(base.getFullYear(), base.getMonth(), d));
    while (cells.length % 7 !== 0) cells.push(null);

    const rows = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [base]);

  // TODO: API 붙이면 이 값들을 서버에서 가져오면 됨
  const mockEvents = [
    { date: fmt(new Date()), title: "프로젝트 회의", time: "09:00" },
    { date: fmt(addMonths(new Date(), 0)), title: "운동", time: "19:00" },
  ];
  const selectedEvents = mockEvents.filter((e) => e.date === fmt(selected));

  return (
    <div className="month-cal">
      <div className="month-cal__top">
        <button className="btn xs" onClick={() => setBase(addMonths(base, -1))} type="button">←</button>
        <div className="month-cal__title">
          {base.getFullYear()}년 {base.getMonth() + 1}월
        </div>
        <button className="btn xs" onClick={() => setBase(addMonths(base, 1))} type="button">→</button>
      </div>

      <div className="month-cal__dow">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className="month-cal__dow-item">{d}</div>
        ))}
      </div>

      <div className="month-cal__grid">
        {grid.map((row, ri) => (
          <React.Fragment key={ri}>
            {row.map((cell, ci) => {
              const isSel = cell && fmt(cell) === fmt(selected);
              const isToday = cell && fmt(cell) === fmt(new Date());
              return (
                <button
                  key={`${ri}-${ci}`}
                  className={`month-cal__cell ${isSel ? "is-sel" : ""} ${isToday ? "is-today" : ""}`}
                  onClick={() => cell && setSelected(cell)}
                  type="button"
                >
                  {cell ? cell.getDate() : ""}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="month-cal__bottom">
        <div className="month-cal__picked">
          선택 날짜: <b>{fmt(selected)}</b>
        </div>
        {selectedEvents.length === 0 ? (
          <div className="muted">등록된 일정이 없습니다.</div>
        ) : (
          <div className="eventlist">
            {selectedEvents.map((e, idx) => (
              <div className="eventrow" key={idx}>
                <div className="eventrow__time">{e.time}</div>
                <div className="eventrow__title">{e.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
