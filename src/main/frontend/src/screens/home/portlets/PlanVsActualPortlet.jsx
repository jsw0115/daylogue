import React from "react";

export default function PlanVsActualPortlet() {
  // MVP mock (나중에 /api/stats/dashboard 로 교체)
  const rows = [
    { label: "오늘", plan: 6, actual: 4, rate: 0.67 },
    { label: "이번 주", plan: 30, actual: 22, rate: 0.73 },
    { label: "이번 달", plan: 120, actual: 98, rate: 0.82 },
  ];

  return (
    <div className="pva">
      <table className="table">
        <thead>
          <tr>
            <th>구분</th>
            <th>계획</th>
            <th>실행</th>
            <th>진행률</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              <td>{r.plan}</td>
              <td>{r.actual}</td>
              <td>{Math.round(r.rate * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
