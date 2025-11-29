// src/main/frontend/src/screens/routine/RoutineEditScreen.jsx
import React, { useState } from "react";
import AppShell from "../../layout/AppShell";
import "../../styles/screens/routine.css";

function RoutineEditScreen() {
  const [name, setName] = useState("");
  const [time, setTime] = useState("06:30");
  const [days, setDays] = useState(["mon", "tue", "wed", "thu", "fri"]);

  const toggleDay = (day) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const dayOptions = [
    { key: "mon", label: "월" },
    { key: "tue", label: "화" },
    { key: "wed", label: "수" },
    { key: "thu", label: "목" },
    { key: "fri", label: "금" },
    { key: "sat", label: "토" },
    { key: "sun", label: "일" },
  ];

  return (
    <AppShell title="루틴 등록/수정">
      <div className="screen routine-edit-screen">
        <header className="screen-header">
          <h2>루틴 설정</h2>
        </header>

        <section className="routine-edit-main">
          <div className="field">
            <label className="field__label">루틴 이름</label>
            <input className="field__control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 아침 스트레칭"
            />
          </div>

          <div className="field">
            <label className="field__label">수행 시간</label>
            <input type="time"
              className="field__control"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label">수행 요일</label>
            <div className="routine-days">
              {dayOptions.map((d) => (
                <button key={d.key}
                  type="button"
                  className={
                    days.includes(d.key)
                      ? "routine-day routine-day--active"
                      : "routine-day"
                  }
                  onClick={() => toggleDay(d.key)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="routine-edit-actions">
          <button className="primary-button">저장</button>
          <button className="ghost-button">취소</button>
        </section>
      </div>
    </AppShell>
  );
}

export default RoutineEditScreen;

