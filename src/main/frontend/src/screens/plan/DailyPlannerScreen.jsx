// FILE: src/main/frontend/src/screens/plan/DailyPlannerScreen.jsx
import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";
import "../../styles/screens/daily-planner.css";
import "../../styles/screens/planner-view-modes.css";

// RoutineManagementScreen과 동일하게 default import 스타일로 통일
import safeStorage from "../../shared/utils/safeStorage";
import { getEventsForDate, toDateKey } from "../../shared/utils/plannerStore";
import { getRoutinesForDate } from "../../shared/utils/routineStore";

import ScheduleFormModal from "../../components/schedule/ScheduleFormModal";
import RoutineFormModal from "../../components/routine/RoutineFormModal";

import PlannerViewTabs from "./_components/PlannerViewTabs";
import PlannerModeTabs from "./_components/PlannerModeTabs";
import TimebarDay from "./_components/TimebarDay";
import DailyTodoList from "./_components/DailyTodoList";

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

  // 보기 탭: timebar | list
  const [viewMode, setViewMode] = useState(() => safeStorage.getItem("planner.view.daily", "timebar"));
  React.useEffect(() => {
    safeStorage.setItem("planner.view.daily", viewMode);
  }, [viewMode]);

  // 저장 후 화면 갱신 트리거
  const [rev, setRev] = useState(0);
  const bumpRev = () => setRev((x) => x + 1);

  // 메모
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

  const rawEvents = useMemo(() => getEventsForDate(dateKey), [dateKey, rev]);
  const routines = useMemo(() => getRoutinesForDate(selectedDate), [selectedDate, rev]);

  // 목록 보기용: 검색/필터/정렬
  const [eventQuery, setEventQuery] = useState(() => ({
    keyword: "",
    sortKey: "start",
    categoryId: "all",
    visibility: "all",
    onlyDday: false,
    onlyBookmarked: false,
    onlyShared: false,
  }));
  const events = useMemo(() => applyEventQuery(rawEvents, eventQuery, dateKey), [rawEvents, eventQuery, dateKey]);

  // 모달 상태(일정)
  const [openSchQuick, setOpenSchQuick] = useState(false);
  const [openSchDetail, setOpenSchDetail] = useState(false);
  const [openSchEdit, setOpenSchEdit] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // 모달 상태(루틴) - RoutineManagementScreen과 동일 패턴으로 정리
  const [openRtQuick, setOpenRtQuick] = useState(false);
  const [openRtDetail, setOpenRtDetail] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null); // <- openRtEdit 제거

  const openEditEvent = (ev) => {
    setEditingEvent(ev);
    setOpenSchEdit(true);
  };

  // 루틴 클릭 시: 바로 수정 모달(상세) 오픈
  const openEditRoutine = (rt) => {
    setEditingRoutine(rt);
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
    <div className="daily-planner-screen daily-paper">
      <div className="screen-header">
        <div className="screen-header__title">일간 플래너</div>
        <div className="screen-header__right">
          <PlannerModeTabs
            value={viewMode}
            options={[
              { key: "timebar", label: "타임바" },
              { key: "list", label: "목록" },
            ]}
            onChange={setViewMode}
          />
          <PlannerViewTabs dateKey={dateKey} />
        </div>
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

          <button type="button" className="btn btn--sm btn--secondary" onClick={goToday}>
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
          <ButtonGroup variant="outlined" size="small">
            <Button startIcon={<Plus size={16} />} onClick={() => setOpenSchQuick(true)}>
              일정(간단)
            </Button>
            <Button onClick={() => setOpenSchDetail(true)}>일정(상세)</Button>
          </ButtonGroup>

          <ButtonGroup variant="outlined" size="small">
            <Button startIcon={<Plus size={16} />} onClick={() => setOpenRtQuick(true)}>
              루틴(간단)
            </Button>
            <Button onClick={() => setOpenRtDetail(true)}>루틴(상세)</Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="daily-paperGrid">
        <div className="card daily-paperLeft">
          {viewMode === "timebar" ? (
            <>
              <div className="daily-cardHead">
                <div>
                  <div className="daily-cardTitle">TIMETABLE</div>
                  <div className="text-muted font-small">
                    {dateKey} · {rawEvents.length}개
                  </div>
                </div>
                <div className="daily-cardActions">
                  <button
                    type="button"
                    className="btn btn--sm btn--secondary"
                    onClick={() => {
                      setEditingEvent({ title: "", start: "09:00", end: "09:30", colorHex: "#99aaff" });
                      setOpenSchEdit(true);
                    }}
                  >
                    + 블록 추가
                  </button>
                  <span className="text-muted font-small">더블클릭으로도 추가</span>
                </div>
              </div>

              <TimebarDay
                dateKey={dateKey}
                events={rawEvents}
                onClickEvent={openEditEvent}
                onCreateDraft={(draft) => {
                  setEditingEvent(draft);
                  setOpenSchEdit(true);
                }}
              />
            </>
          ) : (
            <>
              <div className="daily-cardHead">
                <div>
                  <div className="daily-cardTitle">오늘 일정 목록</div>
                  <div className="text-muted font-small">
                    {dateKey} · {rawEvents.length}개
                  </div>
                </div>
                <div className="daily-cardActions">
                  <button type="button" className="btn btn--sm btn--secondary" onClick={() => setOpenSchDetail(true)}>
                    + 일정 추가
                  </button>
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
            </>
          )}
        </div>

        <div className="card daily-paperRight">
          <div className="daily-paperRightStack">
            <div className="daily-section">
              <div className="daily-sectionHead">
                <div className="daily-cardTitle">TODO LIST</div>
                <div className="text-muted font-small">Enter로 추가 · 체크/삭제</div>
              </div>
              <DailyTodoList dateKey={dateKey} />
            </div>

            <div className="daily-section">
              <div className="daily-sectionHead">
                <div className="daily-cardTitle">NOTE</div>
                <div className="daily-memoActions">
                  <button type="button" className="btn btn--sm btn--primary" onClick={saveMemo}>
                    저장
                  </button>
                  <span className="text-muted font-small">
                    {memoSavedAt ? `저장됨 ${moment(memoSavedAt).format("HH:mm")}` : "아직 저장하지 않음"}
                  </span>
                </div>
              </div>

              <textarea
                className="daily-memo daily-memo--paper"
                rows={8}
                value={memo}
                placeholder="오늘 메모..."
                onChange={(e) => setMemo(e.target.value)}
                onBlur={saveMemo}
              />
              <div className="text-muted font-small" style={{ marginTop: 8 }}>
                localStorage가 차단된 환경이면 새로고침 시 저장이 유지되지 않을 수 있습니다.
              </div>
            </div>

            <div className="daily-section">
              <div className="daily-sectionHead">
                <div>
                  <div className="daily-cardTitle">ROUTINE</div>
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
        </div>
      </div>

      {/* 일정 모달 */}
      <ScheduleFormModal
        open={openSchQuick}
        onClose={() => setOpenSchQuick(false)}
        date={selectedDate}
        mode="quick"
        onSaved={() => {
          setOpenSchQuick(false);
          bumpRev();
        }}
      />
      <ScheduleFormModal
        open={openSchDetail}
        onClose={() => setOpenSchDetail(false)}
        date={selectedDate}
        mode="detail"
        onSaved={() => {
          setOpenSchDetail(false);
          bumpRev();
        }}
      />
      <ScheduleFormModal
        open={openSchEdit}
        onClose={() => {
          setOpenSchEdit(false);
          setEditingEvent(null);
        }}
        date={selectedDate}
        mode="detail"
        initialEvent={editingEvent}
        onSaved={() => {
          setOpenSchEdit(false);
          setEditingEvent(null);
          bumpRev();
        }}
      />

      {/* 루틴 모달 - RoutineManagementScreen과 동일 동작 */}
      <RoutineFormModal
        open={openRtQuick}
        onClose={() => setOpenRtQuick(false)}
        mode="quick"
        onSaved={() => {
          setOpenRtQuick(false);
          bumpRev();
        }}
      />
      <RoutineFormModal
        open={openRtDetail}
        onClose={() => setOpenRtDetail(false)}
        mode="detail"
        onSaved={() => {
          setOpenRtDetail(false);
          bumpRev();
        }}
      />
      <RoutineFormModal
        open={!!editingRoutine}
        onClose={() => setEditingRoutine(null)}
        mode="detail"
        initialRoutine={editingRoutine}
        onSaved={() => {
          setEditingRoutine(null);
          bumpRev();
        }}
      />
    </div>
  );
}
