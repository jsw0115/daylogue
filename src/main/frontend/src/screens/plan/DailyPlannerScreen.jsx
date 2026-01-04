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

import PlannerViewTabs from "./_components/PlannerViewTabs";
import EventQueryBar from "./_components/EventQueryBar";
import EventList from "./_components/EventList";
import { applyEventQuery } from "./plannerUiUtils";

import { Button, ButtonGroup } from "@mui/material";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

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

  const syncQuery = (d) => setSp({ date: toDateKey(d) });

  const [memo, setMemo] = useState(() => safeStorage.getItem(`planner.memo.${dateKey}`, ""));
  const [memoSavedAt, setMemoSavedAt] = useState(null);

  React.useEffect(() => {
    setMemo(safeStorage.getItem(`planner.memo.${dateKey}`, ""));
    setMemoSavedAt(null);
  }, [dateKey]);

  const saveMemo = () => {
    safeStorage.setItem(`planner.memo.${dateKey}`, memo);
    setMemoSavedAt(Date.now());
  };

  // 일정/루틴
  const rawEvents = useMemo(() => getEventsForDate(dateKey), [dateKey]);
  const routines = useMemo(() => getRoutinesForDate(selectedDate), [selectedDate]);

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

  const events = useMemo(() => applyEventQuery(rawEvents, eventQuery, dateKey), [rawEvents, eventQuery, dateKey]);

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
    setOpenRtEdit(true); // ✅ 기존 코드에서 누락되어 “클릭해도 편집 모달 안 열림” 버그 발생
  };

  const moveDay = (delta) => {
    const d = moment(selectedDate).add(delta, "day").toDate();
    setSelectedDate(d);
    syncQuery(d);
  };

  const goToday = () => {
    const d = new Date();
    setSelectedDate(d);
    syncQuery(d);
  };

  return (
    <div className="daily-planner-screen">
      <div className="screen-header">
        <div className="screen-header__title">일간 플래너</div>
        <PlannerViewTabs dateKey={dateKey} />
      </div>

      <div className="daily-topbar">
        <div className="daily-topbar__left">
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => moveDay(-1)}>
            <ChevronLeft size={16} />
          </button>

          <div className="daily-topbar__label text-primary">{moment(selectedDate).format("YYYY. MM. D (ddd)")}</div>

          <button type="button" className="btn btn--sm btn--ghost" onClick={() => moveDay(1)}>
            <ChevronRight size={16} />
          </button>

          <button type="button" className="btn btn--sm btn--secondary" onClick={goToday}>오늘</button>

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
          <ButtonGroup variant="outlined" size="small">
            <Button startIcon={<Plus size={16} />} onClick={() => setOpenSchQuick(true)}>일정(간단)</Button>
            <Button onClick={() => setOpenSchDetail(true)}>일정(상세)</Button>
          </ButtonGroup>

          <ButtonGroup variant="outlined" size="small">
            <Button startIcon={<Plus size={16} />} onClick={() => setOpenRtQuick(true)}>루틴(간단)</Button>
            <Button onClick={() => setOpenRtDetail(true)}>루틴(상세)</Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="daily-layout">
        <div className="card daily-left">
          <div className="daily-cardHead" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="daily-cardTitle">오늘 일정</div>
              <div className="text-muted font-small">{dateKey} · {rawEvents.length}개</div>
            </div>
          </div>

          <EventQueryBar eventsSource={rawEvents} value={eventQuery} onChange={setEventQuery} dense />

          <div style={{ marginTop: 10 }}>
            <EventList
              events={events}
              dateKey={dateKey}
              onClickEvent={openEditEvent}
              emptyText="조건에 맞는 일정이 없습니다."
            />
          </div>
        </div>

        <div className="card daily-right">
          <div className="daily-cardHead">
            <div className="daily-cardTitle">Daily Memo</div>
            <div className="daily-memoActions">
              <button type="button" className="btn btn--sm btn--primary" onClick={saveMemo}>메모 저장</button>
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
