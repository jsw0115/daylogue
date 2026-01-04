import React, { useEffect, useMemo, useState } from "react";
import { Button, Space, Tag } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getEvents, seedIfEmpty } from "./eventMockStore";

function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfMonth(cursor) {
  const d = new Date(cursor);
  d.setDate(1);
  return d;
}

function addMonths(cursor, n) {
  const d = new Date(cursor);
  d.setMonth(d.getMonth() + n);
  d.setDate(1);
  return d;
}

export default function MonthCalendarPortlet() {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selectedKey, setSelectedKey] = useState(() => ymd(new Date()));
  const [ver, setVer] = useState(0);

  useEffect(() => {
    seedIfEmpty();
  }, []);

  const eventsByDate = useMemo(() => {
    const all = getEvents().filter((e) => !e.deletedAt);
    const map = {};
    for (const e of all) {
      map[e.dateKey] = map[e.dateKey] || [];
      map[e.dateKey].push(e);
    }
    return map;
  }, [ver]);

  const days = useMemo(() => {
    const first = startOfMonth(cursor);
    const startDay = first.getDay(); // 0 Sun
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - startDay);

    const arr = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [cursor]);

  const monthLabel = `${cursor.getFullYear()}.${String(cursor.getMonth() + 1).padStart(2, "0")}`;
  const curMonth = cursor.getMonth();

  const selectedEvents = (eventsByDate[selectedKey] || []).slice(0, 5);

  return (
    <div className="mcal">
      <div className="mcalHead">
        <Button size="small" icon={<ChevronLeft size={16} />} onClick={() => setCursor(addMonths(cursor, -1))} />
        <div className="mcalLabel">{monthLabel}</div>
        <Button size="small" icon={<ChevronRight size={16} />} onClick={() => setCursor(addMonths(cursor, 1))} />
      </div>

      <div className="mcalDow">
        {["일","월","화","수","목","금","토"].map((x) => (
          <div key={x} className="mcalDowItem">{x}</div>
        ))}
      </div>

      <div className="mcalGrid">
        {days.map((d) => {
          const key = ymd(d);
          const inMonth = d.getMonth() === curMonth;
          const cnt = (eventsByDate[key]?.length || 0);
          const isSel = key === selectedKey;
          const isToday = key === ymd(new Date());

          return (
            <button
              key={key}
              className={[
                "mcalCell",
                inMonth ? "" : "is-dim",
                isSel ? "is-sel" : "",
                isToday ? "is-today" : "",
              ].join(" ")}
              type="button"
              onClick={() => setSelectedKey(key)}
            >
              <div className="mcalDate">{d.getDate()}</div>
              {cnt ? <div className="mcalDot">{cnt}</div> : null}
            </button>
          );
        })}
      </div>

      <div className="mcalBottom">
        <div className="mcalPicked">
          선택: <b>{selectedKey}</b>
        </div>

        {selectedEvents.length === 0 ? (
          <div className="hd-empty">선택 날짜에 일정이 없습니다.</div>
        ) : (
          <div className="mcalList">
            {selectedEvents.map((e) => (
              <div className="mcalRow" key={e.id}>
                <Tag>{e.start}</Tag>
                <div className="mcalRowTitle">{e.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
