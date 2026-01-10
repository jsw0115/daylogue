// FILE: src/screens/routine/RoutineEditScreen.jsx
import React, { useMemo, useState } from "react";
import PageContainer from "../../layout/PageContainer";
import TextInput from "../../components/common/TextInput";
import Select from "../../components/common/Select";
import Checkbox from "../../components/common/Checkbox";
import Button from "../../components/common/Button";
import { DEFAULT_CATEGORIES } from "../../shared/constants/categories";

/**
 * ROUT-002-F01: 루틴 생성/수정/삭제
 * ROUT-004-F01: 루틴 알림 설정
 * (추가) ROUT-007~012: 고급 반복/Anytime/목표 타입/다중 알림/일시중지/타임바 연동 정책(로컬 UI)
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

const SCHEDULE_OPTIONS = [
  { value: "daily", label: "매일" },
  { value: "weekly", label: "요일 선택" },
  { value: "interval", label: "N일마다" },
  { value: "anytime", label: "언제든" },
];

const GOAL_TYPE_OPTIONS = [
  { value: "check", label: "체크(1회)" },
  { value: "count", label: "횟수 목표" },
  { value: "minutes", label: "시간(분) 목표" },
];

const REMINDER_OPTIONS = [
  { value: "0m", label: "정시" },
  { value: "5m", label: "5분 전" },
  { value: "10m", label: "10분 전" },
  { value: "30m", label: "30분 전" },
];

function RoutineEditScreen() {
  // 기본 정보
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("✨");
  const [categoryId, setCategoryId] = useState((DEFAULT_CATEGORIES?.[0]?.id) || "health");

  // 스케줄
  const [scheduleType, setScheduleType] = useState("weekly"); // daily | weekly | interval | anytime
  const [time, setTime] = useState("07:30");
  const [days, setDays] = useState(["mon", "tue", "wed", "thu", "fri"]);
  const [intervalDays, setIntervalDays] = useState(2);

  // 목표
  const [goalType, setGoalType] = useState("check"); // check | count | minutes
  const [goalValue, setGoalValue] = useState(1);

  // 상태/알림/중지
  const [active, setActive] = useState(true);
  const [pauseUntil, setPauseUntil] = useState("");
  const [notify, setNotify] = useState(true);
  const [reminders, setReminders] = useState(["10m"]);

  // 타임바 연동 정책(로컬 UI)
  const [createTimebarOnDone, setCreateTimebarOnDone] = useState(true);
  const [rollbackOnUncheck, setRollbackOnUncheck] = useState(false);
  const [conflictPolicy, setConflictPolicy] = useState("warn"); // warn | allow | merge (UI만)

  const categoryOptions = useMemo(() => {
    const list = Array.isArray(DEFAULT_CATEGORIES) ? DEFAULT_CATEGORIES : [];
    return list.map((c) => ({ value: c.id, label: c.name }));
  }, []);

  const toggleDay = (value) => {
    setDays((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };

  const toggleReminder = (value) => {
    setReminders((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
  };

  const canSubmit = useMemo(() => {
    if (!name.trim()) return false;

    if (scheduleType !== "anytime" && !String(time || "").trim()) return false;
    if (scheduleType === "weekly" && (!Array.isArray(days) || days.length === 0)) return false;
    if (scheduleType === "interval") {
      const n = Number(intervalDays);
      if (!Number.isFinite(n) || n <= 0) return false;
    }

    if (goalType === "count" || goalType === "minutes") {
      const v = Number(goalValue);
      if (!Number.isFinite(v) || v <= 0) return false;
    }

    return true;
  }, [name, scheduleType, time, days, intervalDays, goalType, goalValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const payload = {
      name: name.trim(),
      icon,
      categoryId,

      scheduleType,
      time: scheduleType === "anytime" ? "" : time,
      days: scheduleType === "weekly" ? days : WEEK_DAYS.map((d) => d.value),
      intervalDays: scheduleType === "interval" ? Number(intervalDays) : null,

      goalType,
      goalValue: goalType === "check" ? 1 : Number(goalValue),

      active,
      pauseUntil: pauseUntil || "",
      notify,
      reminders: notify ? reminders : [],

      timebarLink: {
        enabled: !!createTimebarOnDone,
        rollbackOnUncheck: !!rollbackOnUncheck,
        conflictPolicy,
      },
    };

    // TODO: ROUT-002-F01, ROUT-004-F01 API 연동
    console.log("save routine payload", payload);
  };

  const handleDelete = () => {
    const ok = window.confirm("이 루틴을 삭제할까요?");
    if (!ok) return;
    // TODO: ROUT-002-F01 삭제 API 연동
    console.log("delete routine");
  };

  return (
    <PageContainer
      screenId="ROUT-002"
      title="루틴 등록 / 수정"
      subtitle="반복, 목표, 알림, 일시중지까지 포함한 루틴 설정을 구성합니다."
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
                label="아이콘"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />
              <Select
                label="카테고리"
                value={categoryId}
                onChange={setCategoryId}
                options={categoryOptions}
              />
            </div>
          </section>

          <section className="routine-edit-section">
            <h2 className="routine-edit-section__title">반복 규칙</h2>

            <div className="routine-edit-grid">
              <Select
                label="반복 유형"
                value={scheduleType}
                onChange={setScheduleType}
                options={SCHEDULE_OPTIONS}
              />

              <div className="field">
                <label className="field__label">대표 시간</label>
                <input
                  type="time"
                  className="field__control"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={scheduleType === "anytime"}
                />
                {scheduleType === "anytime" ? (
                  <div className="text-muted font-small" style={{ marginTop: 6 }}>
                    “언제든” 루틴은 시간 없이 체크/기록합니다.
                  </div>
                ) : null}
              </div>

              {scheduleType === "interval" ? (
                <div className="field">
                  <label className="field__label">간격(일)</label>
                  <input
                    type="number"
                    min="1"
                    className="field__control"
                    value={intervalDays}
                    onChange={(e) => setIntervalDays(e.target.value)}
                  />
                </div>
              ) : null}
            </div>

            {scheduleType === "weekly" ? (
              <div className="weekday-pill-row">
                {WEEK_DAYS.map((day) => {
                  const activeDay = days.includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      className={
                        "weekday-pill" + (activeDay ? " weekday-pill--active" : "")
                      }
                      onClick={() => toggleDay(day.value)}
                      aria-pressed={activeDay}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </section>

          <section className="routine-edit-section">
            <h2 className="routine-edit-section__title">목표</h2>
            <div className="routine-edit-grid">
              <Select
                label="목표 타입"
                value={goalType}
                onChange={(v) => {
                  setGoalType(v);
                  if (v === "check") setGoalValue(1);
                }}
                options={GOAL_TYPE_OPTIONS}
              />
              <div className="field">
                <label className="field__label">목표 값</label>
                <input
                  type="number"
                  min="1"
                  className="field__control"
                  value={goalValue}
                  onChange={(e) => setGoalValue(e.target.value)}
                  disabled={goalType === "check"}
                  placeholder={goalType === "count" ? "예) 3" : "예) 20"}
                />
                <div className="text-muted font-small" style={{ marginTop: 6 }}>
                  체크형은 1회 완료, 횟수/분 목표는 히스토리에서 목표 대비 달성률 계산에 사용됩니다.
                </div>
              </div>
            </div>
          </section>

          <section className="routine-edit-section">
            <h2 className="routine-edit-section__title">알림 / 활성 / 일시중지</h2>
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
              <div className="field">
                <label className="field__label">중지(~날짜, 선택)</label>
                <input
                  type="date"
                  className="field__control"
                  value={pauseUntil}
                  onChange={(e) => setPauseUntil(e.target.value)}
                />
                <div className="text-muted font-small" style={{ marginTop: 6 }}>
                  값이 있으면 목록에서 “중지(~날짜)”로 표시되도록 설계했습니다. (정책 확정은 API 단계)
                </div>
              </div>
            </div>

            {notify ? (
              <div className="field" style={{ marginTop: 10 }}>
                <label className="field__label">알림 시점(다중 선택)</label>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {REMINDER_OPTIONS.map((o) => {
                    const checked = reminders.includes(o.value);
                    return (
                      <label key={o.value} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleReminder(o.value)}
                        />
                        <span>{o.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </section>

          <section className="routine-edit-section">
            <h2 className="routine-edit-section__title">루틴 → 타임바 연동(정책)</h2>
            <div className="routine-edit-grid">
              <Checkbox
                label="완료 체크 시 Actual 타임블록 자동 생성"
                checked={createTimebarOnDone}
                onChange={setCreateTimebarOnDone}
              />
              <Checkbox
                label="체크 해제 시 자동 생성 블록 롤백(삭제)"
                checked={rollbackOnUncheck}
                onChange={setRollbackOnUncheck}
              />
              <Select
                label="블록 충돌 처리"
                value={conflictPolicy}
                onChange={setConflictPolicy}
                options={[
                  { value: "warn", label: "겹침 경고" },
                  { value: "allow", label: "겹침 허용" },
                  { value: "merge", label: "합치기(추후)" },
                ]}
              />
            </div>
            <div className="text-muted font-small" style={{ marginTop: 6 }}>
              실제 생성 로직은 PLAN-001/통계와 연결되므로, API/스토어 연동 시점에 확정하면 됩니다.
            </div>
          </section>

          <footer className="routine-edit-footer">
            <Button type="submit" variant="primary" disabled={!canSubmit} aria-disabled={!canSubmit}>
              저장
            </Button>
            <Button type="button" variant="ghost" onClick={handleDelete}>
              삭제
            </Button>
          </footer>
        </form>
      </div>
    </PageContainer>
  );
}

export default RoutineEditScreen;
