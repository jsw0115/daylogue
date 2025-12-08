// FILE: src/screens/event/EventEditScreen.jsx
import React, { useState } from "react";
import PageContainer from "../../layout/PageContainer";
import TextInput from "../../components/common/TextInput";
import DatePicker from "../../components/common/DatePicker";
import Select from "../../components/common/Select";
import Checkbox from "../../components/common/Checkbox";
import Button from "../../components/common/Button";
import { DEFAULT_CATEGORIES } from "../../shared/constants/categories";

/**
 * EVT-003-F01: 일정 생성/수정/삭제 (폼)
 * EVT-003-F02: 카테고리 템플릿
 * EVT-003-F03: 공개 범위 설정
 * EVT-003-F04: D-Day 설정
 * EVT-005-F01: 반복 설정
 * EVT-006-F01: 일정 알림 설정
 */

const CATEGORY_TEMPLATES = [
  { value: "default", label: "기본" },
  { value: "work", label: "업무 회의" },
  { value: "friends", label: "친구 약속" },
  { value: "study", label: "공부/시험" },
  { value: "family", label: "가족 일정" },
];

function EventEditScreen() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("19:00");
  const [endTime, setEndTime] = useState("21:00");
  const [template, setTemplate] = useState("default");
  const [category, setCategory] = useState("study");
  const [visibility, setVisibility] = useState("attendees");
  const [repeatRule, setRepeatRule] = useState("none");
  const [dday, setDday] = useState(false);
  const [alarm, setAlarm] = useState("30m");

  const categoryOptions = DEFAULT_CATEGORIES.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: EVT-003-F01~F04, EVT-005-F01, EVT-006-F01 API 연동
  };

  return (
    <PageContainer
      screenId="EVT-003"
      title="일정 생성 / 수정"
      subtitle="시간, 장소, 카테고리, D-Day, 반복, 알림을 한 화면에서 설정합니다."
    >
      <div className="screen event-edit-screen">
        <form className="event-edit-form" onSubmit={handleSubmit}>
          <section className="event-edit-section">
            <h2 className="event-edit-section__title">기본 정보</h2>
            <div className="event-edit-grid">
              <TextInput
                label="제목"
                placeholder="일정 제목을 입력하세요"
                fullWidth
                required
              />
              <TextInput
                label="장소"
                placeholder="온라인, 카페, 회의실 등"
                fullWidth
              />
            </div>

            <div className="event-edit-grid">
              <DatePicker
                label="날짜"
                value={date}
                onChange={setDate}
                required
              />
              <div className="field">
                <label className="field__label">시간</label>
                <div className="time-range-input">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="field__control"
                  />
                  <span className="time-range-separator">~</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="field__control"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="event-edit-section">
            <h2 className="event-edit-section__title">
              카테고리 / 템플릿 / 공개 범위
            </h2>
            <div className="event-edit-grid">
              <Select
                label="카테고리 템플릿"
                value={template}
                onChange={setTemplate}
                options={CATEGORY_TEMPLATES}
              />
              <Select
                label="카테고리"
                value={category}
                onChange={setCategory}
                options={categoryOptions}
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
              />
            </div>
          </section>

          <section className="event-edit-section">
            <h2 className="event-edit-section__title">
              D-Day / 반복 / 알림 설정
            </h2>
            <div className="event-edit-grid">
              <Checkbox
                label="이 일정을 D-Day로 관리하기"
                checked={dday}
                onChange={setDday}
              />
              <Select
                label="반복"
                value={repeatRule}
                onChange={setRepeatRule}
                options={[
                  { value: "none", label: "반복 없음" },
                  { value: "daily", label: "매일" },
                  { value: "weekly", label: "매주" },
                  { value: "monthly", label: "매월" },
                  { value: "yearly", label: "매년" },
                ]}
              />
              <Select
                label="알림"
                value={alarm}
                onChange={setAlarm}
                options={[
                  { value: "none", label: "알림 없음" },
                  { value: "10m", label: "10분 전" },
                  { value: "30m", label: "30분 전" },
                  { value: "1h", label: "1시간 전" },
                  { value: "1d", label: "1일 전" },
                ]}
              />
            </div>
          </section>

          <section className="event-edit-section">
            <h2 className="event-edit-section__title">메모</h2>
            <label className="field">
              <span className="field__label">메모</span>
              <textarea
                className="field__control"
                rows={4}
                placeholder="일정에 대한 메모를 자유롭게 남겨 주세요."
              />
            </label>
          </section>

          <footer className="event-edit-footer">
            <Button type="submit" variant="primary">
              일정 저장
            </Button>
            <Button type="button" variant="ghost">
              취소
            </Button>
          </footer>
        </form>
      </div>
    </PageContainer>
  );
}

export default EventEditScreen;
