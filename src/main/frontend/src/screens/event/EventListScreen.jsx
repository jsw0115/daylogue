// FILE: src/screens/event/EventListScreen.jsx
import React, { useState } from "react";
import PageContainer from "../../layout/PageContainer";
import DatePicker from "../../components/common/DatePicker";
import Select from "../../components/common/Select";
import TextInput from "../../components/common/TextInput";
import Button from "../../components/common/Button";
import { DEFAULT_CATEGORIES } from "../../shared/constants/categories";

/**
 * EVT-001-F01: 일정 리스트 조회/검색
 */

const MOCK_EVENTS = [
  {
    id: 1,
    title: "CS 공부 모임",
    date: "2025-12-06",
    time: "19:00 ~ 21:00",
    categoryId: "study",
    visibility: "attendees",
    location: "온라인",
  },
  {
    id: 2,
    title: "프로젝트 주간 회의",
    date: "2025-12-07",
    time: "10:00 ~ 11:30",
    categoryId: "work",
    visibility: "busy",
    location: "회사 회의실 A",
  },
];

function EventListScreen() {
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("");

  const categoryOptions = DEFAULT_CATEGORIES.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  // 실제 구현 시에는 필터 값으로 API 호출
  const filtered = MOCK_EVENTS.filter((e) =>
    keyword ? e.title.toLowerCase().includes(keyword.toLowerCase()) : true
  );

  return (
    <PageContainer
      screenId="EVT-001"
      title="일정 리스트 / 검색"
      subtitle="기간, 카테고리, 공개 범위, 키워드로 일정을 조회합니다."
    >
      <div className="screen event-list-screen">
        <section className="filter-bar">
          <div className="filter-bar__row">
            <DatePicker
              label="시작일"
              value={startDate}
              onChange={setStartDate}
            />
            <DatePicker
              label="종료일"
              value={endDate}
              onChange={setEndDate}
            />
            <Select
              label="카테고리"
              value={category}
              onChange={setCategory}
              options={categoryOptions}
              placeholder="전체"
            />
            <Select
              label="공개 범위"
              value={visibility}
              onChange={setVisibility}
              options={[
                { value: "public", label: "모두" },
                { value: "attendees", label: "참석자만" },
                { value: "busy", label: "바쁨만" },
                { value: "private", label: "나만" },
              ]}
              placeholder="전체"
            />
          </div>
          <div className="filter-bar__row">
            <TextInput
              label="검색어"
              placeholder="제목, 메모, 장소 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              fullWidth
            />
            <Button type="button" variant="primary">
              검색
            </Button>
          </div>
        </section>

        <section className="event-list-card">
          <header className="event-list-card__header">
            <h2>검색 결과</h2>
            <Button type="button" variant="primary" size="sm">
              새 일정 만들기
            </Button>
          </header>

          {filtered.length === 0 ? (
            <p className="event-list-empty">
              조건에 맞는 일정이 없습니다. 필터를 조정해 보세요.
            </p>
          ) : (
            <ul className="event-list">
              {filtered.map((ev) => (
                <li key={ev.id} className="event-item">
                  <div className="event-item__main">
                    <div className="event-item__title-row">
                      <span className="event-item__title">{ev.title}</span>
                      <span className="event-item__badge">
                        {ev.categoryId}
                      </span>
                    </div>
                    <div className="event-item__meta">
                      <span>{ev.date}</span>
                      <span>{ev.time}</span>
                      <span>{ev.location}</span>
                    </div>
                  </div>
                  <div className="event-item__right">
                    <span className="event-item__visibility">
                      {ev.visibility === "public"
                        ? "모두 공개"
                        : ev.visibility === "attendees"
                        ? "참석자만"
                        : ev.visibility === "busy"
                        ? "바쁨만"
                        : "나만 보기"}
                    </span>
                    <Button type="button" size="sm" variant="ghost">
                      상세
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageContainer>
  );
}

export default EventListScreen;
