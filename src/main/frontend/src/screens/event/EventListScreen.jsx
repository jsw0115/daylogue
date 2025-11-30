// src/main/frontend/src/screens/event/EventListScreen.jsx
import React from "react";
import AppShell from "../../layout/AppShell";
import DatePicker from "../../components/common/DatePicker";
import "../../styles/screens/event.css";

function EventListScreen() {
  const mockEvents = [
    {
      id: 1,
      title: "팀 회의",
      start: "2025-03-16 09:00",
      categoryId: "work",
      visibility: "참석자만",
    },
    {
      id: 2,
      title: "운동",
      start: "2025-03-16 19:00",
      categoryId: "health",
      visibility: "나만 보기",
    },
  ];

  return (
    <AppShell title="일정 목록">
      <div className="screen event-list-screen">
        <header className="screen-header">
          <h2>일정 리스트 / 검색</h2>
        </header>

        <section className="event-filters">
          <DatePicker label="시작일" />
          <DatePicker label="종료일" />
          <select defaultValue="">
            <option value="">카테고리 전체</option>
            <option value="work">업무</option>
            <option value="study">공부</option>
          </select>
          <input className="field__control" placeholder="제목/장소 검색" />
        </section>

        <section className="event-list">
          {mockEvents && mockEvents.map((e) => (
            <article key={e.id} className="event-card">
              <div className="event-card__time">{e.start}</div>
              <div className="event-card__title">{e.title}</div>
              <div className="event-card__meta">
                <span className={`chip chip--${e.categoryId}`}>
                  {e.categoryId.toUpperCase()}
                </span>
                <span className="event-card__visibility">{e.visibility}</span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

export default EventListScreen;

