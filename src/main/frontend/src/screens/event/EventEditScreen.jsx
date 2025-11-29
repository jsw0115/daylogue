// src/main/frontend/src/screens/event/EventEditScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import TextInput from "../../components/common/TextInput";
import DatePicker from "../../components/common/DatePicker";
import Select from "../../components/common/Select";
import "../../styles/screens/event.css";

function EventEditScreen() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("ATTENDEE");
  const [location, setLocation] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: eventApi.save(...)
    console.log("save event", {
      title,
      date,
      startTime,
      endTime,
      category,
      visibility,
      location,
    });
  };

  return (
    <AppShell title="일정 생성/수정">
      <div className="screen event-edit-screen">
        <header className="screen-header">
          <h2>일정 만들기</h2>
        </header>

        <form className="event-form" onSubmit={handleSave}>
          <TextInput label="제목"
            value={title}
            onChange={setTitle}
            placeholder="예: 팀 회의"
          />
          <DatePicker label="날짜" value={date} onChange={setDate} />
          <div className="event-form__row">
            <div className="field">
              <label className="field__label">시작 시간</label>
              <input type="time"
                className="field__control"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field__label">종료 시간</label>
              <input type="time"
                className="field__control"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <Select label="카테고리"
            value={category}
            onChange={setCategory}
            options={[
              { value: "work", label: "업무" },
              { value: "study", label: "공부" },
              { value: "health", label: "건강/운동" },
              { value: "friends", label: "친구/약속" },
            ]}
          />

          <TextInput label="장소"
            value={location}
            onChange={setLocation}
            placeholder="회의실 A, 카페 등"
          />

          <Select label="공개 범위"
            value={visibility}
            onChange={setVisibility}
            options={[
              { value: "ALL", label: "모두 보기" },
              { value: "ATTENDEE", label: "참석자만" },
              { value: "BUSY_ONLY", label: "바쁨만 표시" },
              { value: "PRIVATE", label: "나만 보기" },
            ]}
          />

          <div className="event-form__actions">
            <button className="primary-button" type="submit">
              저장
            </button>
            <button className="ghost-button" type="button">
              취소
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

export default EventEditScreen;

