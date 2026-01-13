// FILE: src/main/frontend/src/screens/plan/WeeklyPlannerScreen.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";
import "../../styles/screens/weekly-planner.css";
import "../../styles/screens/planner-view-modes.css";

import { safeStorage } from "../../shared/utils/safeStorage";
import { getEventsForDate, toDateKey } from "../../shared/utils/plannerStore";
import ScheduleFormModal from "../../components/schedule/ScheduleFormModal";

import PlannerViewTabs from "./_components/PlannerViewTabs";
import PlannerModeTabs from "./_components/PlannerModeTabs";
import WeeklyTimebarGrid from "./_components/WeeklyTimebarGrid";

import EventQueryBar from "./_components/EventQueryBar";
import EventList from "./_components/EventList";
import { applyEventQuery } from "./plannerUiUtils";

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

  // 보기 탭: list | timegrid
  const [viewMode, setViewMode] = useState(() => safeStorage.getItem("planner.view.weekly", "list"));
  React.useEffect(() => {
    safeStorage.setItem("planner.view.weekly", viewMode);
  }, [viewMode]);

  // 저장 후 화면 갱신 트리거
  const [rev, setRev] = useState(0);
  const bumpRev = () => setRev((x) => x + 1);

  const weekStart = useMemo(() => moment(selectedDate).startOf("week"), [selectedDate]);
  const weekDays = useMemo(() => Array.from({ length: 7 }).map((_, i) => weekStart.clone().add(i, "day")), [weekStart]);

  const rawSelectedEvents = useMemo(() => getEventsForDate(dateKey), [dateKey, rev]);

  // 검색/필터/정렬
  const [eventQuery, setEventQuery] = useState(() => ({
    keyword: "",
    sortKey: "start",
    categoryId: "all",
    visibility: "all",
    onlyDday: false,
    onlyBookmarked: false,
    onlyShared: false,
  }));

  const selectedEvents = useMemo(() => applyEventQuery(rawSelectedEvents, eventQuery, dateKey), [rawSelectedEvents, eventQuery, dateKey]);

  const countByDate = useMemo(() => {
    const map = {};
    for (const m of weekDays) {
      const k = m.format("YYYY-MM-DD");
      map[k] = getEventsForDate(k).length;
    }
    return map;
  }, [weekDays, rev]);

  const moveWeek = (deltaWeeks) => setSelectedDate(weekStart.clone().add(deltaWeeks, "week").toDate());
  const goToday = () => setSelectedDate(new Date());

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
    <div className="weekly-planner-screen">
      <div className="screen-header">
        <div className="screen-header__title">주간 플래너</div>
        <div className="screen-header__right">
          <PlannerModeTabs
            value={viewMode}
            options={[
              { key: "list", label: "목록" },
              { key: "timegrid", label: "타임테이블" },
            ]}
            onChange={setViewMode}
          />
          <PlannerViewTabs dateKey={dateKey} />
        </div>
      </div>

      <div className="weekly-topbar">
        <div className="weekly-topbar__left">
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => moveWeek(-1)}>
            ←
          </button>
          <div className="weekly-topbar__label text-primary">
            {weekStart.format("YYYY. MM. D")} ~ {weekStart.clone().add(6, "day").format("MM. D")}
          </div>
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => moveWeek(1)}>
            →
          </button>

          <button type="button" className="btn btn--sm btn--secondary" onClick={goToday}>
            오늘
          </button>

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

      {viewMode === "timegrid" ? (
        <div className="card weekly-timegridCard">
          <WeeklyTimebarGrid
            weekDays={weekDays}
            getEventsForDateKey={(k) => getEventsForDate(k)}
            onClickEvent={(k, ev) => {
              // 클릭한 블록이 속한 날짜로 선택일 갱신 후 편집
              const d = moment(k, "YYYY-MM-DD", true).isValid() ? moment(k, "YYYY-MM-DD", true).toDate() : new Date();
              setSelectedDate(d);
              openEditModal(ev);
            }}
            onCreateDraft={(dateObj, draft) => {
              setSelectedDate(dateObj);
              setEditing(draft);
              setOpenEdit(true);
            }}
          />
          <div className="text-muted font-small weekly-timegridHint">
            원하는 날짜 칸을 더블클릭해서 일정 블록을 추가할 수 있습니다.
          </div>
        </div>
      ) : (
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
                <div className="text-muted font-small">
                  {dateKey} · {rawSelectedEvents.length}개
                </div>
              </div>
              <div className="weekly-right__actions">
                <button type="button" className="btn btn--sm btn--secondary" onClick={() => nav(`/planner/daily?date=${dateKey}`)}>
                  일간으로
                </button>
              </div>
            </div>

            <EventQueryBar eventsSource={rawSelectedEvents} value={eventQuery} onChange={setEventQuery} dense />

            <div style={{ marginTop: 10 }}>
              <EventList events={selectedEvents} dateKey={dateKey} onClickEvent={openEditModal} emptyText="조건에 맞는 일정이 없습니다." />
            </div>
          </div>
        </div>
      )}

      <ScheduleFormModal
        open={openQuick}
        onClose={() => setOpenQuick(false)}
        date={selectedDate}
        mode="quick"
        onSaved={() => {
          setOpenQuick(false);
          bumpRev();
        }}
      />
      <ScheduleFormModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        date={selectedDate}
        mode="detail"
        onSaved={() => {
          setOpenDetail(false);
          bumpRev();
        }}
      />
      <ScheduleFormModal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setEditing(null);
        }}
        date={selectedDate}
        initialEvent={editing}
        mode="detail"
        onSaved={() => {
          setOpenEdit(false);
          setEditing(null);
          bumpRev();
        }}
      />
    </div>
  );
}
