// FILE: src/main/frontend/src/screens/plan/MonthlyPlannerScreen.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import Calendar from "react-calendar";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";
import "../../styles/screens/monthly-planner.css";
import "../../styles/screens/planner-view-modes.css";

import { safeStorage } from "../../shared/utils/safeStorage";
import { getEventsForDate, toDateKey } from "../../shared/utils/plannerStore";
import ScheduleFormModal from "../../components/schedule/ScheduleFormModal";

import PlannerViewTabs from "./_components/PlannerViewTabs";
import PlannerModeTabs from "./_components/PlannerModeTabs";
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

  // 보기 탭: calendar | list
  const [viewMode, setViewMode] = useState(() => safeStorage.getItem("planner.view.monthly", "calendar"));
  React.useEffect(() => {
    safeStorage.setItem("planner.view.monthly", viewMode);
  }, [viewMode]);

  // 저장 후 화면 갱신 트리거
  const [rev, setRev] = useState(0);
  const bumpRev = () => setRev((x) => x + 1);

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

  const monthMeta = useMemo(() => {
    const m = moment(selectedDate);
    const start = m.clone().startOf("month");
    const days = m.daysInMonth();
    const keys = Array.from({ length: days }).map((_, i) => start.clone().add(i, "day").format("YYYY-MM-DD"));
    return { start, days, keys, ym: m.format("YYYY-MM") };
  }, [selectedDate]);

  const eventCountByDate = useMemo(() => {
    const map = {};
    for (const k of monthMeta.keys) {
      const cnt = getEventsForDate(k).length;
      if (cnt) map[k] = cnt;
    }
    return map;
  }, [monthMeta.keys, rev]);

  // 월간 목록(날짜별 그룹)
  const monthListGroups = useMemo(() => {
    const out = [];
    for (const k of monthMeta.keys) {
      const raw = getEventsForDate(k);
      const filtered = applyEventQuery(raw, eventQuery, k);
      if (!filtered.length) continue;
      out.push({ dateKey: k, events: filtered });
    }
    return out;
  }, [monthMeta.keys, eventQuery, rev]);

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
        <div className="screen-header__right">
          <PlannerModeTabs
            value={viewMode}
            options={[
              { key: "calendar", label: "캘린더" },
              { key: "list", label: "목록" },
            ]}
            onChange={setViewMode}
          />
          <PlannerViewTabs dateKey={dateKey} />
        </div>
      </div>

      <div className="monthly-topbar">
        <div className="monthly-topbar__left">
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => moveMonth(-1)}>
            ←
          </button>
          <div className="monthly-topbar__label text-primary">{moment(selectedDate).format("YYYY년 M월")}</div>
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => moveMonth(1)}>
            →
          </button>

          <button type="button" className="btn btn--sm btn--secondary" onClick={goToday}>
            오늘
          </button>

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

      {viewMode === "calendar" ? (
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
                return (
                  <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 6, alignItems: "center" }}>
                    <div className="monthly-calDot" title={`일정 ${count}개`} />
                    <span className="text-muted font-small">{count}</span>
                  </div>
                );
              }}
            />
            <div className="text-muted font-small monthly-hint">일정이 있는 날짜에 표시됩니다(반복 포함).</div>
          </div>

          <div className="card monthly-right">
            <div className="monthly-right__head">
              <div>
                <div className="monthly-right__title">선택 날짜</div>
                <div className="text-muted font-small">
                  {dateKey} · {rawSelectedEvents.length}개
                </div>
              </div>
              <div className="monthly-right__actions">
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
      ) : (
        <div className="monthly-listLayout">
          <div className="card monthly-listLeft">
            <div className="monthly-listTitle">
              <div style={{ fontWeight: 850 }}>{moment(selectedDate).format("YYYY년 M월")}</div>
              <div className="text-muted font-small">필터를 적용하면 월 전체 목록에도 반영됩니다.</div>
            </div>

            {/* 월 전체 목록에서도 카테고리/검색이 필요해서 source는 월 전체 flatten 대신 "선택일 raw"로 둠(옵션 목록은 이벤트 기반) */}
            <EventQueryBar eventsSource={rawSelectedEvents} value={eventQuery} onChange={setEventQuery} dense />

            <div className="text-muted font-small" style={{ marginTop: 10 }}>
              날짜를 클릭하면 일간으로 이동합니다.
            </div>
          </div>

          <div className="card monthly-listRight">
            {monthListGroups.length ? (
              <div className="monthly-groupList">
                {monthListGroups.map((g) => (
                  <div key={g.dateKey} className="monthly-group">
                    <button
                      type="button"
                      className="monthly-group__head"
                      onClick={() => nav(`/planner/daily?date=${g.dateKey}`)}
                      title="일간으로 이동"
                    >
                      <div className="monthly-group__date">{g.dateKey}</div>
                      <div className="text-muted font-small">{g.events.length}개</div>
                    </button>
                    <div className="monthly-group__body">
                      <EventList events={g.events} dateKey={g.dateKey} onClickEvent={openEditModal} emptyText="" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted font-small">조건에 맞는 일정이 없습니다.</div>
            )}
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
