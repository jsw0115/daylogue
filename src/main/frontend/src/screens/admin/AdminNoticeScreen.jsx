// src/main/frontend/src/screens/admin/AdminLogScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/admin.css";

function AdminLogScreen() {
  const mockLogs = [
    {
      id: 1,
      level: "ERROR",
      message: "TimeLog save failed",
      createdAt: "2025-03-16 10:21:00",
    },
    {
      id: 2,
      level: "INFO",
      message: "User login success",
      createdAt: "2025-03-16 09:05:32",
    },
  ];

  return (
    <AppShell title="관리자 - 로그 모니터링">
      <div className="screen admin-logs-screen">
        <header className="screen-header">
          <h2>로그 / 에러 모니터링</h2>
        </header>

        <section className="admin-log-filters">
          <select defaultValue="">
            <option value="">전체 레벨</option>
            <option value="ERROR">ERROR</option>
            <option value="WARN">WARN</option>
            <option value="INFO">INFO</option>
          </select>
          <input type="date" />
          <input className="admin-search-input"
            placeholder="메시지 키워드 검색"
          />
        </section>

        <section className="admin-log-list">
          <ul>
            {mockLogs.map((log) => (
              <li key={log.id} className={`admin-log admin-log--${log.level}`}>
                <div className="admin-log__meta">
                  <span className="admin-log__level">{log.level}</span>
                  <span className="admin-log__time">{log.createdAt}</span>
                </div>
                <div className="admin-log__message">{log.message}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}

export default AdminLogScreen;

