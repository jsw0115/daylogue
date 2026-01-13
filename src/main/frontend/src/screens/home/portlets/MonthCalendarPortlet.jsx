import React, { useEffect, useMemo, useState } from "react";
import { Button, Tag, Typography } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getEvents, seedIfEmpty } from "./eventMockStore";

const { Text } = Typography;

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

function toMin(hhmm) {
  const [h, m] = (hhmm || "00:00").split(":").map((x) => Number(x));
  return h * 60 + m;
}

export default function MonthCalendarPortlet() {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selectedKey, setSelectedKey] = useState(() => ymd(new Date()));
  const [ver] = useState(0);

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

  const selectedAll = useMemo(() => {
    const list = (eventsByDate[selectedKey] || []).slice();
    return list.sort((a, b) => toMin(a.start) - toMin(b.start));
  }, [eventsByDate, selectedKey]);

  const selectedTop5 = selectedAll.slice(0, 5);
  const selectedCount = selectedAll.length;

  return (
    <div className="mcal">
      <div className="mcalHead">
        <Button
          size="small"
          icon={<ChevronLeft size={16} />}
          onClick={() => setCursor(addMonths(cursor, -1))}
        />
        <div className="mcalLabel">{monthLabel}</div>
        <Button
          size="small"
          icon={<ChevronRight size={16} />}
          onClick={() => setCursor(addMonths(cursor, 1))}
        />
      </div>

      <div className="mcalWrap">
        {/* LEFT: calendar */}
        <div className="mcalLeft">
          <div className="mcalDow">
            {["일", "월", "화", "수", "목", "금", "토"].map((x) => (
              <div key={x} className="mcalDowItem">
                {x}
              </div>
            ))}
          </div>

          <div className="mcalGrid">
            {days.map((d) => {
              const key = ymd(d);
              const inMonth = d.getMonth() === curMonth;
              const cnt = eventsByDate[key]?.length || 0;
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
                  title={`${key} (${cnt}개)`}
                >
                  <div className="mcalDate">{d.getDate()}</div>
                  {cnt ? <div className="mcalDot">{cnt}</div> : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: list (max 5) */}
        <div className="mcalRight">
          <div className="mcalRightHead">
            <div className="mcalRightTitle">일정 목록</div>
            <Tag>{selectedCount}개</Tag>
          </div>

          <div className="mcalRightSub">
            선택: <b>{selectedKey}</b>
          </div>

          {selectedCount === 0 ? (
            <div className="mcalRightEmpty">선택 날짜에 일정이 없습니다.</div>
          ) : (
            <div className="mcalRightList">
              {selectedTop5.map((e) => (
                <div key={e.id} className="mcalRightRow">
                  <Tag className="mcalTimeTag">{e.start}</Tag>
                  <div className="mcalRightRowMain" title={e.title}>
                    <div className="mcalRightRowTitle">{e.title}</div>
                    <Text type="secondary" className="mcalRightRowMeta">
                      {e.category || "기타"}
                      {e.importance === "HIGH" ? " · 중요" : ""}
                      {e.isDday ? " · D-Day" : ""}
                    </Text>
                  </div>
                </div>
              ))}

              {selectedCount > 5 ? (
                <div className="mcalRightMore">외 {selectedCount - 5}개</div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
