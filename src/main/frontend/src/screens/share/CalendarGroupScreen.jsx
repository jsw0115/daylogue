// src/main/frontend/src/screens/share/CalendarGroupScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/share.css";

function CalendarGroupScreen() {
  const groups = [
    { id: 1, name: "가족 캘린더", members: 4 },
    { id: 2, name: "스터디 그룹", members: 5 },
  ];

  return (
    <AppShell title="캘린더 그룹">
      <div className="screen share-group-screen">
        <header className="screen-header">
          <h2>캘린더 그룹 관리</h2>
          <button className="primary-button">+ 새 그룹</button>
        </header>

        <section className="share-group-list">
          {groups && groups.map((g) => (
            <div key={g.id} className="group-item">
              <div className="group-item__main">
                <strong>{g.name}</strong>
                <span className="group-item__members">
                  멤버 {g.members}명
                </span>
              </div>
              <div className="group-item__actions">
                <button className="ghost-button">멤버 관리</button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

export default CalendarGroupScreen;

