// src/main/frontend/src/screens/stat/StatFocusReportScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/stat.css";

function StatFocusReportScreen() {
  const sessions = [
    { date: "2025-03-10", count: 3, minutes: 75 },
    { date: "2025-03-11", count: 2, minutes: 50 },
    { date: "2025-03-12", count: 4, minutes: 100 },
  ];

  return (
    <AppShell title="포커스 리포트">
      <div className="screen stat-focus-report-screen">
        <header className="screen-header">
          <h2>포커스 / 갓생 리포트</h2>
        </header>

        <section className="stat-focus-summary">
          <p>이번 주 총 포커스 시간: 7시간 30분</p>
          <p>평균 세션 길이: 25분</p>
        </section>

        <section className="stat-focus-table-wrapper">
          <table className="stat-focus-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>세션 수</th>
                <th>집중 시간(분)</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.date}>
                  <td>{s.date}</td>
                  <td>{s.count}</td>
                  <td>{s.minutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AppShell>
  );
}

export default StatFocusReportScreen;

