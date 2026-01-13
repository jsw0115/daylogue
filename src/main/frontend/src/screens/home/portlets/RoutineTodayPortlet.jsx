import React, { useEffect, useMemo, useState } from "react";
import { Checkbox, Progress, Space, Tag, Typography } from "antd";
import { getTodayRoutines, seedRoutinesIfEmpty, toggleRoutineDoneToday } from "./routineMockStore";

const { Text } = Typography;

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function RoutineTodayPortlet() {
  const [ver, setVer] = useState(0);

  useEffect(() => {
    seedRoutinesIfEmpty();
  }, []);

  const rows = useMemo(() => {
    return getTodayRoutines(todayKey());
  }, [ver]);

  const total = rows.length;
  const done = rows.filter((r) => r.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const toggle = (routineId) => {
    toggleRoutineDoneToday(todayKey(), routineId);
    setVer((v) => v + 1);
  };

  return (
    <div>
      <div className="rtnHead">
        <Text type="secondary" style={{ fontSize: 12 }}>
          오늘 루틴: <b style={{ color: "#111827" }}>{done}</b> / {total}
        </Text>
        <Tag>{pct}%</Tag>
      </div>

      <Progress percent={pct} />

      {total === 0 ? (
        <div className="hd-empty">오늘 실행할 루틴이 없습니다.</div>
      ) : (
        <div className="rtnList">
          {rows.slice(0, 6).map((r) => (
            <div key={r.id} className="rtnRow">
              <div className="rtnTime">{r.time || "--:--"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="rtnName">{r.name}</div>
                <div className="rtnSub">{r.typeLabel}</div>
              </div>
              <Space size={6}>
                <Checkbox checked={!!r.done} onChange={() => toggle(r.id)} />
              </Space>
            </div>
          ))}
        </div>
      )}

      <Text type="secondary" style={{ fontSize: 12, marginTop: 10, display: "block" }}>
        실제 연동 시: /api/routines/today?date=YYYY-MM-DD (또는 계획 캘린더 기준)
      </Text>
    </div>
  );
}
