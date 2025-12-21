// FILE: src/components/dashboard/portlets/PlanActualPortlet.jsx
import React from "react";

export default function PlanActualPortlet({ mockPlanVsActual }) {
  return (
    <>
      <p className="text-muted font-small mb-3">
        PLAN vs ACTUAL 기준으로 오늘·이번 주·이번 달 진행률을 확인할 수 있습니다.
      </p>

      <table className="plan-actual-table">
        <thead>
          <tr>
            <th>구분</th>
            <th>계획</th>
            <th>실행</th>
            <th>진행률</th>
          </tr>
        </thead>
        <tbody>
          {["daily", "weekly", "monthly"].map((key) => {
            const row = mockPlanVsActual[key];
            const progress =
              row.planned === 0 ? 0 : Math.round((row.done / row.planned) * 100);
            const label = key === "daily" ? "오늘" : key === "weekly" ? "이번 주" : "이번 달";

            return (
              <tr key={key}>
                <td>{label}</td>
                <td>{row.planned}</td>
                <td>{row.done}</td>
                <td>
                  <div className="plan-actual-progress">
                    <div
                      className="plan-actual-progress__bar"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                    <span className="plan-actual-progress__text">{progress}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
