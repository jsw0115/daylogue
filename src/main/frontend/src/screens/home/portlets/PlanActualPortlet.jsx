
// FILE: src/main/frontend/src/screens/portlets/PlanActualPortlet.jsx
import React, { useMemo } from "react";
import { safeStorage } from "../../../shared/utils/safeStorage";

function Bar({ value }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="bar">
      <div className="bar__fill" style={{ width: `${pct}%` }} />
      <div className="bar__label">{pct}%</div>
    </div>
  );
}

export default function PlanActualPortlet() {
  const data = useMemo(() => {
    return safeStorage.getJSON("planActual.mock", {
      today: { plan: 6, actual: 4 },
      week: { plan: 30, actual: 22 },
      month: { plan: 120, actual: 98 },
    });
  }, []);

  const rows = [
    { label: "오늘", ...data.today },
    { label: "이번 주", ...data.week },
    { label: "이번 달", ...data.month },
  ].map((r) => {
    const pct = r.plan > 0 ? Math.round((r.actual / r.plan) * 100) : 0;
    return { ...r, pct };
  });

  return (
    <div className="miniTable">
      <div className="miniTable__head">
        <div>구분</div><div>계획</div><div>실행</div><div>진행률</div>
      </div>
      {rows.map((r) => (
        <div key={r.label} className="miniTable__row">
          <div>{r.label}</div>
          <div>{r.plan}</div>
          <div>{r.actual}</div>
          <div><Bar value={r.pct} /></div>
        </div>
      ))}
    </div>
  );
}
