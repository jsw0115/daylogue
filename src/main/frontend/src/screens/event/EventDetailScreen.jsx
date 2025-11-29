// src/main/frontend/src/screens/event/EventDetailScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/event.css";

function EventDetailScreen() {
  const event = {
    title: "팀 회의",
    start: "2025-03-16 09:00",
    end: "2025-03-16 10:00",
    location: "회의실 A",
    categoryId: "work",
    visibility: "참석자만",
    attendees: ["나", "동료1", "동료2"],
    dday: "D-10",
  };

  return (
    <AppShell title="일정 상세">
      <div className="screen event-detail-screen">
        <header className="screen-header">
          <h2>{event.title}</h2>
        </header>

        <section className="event-detail-main">
          <div className="event-detail-row">
            <span className="event-detail-label">시간</span>
            <span className="event-detail-value">
              {event.start} ~ {event.end}
            </span>
          </div>
          <div className="event-detail-row">
            <span className="event-detail-label">장소</span>
            <span className="event-detail-value">{event.location}</span>
          </div>
          <div className="event-detail-row">
            <span className="event-detail-label">카테고리</span>
            <span className="event-detail-value">{event.categoryId}</span>
          </div>
          <div className="event-detail-row">
            <span className="event-detail-label">공개 범위</span>
            <span className="event-detail-value">{event.visibility}</span>
          </div>
          <div className="event-detail-row">
            <span className="event-detail-label">참석자</span>
            <span className="event-detail-value">
              {event.attendees.join(", ")}
            </span>
          </div>
          <div className="event-detail-row">
            <span className="event-detail-label">D-Day</span>
            <span className="event-detail-value">{event.dday}</span>
          </div>
        </section>

        <section className="event-detail-actions">
          <button className="primary-button">수정</button>
          <button className="ghost-button">삭제</button>
        </section>
      </div>
    </AppShell>
  );
}

export default EventDetailScreen;

