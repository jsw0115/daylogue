// FILE: src/screens/plan/DailyPlannerScreen.jsx
import React, { useMemo, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";
import "../../styles/screens/daily-planner.css";

import { safeStorage } from "../../shared/utils/safeStorage";
import { getEventsForDate, toDateKey } from "../../shared/utils/plannerStore";
import { getRoutinesForDate } from "../../shared/utils/routineStore";

import ScheduleFormModal from "../../components/schedule/ScheduleFormModal";
import RoutineFormModal from "../../components/routine/RoutineFormModal";

moment.locale("ko");

export default function DailyPlannerScreen() {
  const [sp, setSp] = useSearchParams();

  const initialDate = useMemo(() => {
    const q = sp.get("date");
    const m = q ? moment(q, "YYYY-MM-DD", true) : null;
    return m && m.isValid() ? m.toDate() : new Date();
  }, [sp]);

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const dateKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);

  const goToday = () => setSelectedDate(new Date());
  const moveDay = (delta) => setSelectedDate(moment(selectedDate).add(delta, "day").toDate());

  // 날짜 변경 시 query 반영(요청한 동작)
  const syncQuery = (d) => setSp({ date: toDateKey(d) });

  const [memo, setMemo] = useState(() => safeStorage.getItem(`planner.memo.${dateKey}`, ""));
  const [memoSavedAt, setMemoSavedAt] = useState(null);

  // dateKey 바뀌면 memo도 로드
  React.useEffect(() => {
    setMemo(safeStorage.getItem(`planner.memo.${dateKey}`, ""));
    setMemoSavedAt(null);
  }, [dateKey]);

  const saveMemo = () => {
    safeStorage.setItem(`planner.memo.${dateKey}`, memo);
    setMemoSavedAt(Date.now());
  };

  // 일정/루틴 데이터
  const events = useMemo(() => getEventsForDate(dateKey), [dateKey]);
  const routines = useMemo(() => getRoutinesForDate(selectedDate), [selectedDate]);

  // 모달 상태
  const [openSchQuick, setOpenSchQuick] = useState(false);
  const [openSchDetail, setOpenSchDetail] = useState(false);
  const [openSchEdit, setOpenSchEdit] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [openRtQuick, setOpenRtQuick] = useState(false);
  const [openRtDetail, setOpenRtDetail] = useState(false);
  const [openRtEdit, setOpenRtEdit] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);

  const openEditEvent = (ev) => {
    setEditingEvent(ev);
    setOpenSchEdit(true);
  };

  const openEditRoutine = (rt) => {
    setEditingRoutine(rt);
    setOpenRtEdit(true);
  };

  return (
    <div className="daily-planner-screen">
      <div className="screen-header">
        <div className="screen-header__title">일간 플래너</div>
        <div className="tabbar tabbar--sm">
          <NavLink to={`/planner/daily?date=${dateKey}`} className={({ isActive }) => `tabbar__item ${isActive ? "tabbar__item--active" : ""}`}>일간</NavLink>
          <NavLink to={`/planner/weekly?date=${dateKey}`} className={({ isActive }) => `tabbar__item ${isActive ? "tabbar__item--active" : ""}`}>주간</NavLink>
          <NavLink to={`/planner/monthly?date=${dateKey}`} className={({ isActive }) => `tabbar__item ${isActive ? "tabbar__item--active" : ""}`}>월간</NavLink>
          <NavLink to={`/planner/yearly?date=${dateKey}`} className={({ isActive }) => `tabbar__item ${isActive ? "tabbar__item--active" : ""}`}>연간</NavLink>
        </div>
      </div>

      <div className="daily-topbar">
        <div className="daily-topbar__left">
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => { const d = moment(selectedDate).add(-1, "day").toDate(); setSelectedDate(d); syncQuery(d); }}>
            ←
          </button>

          <div className="daily-topbar__label text-primary">
            {moment(selectedDate).format("YYYY. MM. D (ddd)")}
          </div>

          <button type="button" className="btn btn--sm btn--ghost" onClick={() => { const d = moment(selectedDate).add(1, "day").toDate(); setSelectedDate(d); syncQuery(d); }}>
            →
          </button>

          <button type="button" className="btn btn--sm btn--secondary" onClick={() => { const d = new Date(); setSelectedDate(d); syncQuery(d); }}>
            오늘
          </button>

          <DatePicker
            selected={selectedDate}
            onChange={(d) => {
              if (!d) return;
              setSelectedDate(d);
              syncQuery(d);
            }}
            dateFormat="yyyy-MM-dd"
            className="daily-date-input"
            placeholderText="해당 일자로 이동"
          />
        </div>

        <div className="daily-topbar__right">
          <button type="button" className="btn btn--sm btn--primary" onClick={() => setOpenSchQuick(true)}>
            + 일정(간단)
          </button>
          <button type="button" className="btn btn--sm btn--secondary" onClick={() => setOpenSchDetail(true)}>
            + 일정(상세)
          </button>
          <button type="button" className="btn btn--sm btn--primary" onClick={() => setOpenRtQuick(true)}>
            + 루틴(간단)
          </button>
          <button type="button" className="btn btn--sm btn--secondary" onClick={() => setOpenRtDetail(true)}>
            + 루틴(상세)
          </button>
        </div>
      </div>

      <div className="daily-layout">
        <div className="card daily-left">
          <div className="daily-cardHead">
            <div>
              <div className="daily-cardTitle">오늘 일정</div>
              <div className="text-muted font-small">{dateKey}</div>
            </div>
          </div>

          {events.length ? (
            <div className="daily-eventList">
              {events.map((e) => (
                <button key={e.id} type="button" className="daily-eventRow" onClick={() => openEditEvent(e)}>
                  <div className="daily-eventTitle">{e.title}</div>
                  <div className="daily-eventMeta text-muted font-small">
                    {e.start}~{e.end}
                    {e.sharedUserIds?.length ? ` · 공유 ${e.sharedUserIds.length}` : ""}
                    {e.isOccurrence ? " · 반복" : ""}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-muted font-small">등록된 일정이 없습니다.</div>
          )}
        </div>

        <div className="card daily-right">
          <div className="daily-cardHead">
            <div className="daily-cardTitle">Daily Memo</div>
            <div className="daily-memoActions">
              <button type="button" className="btn btn--sm btn--primary" onClick={saveMemo}>
                메모 저장
              </button>
              <span className="text-muted font-small">
                {memoSavedAt ? `저장됨 ${moment(memoSavedAt).format("HH:mm")}` : "아직 저장하지 않음"}
              </span>
            </div>
          </div>

          <textarea
            className="daily-memo"
            rows={10}
            value={memo}
            placeholder="오늘 하루를 기록하세요..."
            onChange={(e) => setMemo(e.target.value)}
            onBlur={saveMemo}
          />
          <div className="text-muted font-small" style={{ marginTop: 8 }}>
            localStorage가 차단된 환경이면 새로고침 시 저장이 유지되지 않을 수 있습니다.
          </div>
        </div>

        <div className="card daily-bottom">
          <div className="daily-cardHead">
            <div>
              <div className="daily-cardTitle">Routine</div>
              <div className="text-muted font-small">오늘 실행할 루틴</div>
            </div>
          </div>

          {routines.length ? (
            <div className="daily-routineList">
              {routines.map((r) => (
                <button key={r.id} type="button" className="daily-routineRow" onClick={() => openEditRoutine(r)}>
                  <div className="daily-routineLeft">
                    <span className="daily-routineIcon">{r.icon || "•"}</span>
                    <span className="daily-routineName">{r.name}</span>
                  </div>
                  <div className="daily-routineMeta text-muted font-small">
                    {r.time}
                    {r.notify ? ` · 알림 ${r.beforeMinutes || "정시"}` : " · 알림 없음"}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-muted font-small">오늘 실행할 루틴이 없습니다.</div>
          )}
        </div>
      </div>

      {/* 일정 모달 */}
      <ScheduleFormModal open={openSchQuick} onClose={() => setOpenSchQuick(false)} date={selectedDate} mode="quick" onSaved={() => {}} />
      <ScheduleFormModal open={openSchDetail} onClose={() => setOpenSchDetail(false)} date={selectedDate} mode="detail" onSaved={() => {}} />
      <ScheduleFormModal
        open={openSchEdit}
        onClose={() => { setOpenSchEdit(false); setEditingEvent(null); }}
        date={selectedDate}
        mode="detail"
        initialEvent={editingEvent}
        onSaved={() => {}}
      />

      {/* 루틴 모달 */}
      <RoutineFormModal open={openRtQuick} onClose={() => setOpenRtQuick(false)} mode="quick" onSaved={() => {}} />
      <RoutineFormModal open={openRtDetail} onClose={() => setOpenRtDetail(false)} mode="detail" onSaved={() => {}} />
      <RoutineFormModal
        open={openRtEdit}
        onClose={() => { setOpenRtEdit(false); setEditingRoutine(null); }}
        mode="detail"
        initialRoutine={editingRoutine}
        onSaved={() => {}}
      />
    </div>
  );
}
