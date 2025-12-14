// FILE: src/screens/plan/WeeklyPlannerScreen.jsx
import React, { useMemo, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";
import "../../styles/screens/weekly-planner.css";

import { getEventsForDate, toDateKey } from "../../shared/utils/plannerStore";
import ScheduleFormModal from "../../components/schedule/ScheduleFormModal";

moment.locale("ko");
moment.updateLocale("ko", { week: { dow: 0, doy: 1 } });

export default function WeeklyPlannerScreen() {
  const nav = useNavigate();
  const [sp] = useSearchParams();

  const initialDate = useMemo(() => {
    const q = sp.get("date");
    const m = q ? moment(q, "YYYY-MM-DD", true) : null;
    return m && m.isValid() ? m.toDate() : new Date();
  }, [sp]);

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const dateKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);

  const weekStart = useMemo(() => moment(selectedDate).startOf("week"), [selectedDate]);
  const weekDays = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => weekStart.clone().add(i, "day")),
    [weekStart]
  );

  // 모달
  const [openQuick, setOpenQuick] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState(null);

  const selectedEvents = useMemo(() => getEventsForDate(dateKey), [dateKey]);

  const countByDate = useMemo(() => {
    const map = {};
    for (const m of weekDays) {
      const k = m.format("YYYY-MM-DD");
      map[k] = getEventsForDate(k).length;
    }
    return map;
  }, [weekDays]);

  const moveWeek = (deltaWeeks) => setSelectedDate(weekStart.clone().add(deltaWeeks, "week").toDate());
  const goToday = () => setSelectedDate(new Date());

  const openEditModal = (ev) => {
    setEditing(ev);
    setOpenEdit(true);
  };

  return (
    <div className="weekly-planner-screen">
      <div className="screen-header">
        <div className="screen-header__title">주간 플래너</div>
        <div className="tabbar tabbar--sm">
          <NavLink to={`/planner/daily?date=${dateKey}`} className={({ isActive }) => `tabbar__item ${isActive ? "tabbar__item--active" : ""}`}>일간</NavLink>
          <NavLink to={`/planner/weekly?date=${dateKey}`} className={({ isActive }) => `tabbar__item ${isActive ? "tabbar__item--active" : ""}`}>주간</NavLink>
          <NavLink to={`/planner/monthly?date=${dateKey}`} className={({ isActive }) => `tabbar__item ${isActive ? "tabbar__item--active" : ""}`}>월간</NavLink>
          <NavLink to={`/planner/yearly?date=${dateKey}`} className={({ isActive }) => `tabbar__item ${isActive ? "tabbar__item--active" : ""}`}>연간</NavLink>
        </div>
      </div>

      <div className="weekly-topbar">
        <div className="weekly-topbar__left">
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => moveWeek(-1)}>←</button>
          <div className="weekly-topbar__label text-primary">
            {weekStart.format("YYYY. MM. D")} ~ {weekStart.clone().add(6, "day").format("MM. D")}
          </div>
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => moveWeek(1)}>→</button>

          <button type="button" className="btn btn--sm btn--secondary" onClick={goToday}>오늘</button>

          <DatePicker
            selected={selectedDate}
            onChange={(d) => d && setSelectedDate(d)}
            dateFormat="yyyy-MM-dd"
            className="weekly-date-input"
            placeholderText="해당 일자로 이동"
          />
        </div>

        <div className="weekly-topbar__right">
          <button type="button" className="btn btn--sm btn--primary" onClick={() => setOpenQuick(true)}>
            + 일정(간단)
          </button>
          <button type="button" className="btn btn--sm btn--secondary" onClick={() => setOpenDetail(true)}>
            + 일정(상세)
          </button>
        </div>
      </div>

      <div className="weekly-layout">
        <div className="card weekly-left">
          <div className="weekly-dayStrip">
            {weekDays.map((m) => {
              const k = m.format("YYYY-MM-DD");
              const isActive = k === dateKey;
              const cnt = countByDate[k] || 0;
              return (
                <button
                  key={k}
                  type="button"
                  className={"weekly-dayBtn " + (isActive ? "is-active" : "")}
                  onClick={() => setSelectedDate(m.toDate())}
                >
                  <div className="weekly-dayBtn__dow">{m.format("ddd")}</div>
                  <div className="weekly-dayBtn__date">{m.format("D")}</div>
                  {cnt ? <div className="weekly-dayBtn__badge">{cnt}</div> : null}
                </button>
              );
            })}
          </div>

          <div className="weekly-hint text-muted font-small">
            날짜를 클릭하면 우측에 해당 날짜 일정이 표시됩니다(반복 일정 포함).
          </div>
        </div>

        <div className="card weekly-right">
          <div className="weekly-right__head">
            <div>
              <div className="weekly-right__title">선택 날짜</div>
              <div className="text-muted font-small">{dateKey}</div>
            </div>
            <div className="weekly-right__actions">
              <button type="button" className="btn btn--sm btn--primary" onClick={() => setOpenQuick(true)}>+ 간단</button>
              <button type="button" className="btn btn--sm btn--secondary" onClick={() => setOpenDetail(true)}>+ 상세</button>
              <button type="button" className="btn btn--sm btn--secondary" onClick={() => nav(`/planner/daily?date=${dateKey}`)}>
                일간으로
              </button>
            </div>
          </div>

          {selectedEvents.length ? (
            <div className="weekly-eventList">
              {selectedEvents.map((e) => (
                <div key={e.id} className="weekly-eventRow">
                  <button type="button" className="weekly-eventMain" onClick={() => openEditModal(e)}>
                    <div className="weekly-eventTitle">{e.title}</div>
                    <div className="text-muted font-small">
                      {e.start}~{e.end}
                      {e.sharedUserIds?.length ? ` · 공유 ${e.sharedUserIds.length}` : ""}
                      {e.isOccurrence ? " · 반복" : ""}
                    </div>
                  </button>
                  <button type="button" className="btn btn--sm btn--ghost" onClick={() => openEditModal(e)}>
                    수정
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted font-small">등록된 일정이 없습니다.</div>
          )}
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
