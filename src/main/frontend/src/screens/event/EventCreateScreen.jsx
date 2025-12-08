// src/main/frontend/src/screens/event/EventCreateScreen.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  title: "",
  date: new Date().toISOString().slice(0, 10),
  startTime: "09:00",
  endTime: "10:00",
  groupId: "default",
  memo: "",
};

const mockGroups = [
  { id: "default", name: "기본" },
  { id: "work", name: "업무" },
  { id: "study", name: "공부" },
  { id: "health", name: "건강" },
];

const EventCreateScreen = () => {
  const [form, setForm] = useState(initialForm);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API 연동 (POST /api/events)
    console.log("일정 저장 요청:", form);
    alert("일정이 임시로 저장되었습니다. (추후 API 연동)");
    navigate("/home");
  };

  return (
    <div className="screen event-create-screen">
      <div className="screen-header">
        <div>
          <h1 className="screen-header__title">일정 등록</h1>
          <p className="text-muted font-small">
            하루/주간/월간 플래너에서 사용할 일정을 등록합니다.
          </p>
        </div>
      </div>

      <form className="card event-form-card" onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="form-label">일정 제목</label>
          <input
            type="text"
            name="title"
            className="form-input"
            value={form.title}
            onChange={handleChange}
            placeholder="예) SQLD 공부, 회의, 운동 등"
            required
          />
        </div>

        <div className="form-row form-row--inline">
          <div>
            <label className="form-label">날짜</label>
            <input
              type="date"
              name="date"
              className="form-input"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label">시작 시간</label>
            <input
              type="time"
              name="startTime"
              className="form-input"
              value={form.startTime}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="form-label">종료 시간</label>
            <input
              type="time"
              name="endTime"
              className="form-input"
              value={form.endTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">
            일정 그룹
            <button
              type="button"
              className="btn-link font-small ms-2"
              onClick={() => navigate("/event/group-settings")}
            >
              그룹 설정 관리
            </button>
          </label>
          <select
            name="groupId"
            className="form-input"
            value={form.groupId}
            onChange={handleChange}
          >
            {mockGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">메모</label>
          <textarea
            name="memo"
            className="form-textarea"
            rows={3}
            value={form.memo}
            onChange={handleChange}
            placeholder="일정에 대한 메모를 남겨주세요."
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button type="submit" className="btn btn--primary">
            일정 저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventCreateScreen;
