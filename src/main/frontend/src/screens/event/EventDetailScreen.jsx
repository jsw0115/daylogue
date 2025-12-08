// FILE: src/screens/event/EventDetailScreen.jsx
import React from "react";
import PageContainer from "../../layout/PageContainer";
import Button from "../../components/common/Button";
import Checkbox from "../../components/common/Checkbox";

/**
 * EVT-002-F01: 일정 상세 조회
 * EVT-007-F01: 일정 참석자 관리 (UI 뼈대)
 */

const MOCK_EVENT = {
  id: 1,
  title: "CS 공부 모임",
  date: "2025-12-06",
  time: "19:00 ~ 21:00",
  category: "공부",
  location: "온라인(Discord)",
  memo: "알고리즘 문제 풀이 및 코드 리뷰",
  visibility: "attendees",
  dday: "D-7",
  attendees: [
    { id: 1, name: "나", status: "accepted" },
    { id: 2, name: "친구 A", status: "pending" },
    { id: 3, name: "친구 B", status: "declined" },
  ],
};

function EventDetailScreen() {
  const event = MOCK_EVENT;

  const renderStatusLabel = (status) => {
    if (status === "accepted") return "참석";
    if (status === "pending") return "대기";
    if (status === "declined") return "불참";
    return status;
  };

  return (
    <PageContainer
      screenId="EVT-002"
      title="일정 상세"
      subtitle="시간, 장소, 참석자, 메모 등 일정을 자세히 확인합니다."
    >
      <div className="screen event-detail-screen">
        <section className="event-detail-main-card">
          <header className="event-detail-main-card__header">
            <div>
              <h1 className="event-detail-title">{event.title}</h1>
              <p className="event-detail-subtitle">
                {event.date} · {event.time} · {event.location}
              </p>
            </div>
            <div className="event-detail-actions">
              <Button type="button" variant="ghost" size="sm">
                수정
              </Button>
              <Button type="button" variant="ghost" size="sm">
                삭제
              </Button>
            </div>
          </header>

          <div className="event-detail-body">
            <dl className="event-detail-meta">
              <div>
                <dt>카테고리</dt>
                <dd>{event.category}</dd>
              </div>
              <div>
                <dt>D-Day</dt>
                <dd>{event.dday}</dd>
              </div>
              <div>
                <dt>공개 범위</dt>
                <dd>
                  {event.visibility === "public"
                    ? "모두"
                    : event.visibility === "attendees"
                    ? "참석자만"
                    : event.visibility === "busy"
                    ? "바쁨만"
                    : "나만"}
                </dd>
              </div>
            </dl>

            <section className="event-detail-section">
              <h2>메모</h2>
              <p className="event-detail-memo">{event.memo}</p>
            </section>
          </div>
        </section>

        <section className="event-attendee-card">
          <header className="event-attendee-card__header">
            <h2>참석자</h2>
            <Button type="button" size="sm" variant="ghost">
              참석자 초대
            </Button>
          </header>
          <ul className="event-attendee-list">
            {event.attendees.map((a) => (
              <li key={a.id} className="event-attendee-item">
                <span className="event-attendee-name">{a.name}</span>
                <span className="event-attendee-status">
                  {renderStatusLabel(a.status)}
                </span>
                <div className="event-attendee-actions">
                  <Checkbox label="참석" />
                  <Checkbox label="불참" />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageContainer>
  );
}

export default EventDetailScreen;
