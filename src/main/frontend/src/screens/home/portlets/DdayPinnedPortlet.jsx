import React, { useEffect, useMemo, useState } from "react";
import { Button, Space, Tag, Tooltip } from "antd";
import { Pin, PinOff } from "lucide-react";
import { getEvents, seedIfEmpty, toggleDdayPinned } from "./eventMockStore";

function daysLeft(dateKey) {
  // 단순 계산(데모): 날짜 기준 D-?
  const [y, m, d] = (dateKey || "").split("-").map((x) => Number(x));
  if (!y || !m || !d) return null;

  const target = new Date(y, m - 1, d);
  const today = new Date();
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.round((target.getTime() - t0.getTime()) / (24 * 60 * 60 * 1000));
  return diff;
}

export default function DdayPinnedPortlet() {
  const [ver, setVer] = useState(0);

  useEffect(() => {
    seedIfEmpty();
  }, []);

  const items = useMemo(() => {
    const all = getEvents().filter((e) => !e.deletedAt);
    const dday = all.filter((e) => e.isDday);
    const pinned = dday
      .sort((a, b) => {
        const pa = a.ddayPinned ? 0 : 1;
        const pb = b.ddayPinned ? 0 : 1;
        if (pa !== pb) return pa - pb;
        const da = daysLeft(a.dateKey);
        const db = daysLeft(b.dateKey);
        return (da ?? 999999) - (db ?? 999999);
      })
      .slice(0, 6);

    return pinned;
  }, [ver]);

  const togglePin = (id) => {
    toggleDdayPinned(id);
    setVer((v) => v + 1);
  };

  if (items.length === 0) {
    return <div className="hd-empty">D-Day로 지정된 일정이 없습니다.</div>;
  }

  return (
    <div className="ddayList">
      {items.map((e) => {
        const left = daysLeft(e.dateKey);
        const label =
          left === 0 ? "D-Day" : left > 0 ? `D-${left}` : `D+${Math.abs(left)}`;

        return (
          <div className="ddayRow" key={e.id}>
            <div className="ddayMain">
              <div className="ddayTitle">{e.title}</div>
              <div className="ddaySub">
                <Tag>{label}</Tag>
                <Tag>{e.dateKey}</Tag>
                <Tag>{e.category || "기타"}</Tag>
              </div>
            </div>

            <Space size={6}>
              <Tooltip title={e.ddayPinned ? "핀 해제" : "핀 고정"}>
                <Button
                  size="small"
                  type="text"
                  icon={e.ddayPinned ? <Pin size={16} /> : <PinOff size={16} />}
                  onClick={() => togglePin(e.id)}
                />
              </Tooltip>
            </Space>
          </div>
        );
      })}
    </div>
  );
}
