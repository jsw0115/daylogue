import React, { useMemo, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import Calendar from "react-calendar";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";
import "../../styles/screens/monthly-planner.css";

import { getEventsForDate, toDateKey } from "../../shared/utils/plannerStore";
import ScheduleFormModal from "../../components/schedule/ScheduleFormModal";

import PlannerViewTabs from "./_components/PlannerViewTabs";
import EventQueryBar from "./_components/EventQueryBar";
import EventList from "./_components/EventList";
import { applyEventQuery } from "./plannerUiUtils";

moment.locale("ko");
moment.updateLocale("ko", { week: { dow: 0, doy: 1 } });

export default function MonthlyPlannerScreen() {
  const nav = useNavigate();
  const [sp] = useSearchParams();

  const initialDate = useMemo(() => {
    const q = sp.get("date");
    const m = q ? moment(q, "YYYY-MM-DD", true) : null;
    return m && m.isValid() ? m.toDate() : new Date();
  }, [sp]);

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const dateKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);

  const rawSelectedEvents = useMemo(() => getEventsForDate(dateKey), [dateKey]);

  // EVT-001: 검색/필터/정렬
  const [eventQuery, setEventQuery] = useState(() => ({
    keyword: "",
    sortKey: "priority",
    categoryId: "all",
    visibility: "all",
    onlyDday: false,
    onlyBookmarked: false,
    onlyShared: false,
  }));

  const selectedEvents = useMemo(
    () => applyEventQuery(rawSelectedEvents, eventQuery, dateKey),
    [rawSelectedEvents, eventQuery, dateKey]
  );

  const eventCountByDate = useMemo(() => {
    const m = moment(selectedDate);
    const start = m.clone().startOf("month");
    const days = m.daysInMonth();
    const map = {};
    for (let i = 0; i < days; i++) {
      const key = start.clone().add(i, "day").format("YYYY-MM-DD");
      const cnt = getEventsForDate(key).length;
      if (cnt) map[key] = cnt;
    }
    return map;
  }, [selectedDate]);

  const goToday = () => setSelectedDate(new Date());
  const moveMonth = (delta) => setSelectedDate(moment(selectedDate).add(delta, "month").toDate());

  // 모달
  const [openQuick, setOpenQuick] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState(null);

  const openEditModal = (ev) => {
    setEditing(ev);
    setOpenEdit(true);
  };

  return (
    <div className="monthly-planner-screen">
      <div className="screen-header">
        <div className="screen-header__title">월간 플래너</div>
        <PlannerViewTabs dateKey={dateKey} />
      </div>

      <div className="monthly-topbar">
        <div className="monthly-topbar__left">
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => moveMonth(-1)}>←</button>
          <div className="monthly-topbar__label text-primary">{moment(selectedDate).format("YYYY년 M월")}</div>
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => moveMonth(1)}>→</button>

          <button type="button" className="btn btn--sm btn--secondary" onClick={goToday}>오늘</button>

          <DatePicker
            selected={selectedDate}
            onChange={(d) => d && setSelectedDate(d)}
            dateFormat="yyyy-MM-dd"
            className="monthly-date-input"
            placeholderText="해당 일자로 이동"
          />
        </div>

        <div className="monthly-topbar__right">
          <button type="button" className="btn btn--sm btn--primary" onClick={() => setOpenQuick(true)}>
            + 일정(간단)
          </button>
          <button type="button" className="btn btn--sm btn--secondary" onClick={() => setOpenDetail(true)}>
            + 일정(상세)
          </button>
        </div>
      </div>

      <div className="monthly-layout">
        <div className="card monthly-left">
          <Calendar
            formatDay={(locale, date) => moment(date).format("D")}
            value={selectedDate}
            onChange={(d) => {
              const next = Array.isArray(d) ? d[0] : d;
              if (next) setSelectedDate(next);
            }}
            onClickDay={(d) => setSelectedDate(d)}
            locale="ko-KR"
            calendarType="gregory"
            tileContent={({ date, view }) => {
              if (view !== "month") return null;
              const k = toDateKey(date);
              const count = eventCountByDate[k] || 0;
              if (!count) return null;
              // 점 + 개수(너무 과한 렌더링 피하고 가볍게)
              return (
                <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 6, alignItems: "center" }}>
                  <div className="monthly-calDot" title={`일정 ${count}개`} />
                  <span className="text-muted font-small">{count}</span>
                </div>
              );
            }}
          />
          <div className="text-muted font-small monthly-hint">
            일정이 있는 날짜에 표시됩니다(반복 포함).
          </div>
        </div>

        <div className="card monthly-right">
          <div className="monthly-right__head">
            <div>
              <div className="monthly-right__title">선택 날짜</div>
              <div className="text-muted font-small">{dateKey} · {rawSelectedEvents.length}개</div>
            </div>
            <div className="monthly-right__actions">
              <button type="button" className="btn btn--sm btn--secondary" onClick={() => nav(`/planner/daily?date=${dateKey}`)}>
                일간으로
              </button>
            </div>
          </div>

          <EventQueryBar eventsSource={rawSelectedEvents} value={eventQuery} onChange={setEventQuery} dense />

          <div style={{ marginTop: 10 }}>
            <EventList
              events={selectedEvents}
              dateKey={dateKey}
              onClickEvent={openEditModal}
              emptyText="조건에 맞는 일정이 없습니다."
            />
          </div>
        </div>
      </div>

      <ScheduleFormModal open={openQuick} onClose={() => setOpenQuick(false)} date={selectedDate} mode="quick" onSaved={() => {}} />
      <ScheduleFormModal open={openDetail} onClose={() => setOpenDetail(false)} date={selectedDate} mode="detail" onSaved={() => {}} />
      <ScheduleFormModal
        open={openEdit}
        onClose={() => { setOpenEdit(false); setEditing(null); }}
        date={selectedDate}
        initialEvent={editing}
        mode="detail"
        onSaved={() => { setOpenEdit(false); setEditing(null); }}
      />
    </div>
  );
}
