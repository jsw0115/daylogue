import React, { useEffect, useMemo, useState } from "react";
import { Input, Space, Tag } from "antd";
import { CalendarDays, Search } from "lucide-react";
import { getEvents, seedIfEmpty } from "./eventMockStore";

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function dateKeyOf(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toMin(hhmm) {
  const [h, m] = (hhmm || "00:00").split(":").map((x) => Number(x));
  return h * 60 + m;
}

export default function UpcomingEvents7dPortlet() {
  const [q, setQ] = useState("");
  const [ver, setVer] = useState(0);

  useEffect(() => {
    seedIfEmpty();
  }, []);

  const rows = useMemo(() => {
    const all = getEvents().filter((e) => !e.deletedAt);
    const from = new Date();
    const to = addDays(from, 6);

    const fromKey = dateKeyOf(from);
    const toKey = dateKeyOf(to);

    let list = all.filter((e) => e.dateKey >= fromKey && e.dateKey <= toKey);

    if (q.trim()) {
      const qq = q.trim().toLowerCase();
      list = list.filter((e) => {
        const title = (e.title || "").toLowerCase();
        const cat = (e.category || "").toLowerCase();
        return title.includes(qq) || cat.includes(qq);
      });
    }

    return list
      .sort((a, b) => (a.dateKey === b.dateKey ? toMin(a.start) - toMin(b.start) : a.dateKey.localeCompare(b.dateKey)))
      .slice(0, 12);
  }, [q, ver]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="검색(제목/카테고리)"
          size="small"
          prefix={<Search size={16} />}
        />
      </div>

      {rows.length === 0 ? (
        <div className="hd-empty">7일 내 일정이 없습니다.</div>
      ) : (
        <div className="up7">
          {rows.map((e) => (
            <div className="up7Row" key={e.id}>
              <div className="up7Date">
                <CalendarDays size={14} /> {e.dateKey}
              </div>
              <div className="up7Main">
                <div className="up7Title">
                  {e.start} {e.title}
                </div>
                <Space size={6} wrap>
                  <Tag>{e.category || "기타"}</Tag>
                  {e.importance === "HIGH" ? <Tag color="red">중요</Tag> : <Tag>보통</Tag>}
                  {e.isDday ? <Tag>D-Day</Tag> : null}
                  {e.isBookmarked ? <Tag>북마크</Tag> : null}
                </Space>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
