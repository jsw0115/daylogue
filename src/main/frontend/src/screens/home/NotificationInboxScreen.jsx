// src/main/frontend/src/screens/home/NotificationInboxScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/home.css";

function NotificationInboxScreen() {
  const mockNoti = [
    { id: 1, type: "invite", text: "친구가 일정에 초대했습니다.", read: false },
    { id: 2, type: "reminder", text: "20:00 공부 루틴 시간이에요.", read: true },
  ];

  return (
    <AppShell title="알림 인박스">
      <div className="screen noti-inbox-screen">
        <header className="screen-header">
          <h2>알림 / 인박스</h2>
        </header>

        <section className="noti-list">
          {mockNoti.map((n) => (
            <div key={n.id}
              className={
                n.read ? "noti-item noti-item--read" : "noti-item noti-item--new"
              }
            >
              <div className="noti-item__type">{n.type}</div>
              <div className="noti-item__text">{n.text}</div>
              <div className="noti-item__actions">
                {n.type === "invite" && (
                  <>
                    <button className="primary-button">수락</button>
                    <button className="ghost-button">거절</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

export default NotificationInboxScreen;

