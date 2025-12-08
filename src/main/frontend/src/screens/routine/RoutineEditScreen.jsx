// FILE: src/screens/routine/RoutineEditScreen.jsx
import React, { useState } from "react";
import PageContainer from "../../layout/PageContainer";
import TextInput from "../../components/common/TextInput";
import Select from "../../components/common/Select";
import Checkbox from "../../components/common/Checkbox";
import Button from "../../components/common/Button";
import { DEFAULT_CATEGORIES } from "../../shared/constants/categories";

/**
 * ROUT-002-F01: 루틴 생성/수정/삭제
 * ROUT-004-F01: 루틴 알림 설정
 */

const WEEK_DAYS = [
  { value: "mon", label: "월" },
  { value: "tue", label: "화" },
  { value: "wed", label: "수" },
  { value: "thu", label: "목" },
  { value: "fri", label: "금" },
  { value: "sat", label: "토" },
  { value: "sun", label: "일" },
];

function RoutineEditScreen() {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("✨");
  const [categoryId, setCategoryId] = useState("health");
  const [time, setTime] = useState("07:30");
  const [days, setDays] = useState(["mon", "tue", "wed", "thu", "fri"]);
  const [active, setActive] = useState(true);
  const [notify, setNotify] = useState(true);
  const [beforeMinutes, setBeforeMinutes] = useState("10m");

  const categoryOptions = DEFAULT_CATEGORIES.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const toggleDay = (value) => {
    setDays((prev) =>
      prev.includes(value)
        ? prev.filter((d) => d !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: ROUT-002-F01, ROUT-004-F01 API 연동
  };

  return (
    <PageContainer
      screenId="ROUT-002"
      title="루틴 등록 / 수정"
      subtitle="반복해서 실행하고 싶은 행동을 루틴으로 만들어 보세요."
    >
      <div className="screen routine-edit-screen">
        <form className="routine-edit-form" onSubmit={handleSubmit}>
          <section className="routine-edit-section">
            <h2 className="routine-edit-section__title">기본 정보</h2>
            <TextInput
              label="루틴 이름"
              placeholder="예: 아침 스트레칭, 자기 전 회고 일기"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />
            <div className="routine-edit-grid">
              <TextInput
                label="아이콘 / 이모지"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />
              <Select
                label="카테고리"
                value={categoryId}
                onChange={setCategoryId}
                options={categoryOptions}
              />
              <div className="field">
                <label className="field__label">시간</label>
                <input
                  type="time"
                  className="field__control"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="routine-edit-section">
            <h2 className="routine-edit-section__title">반복 요일</h2>
            <div className="weekday-pill-row">
              {WEEK_DAYS.map((day) => {
                const activeDay = days.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    className={
                      "weekday-pill" +
                      (activeDay ? " weekday-pill--active" : "")
                    }
                    onClick={() => toggleDay(day.value)}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="routine-edit-section">
            <h2 className="routine-edit-section__title">알림 / 활성 여부</h2>
            <div className="routine-edit-grid">
              <Checkbox
                label="루틴 활성화"
                checked={active}
                onChange={setActive}
              />
              <Checkbox
                label="알림 받기"
                checked={notify}
                onChange={setNotify}
              />
              {notify && (
                <Select
                  label="알림 시점"
                  value={beforeMinutes}
                  onChange={setBeforeMinutes}
                  options={[
                    { value: "0m", label: "정시" },
                    { value: "5m", label: "5분 전" },
                    { value: "10m", label: "10분 전" },
                    { value: "30m", label: "30분 전" },
                  ]}
                />
              )}
            </div>
          </section>

          <footer className="routine-edit-footer">
            <Button type="submit" variant="primary">
              저장
            </Button>
            <Button type="button" variant="ghost">
              삭제
            </Button>
          </footer>
        </form>
      </div>
    </PageContainer>
  );
}

export default RoutineEditScreen;
