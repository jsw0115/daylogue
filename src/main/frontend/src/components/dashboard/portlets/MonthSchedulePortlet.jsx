import React, { useMemo, useState } from "react";
import Calendar from "react-calendar";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-calendar/dist/Calendar.css";
import "react-datepicker/dist/react-datepicker.css";

export default function MonthSchedulePortlet({
  eventsByDate,
  selectedDate,
  setSelectedDate,
  selectedEvents,

  onOpenEventList,
  onCreateEvent,
  onGoDailyPlanner,
  goToDailyPlanner,
}) {
  const selectedDateObj = useMemo(() => {
    const m = moment(selectedDate, "YYYY-MM-DD", true);
    return m.isValid() ? m.toDate() : new Date();
  }, [selectedDate]);

  const [activeStartDate, setActiveStartDate] = useState(() =>
    moment(selectedDateObj).startOf("month").toDate(),
  );

  const toKey = (date) => moment(date).format("YYYY-MM-DD");

  return (
    <div className="month-schedule-card">
      <div className="month-schedule-header">
        <div>
          <p className="text-muted font-small">
            일정이 있는 날짜에는 점으로 표시됩니다. 날짜를 클릭하면 해당 날짜의 일정
            목록이 표시됩니다.
          </p>
        </div>
        <button className="btn btn--ghost btn--sm" onClick={onOpenEventList}>
          일정 전체 보기
        </button>
      </div>

      <div className="month-schedule-grid">
        <div className="monthly-calendar">
          <div className="monthly-calendar__toolbar">
            <DatePicker
              selected={selectedDateObj}
              onChange={(d) => {
                if (!d) return;
                const key = toKey(d);
                setSelectedDate(key);
                setActiveStartDate(moment(d).startOf("month").toDate());
              }}
              dateFormat="yyyy-MM-dd"
              className="monthly-calendar__date-input"
            />
          </div>

          <Calendar
            locale="ko-KR"
            minDetail="month"
            maxDetail="month"
            showNeighboringMonth={false}
            value={selectedDateObj}
            activeStartDate={activeStartDate}
            onActiveStartDateChange={({ activeStartDate }) => {
              if (activeStartDate) setActiveStartDate(activeStartDate);
            }}
            onChange={(value) => {
              const d = Array.isArray(value) ? value[0] : value;
              if (!d) return;
              setSelectedDate(toKey(d));
            }}
            navigationLabel={({ date }) => moment(date).format("YYYY년 M월")}
            formatDay={(locale, date) => moment(date).format("D")}
            formatShortWeekday={(locale, date) =>
              ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
            }
            tileClassName={({ date, view }) => {
              if (view !== "month") return null;
              const key = toKey(date);
              const classes = [];
              if (eventsByDate[key]?.length) classes.push("has-events");
              if (key === selectedDate) classes.push("is-selected");
              if (date.getDay() === 0) classes.push("is-sun");
              if (date.getDay() === 6) classes.push("is-sat");
              return classes.length ? classes : null;
            }}
            tileContent={({ date, view }) => {
              if (view !== "month") return null;
              const key = toKey(date);
              if (!eventsByDate[key]?.length) return null;
              return <span className="calendar-day__dot" aria-hidden="true" />;
            }}
          />
        </div>

        <div className="daily-event-list">
          <div className="daily-event-list__header">
            <span className="font-small text-muted">선택 날짜: {selectedDate}</span>

            <div className="daily-event-list__actions">
              <button className="btn btn--sm btn--primary" onClick={onCreateEvent}>
                + 일정 추가
              </button>
              <button className="btn btn--sm btn--secondary" onClick={onGoDailyPlanner}>
                이 날짜 일간 플래너
              </button>
            </div>
          </div>

          {selectedEvents.length === 0 ? (
            <p className="text-muted font-small mt-2">선택한 날짜에 등록된 일정이 없습니다.</p>
          ) : (
            <ul className="daily-event-list__items">
              {selectedEvents.map((e) => (
                <li key={e.id}>
                  <div className="daily-event-title">{e.title}</div>
                  <div className="daily-event-meta font-small text-muted">그룹: {e.group}</div>
                  <div className="daily-event-actions">
                    <button
                      type="button"
                      className="btn btn--xs btn--ghost"
                      onClick={() => goToDailyPlanner(e.date)}
                    >
                      일간으로
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
