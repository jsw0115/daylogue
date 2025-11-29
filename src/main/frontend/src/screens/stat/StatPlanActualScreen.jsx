// src/main/frontend/src/screens/stat/StatPlanActualScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/stat.css";

function StatPlanActualScreen() {
  const rows = [
    { unit: "일간", plan: 6, actual: 5 },
    { unit: "주간", plan: 35, actual: 32 },
    { unit: "월간", plan: 140, actual: 120 },
  ];

  return (
    <AppShell title="Plan vs Actual">
      <div className="screen stat-plan-actual-screen">
        <header className="screen-header">
          <h2>계획 vs 실제 비교</h2>
        </header>

        <section className="stat-plan-table-wrapper">
          <table className="stat-plan-table">
            <thead>
              <tr>
                <th>단위</th>
                <th>계획 시간(h)</th>
                <th>실제 시간(h)</th>
                <th>달성률</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.unit}>
                  <td>{r.unit}</td>
                  <td>{r.plan}</td>
                  <td>{r.actual}</td>
                  <td>{Math.round((r.actual / r.plan) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AppShell>
  );
}

export default StatPlanActualScreen;

