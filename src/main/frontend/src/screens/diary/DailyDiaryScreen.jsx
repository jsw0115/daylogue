// src/screens/diary/DailyDiaryScreen.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import Calendar from "react-calendar";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";
import "../../styles/screens/diary.css";

import { safeStorage } from "../../shared/utils/safeStorage";

moment.locale("ko");

const MOODS = [
  { id: "great", label: "최고", icon: "😄" },
  { id: "good", label: "좋음", icon: "🙂" },
  { id: "soso", label: "보통", icon: "😐" },
  { id: "bad", label: "나쁨", icon: "🙁" },
  { id: "terrible", label: "최악", icon: "😫" },
];

const toDateKey = (d) => moment(d).format("YYYY-MM-DD");

function loadDiaryMap() {
  return safeStorage.getJSON("diary.entries", {});
}
function saveDiaryMap(map) {
  safeStorage.setJSON("diary.entries", map);
}

function getPlannerSummary(dateKey) {
  const plan = safeStorage.getJSON(`planner.daily.${dateKey}`, null);
  if (!plan) return null;

  const todos = plan.todos || [];
  const routines = plan.routines || [];
  const timeline = plan.timelineItems || [];

  const todoDone = todos.filter((t) => t.done).length;
  const routineDone = routines.filter((r) => r.done).length;

  return {
    todoTotal: todos.length,
    todoDone,
    routineTotal: routines.length,
    routineDone,
    timelineCount: timeline.length,
    topTimeline: timeline.slice(0, 3),
  };
}

function snapDiary(mood, summary, detail, gratitude) {
  return JSON.stringify({
    mood,
    summary: (summary ?? "").trim(),
    detail: (detail ?? "").trim(),
    gratitude: (gratitude ?? "").trim(),
  });
}

export default function DailyDiaryScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);

  const [viewMode, setViewMode] = useState("list"); // list | calendar
  const [query, setQuery] = useState("");

  const [diaryMap, setDiaryMap] = useState(() => loadDiaryMap());

  const current = diaryMap[dateKey] || {
    mood: "good",
    summary: "",
    detail: "",
    gratitude: "",
    updatedAt: null,
  };

  const [mood, setMood] = useState(current.mood);
  const [summary, setSummary] = useState(current.summary);
  const [detail, setDetail] = useState(current.detail);
  const [gratitude, setGratitude] = useState(current.gratitude);

  // 저장 상태(버튼 disabled 처리)
  const savedSnapRef = useRef(snapDiary(current.mood, current.summary, current.detail, current.gratitude));
  const [lastSavedAt, setLastSavedAt] = useState(current.updatedAt);

  // 날짜 변경 시 로드
  useEffect(() => {
    const map = loadDiaryMap();
    setDiaryMap(map);

    const cur = map[dateKey] || {
      mood: "good",
      summary: "",
      detail: "",
      gratitude: "",
      updatedAt: null,
    };

    setMood(cur.mood);
    setSummary(cur.summary);
    setDetail(cur.detail);
    setGratitude(cur.gratitude);

    savedSnapRef.current = snapDiary(cur.mood, cur.summary, cur.detail, cur.gratitude);
    setLastSavedAt(cur.updatedAt);
  }, [dateKey]);

  const isDirty = useMemo(() => {
    const cur = snapDiary(mood, summary, detail, gratitude);
    return cur !== savedSnapRef.current;
  }, [mood, summary, detail, gratitude]);

  // ✅ 명시 저장 버튼
  const saveNow = () => {
    setDiaryMap((prev) => {
      const next = { ...prev };
      const now = Date.now();
      next[dateKey] = {
        mood,
        summary,
        detail,
        gratitude,
        updatedAt: now,
      };
      saveDiaryMap(next);
      savedSnapRef.current = snapDiary(mood, summary, detail, gratitude);
      setLastSavedAt(now);
      return next;
    });
  };

  const moveDay = (delta) => setSelectedDate(moment(selectedDate).add(delta, "day").toDate());
  const goToday = () => setSelectedDate(new Date());

  const plannerSummary = useMemo(() => getPlannerSummary(dateKey), [dateKey]);

  const entries = useMemo(() => {
    const list = Object.entries(diaryMap)
      .map(([k, v]) => ({ dateKey: k, ...v }))
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    if (!query.trim()) return list;

    const q = query.trim().toLowerCase();
    return list.filter((e) => {
      const moodLabel = MOODS.find((m) => m.id === e.mood)?.label || "";
      return (
        e.dateKey.includes(q) ||
        (e.summary || "").toLowerCase().includes(q) ||
        (e.detail || "").toLowerCase().includes(q) ||
        (e.gratitude || "").toLowerCase().includes(q) ||
        moodLabel.includes(q)
      );
    });
  }, [diaryMap, query]);

  const moodIconByDate = (date) => {
    const key = toDateKey(date);
    const entry = diaryMap[key];
    if (!entry) return null;
    const m = MOODS.find((x) => x.id === entry.mood);
    return m ? m.icon : "•";
  };

  return (
    <div className="screen daily-diary-screen">
      <div className="diary-top">
        <div className="diary-top__title">
          <h1 className="screen-header__title">데일리 다이어리</h1>
          <p className="text-muted font-small">오늘의 기분과 하루를 정리하는 공간입니다.</p>
        </div>

        <div className="diary-top__nav">
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => moveDay(-1)}>
            ←
          </button>

          <div className="diary-top__date">
            <div className="diary-top__dateText text-primary">
              {moment(selectedDate).format("YYYY. MM. D (ddd)")}
            </div>
            <button type="button" className="btn btn--sm btn--secondary" onClick={goToday}>
              오늘
            </button>
          </div>

          <button type="button" className="btn btn--sm btn--ghost" onClick={() => moveDay(1)}>
            →
          </button>

          <DatePicker
            selected={selectedDate}
            onChange={(d) => d && setSelectedDate(d)}
            dateFormat="yyyy-MM-dd"
            className="diary-date-input"
            placeholderText="해당 일자로 이동"
          />

          <div className="diary-viewTabs">
            <button
              type="button"
              className={"diary-viewTab " + (viewMode === "list" ? "is-active" : "")}
              onClick={() => setViewMode("list")}
            >
              목록
            </button>
            <button
              type="button"
              className={"diary-viewTab " + (viewMode === "calendar" ? "is-active" : "")}
              onClick={() => setViewMode("calendar")}
            >
              월간
            </button>
          </div>

          {/* ✅ 저장 버튼 추가 (dirty 전까지 비활성화) */}
          <button
            type="button"
            className={"btn btn--sm " + (isDirty ? "btn--primary" : "btn--secondary")}
            onClick={saveNow}
            disabled={!isDirty}
            title={!isDirty ? "변경 사항이 없습니다." : ""}
          >
            저장
          </button>

          <div className="text-muted font-small" style={{ marginLeft: 8 }}>
            {lastSavedAt ? `마지막 저장: ${moment(lastSavedAt).format("MM/DD HH:mm")}` : "저장 기록 없음"}
          </div>
        </div>
      </div>

      <div className="diary-layout">
        <div className="diary-editor">
          <section className="card">
            <h2 className="dashboard-card__title">오늘의 기분</h2>
            <p className="text-muted font-small mb-2">오늘 하루를 대표하는 기분을 선택하세요.</p>

            <div className="diary-mood-list">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={"diary-mood-item" + (mood === m.id ? " diary-mood-item--active" : "")}
                  onClick={() => setMood(m.id)}
                >
                  <span className="diary-mood-icon">{m.icon}</span>
                  <span className="diary-mood-label">{m.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="card">
            <h2 className="dashboard-card__title">플래너 요약</h2>
            <p className="text-muted font-small mb-2">선택 날짜의 Todo/Routine/Timeline 요약</p>

            {plannerSummary ? (
              <div className="diary-planSummary">
                <div className="diary-planSummary__row">
                  <div className="diary-kpi">
                    <div className="diary-kpi__label">Todo</div>
                    <div className="diary-kpi__value">
                      {plannerSummary.todoDone}/{plannerSummary.todoTotal}
                    </div>
                  </div>
                  <div className="diary-kpi">
                    <div className="diary-kpi__label">Routine</div>
                    <div className="diary-kpi__value">
                      {plannerSummary.routineDone}/{plannerSummary.routineTotal}
                    </div>
                  </div>
                  <div className="diary-kpi">
                    <div className="diary-kpi__label">Timeline</div>
                    <div className="diary-kpi__value">{plannerSummary.timelineCount}</div>
                  </div>
                </div>

                {plannerSummary.topTimeline?.length ? (
                  <div className="diary-planSummary__list">
                    {plannerSummary.topTimeline.map((t) => (
                      <div key={t.id} className="diary-planItem">
                        <div className="diary-planItem__title">{t.title}</div>
                        <div className="text-muted font-small">
                          {t.start}~{t.end} · {t.tag}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-muted font-small">해당 날짜의 플래너 데이터가 없습니다.</div>
            )}
          </section>

          <section className="card">
            <h2 className="dashboard-card__title">하루 한 줄 요약</h2>
            <textarea
              className="diary-textarea diary-textarea--summary"
              placeholder="오늘을 한 줄로 요약해보세요."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </section>

          <section className="card">
            <h2 className="dashboard-card__title">상세 기록</h2>
            <textarea
              className="diary-textarea"
              placeholder="오늘 있었던 일, 느낀 점, 배운 점 등을 자유롭게 기록해보세요."
              rows={8}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </section>

          <section className="card">
            <h2 className="dashboard-card__title">감사/되돌아보기</h2>
            <textarea
              className="diary-textarea"
              placeholder="오늘 감사했던 일이나 내일을 위한 다짐을 적어보세요."
              rows={4}
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
            />
          </section>
        </div>

        <div className="diary-side">
          <div className="card diary-side__head">
            <div className="diary-side__title">작성한 일기</div>
            <input
              className="field-input"
              placeholder="검색(날짜/내용/기분)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {viewMode === "calendar" ? (
            <div className="card diary-calendarCard">
              <Calendar
                value={selectedDate}
                onChange={(d) => {
                  const next = Array.isArray(d) ? d[0] : d;
                  if (next) setSelectedDate(next);
                }}
                tileContent={({ date, view }) => {
                  if (view !== "month") return null;
                  const icon = moodIconByDate(date);
                  if (!icon) return null;
                  return <div className="diary-calDot">{icon}</div>;
                }}
              />
              <div className="text-muted font-small diary-calendarHint">
                표시: 작성된 날짜에 기분 아이콘이 표시됩니다.
              </div>
            </div>
          ) : (
            <div className="card diary-listCard">
              {entries.length ? (
                <div className="diary-entryList">
                  {entries.map((e) => {
                    const m = MOODS.find((x) => x.id === e.mood);
                    return (
                      <button
                        type="button"
                        key={e.dateKey}
                        className={"diary-entryItem " + (e.dateKey === dateKey ? "is-active" : "")}
                        onClick={() => setSelectedDate(moment(e.dateKey, "YYYY-MM-DD").toDate())}
                      >
                        <div className="diary-entryItem__top">
                          <div className="diary-entryItem__date">{e.dateKey}</div>
                          <div className="diary-entryItem__mood">{m ? `${m.icon} ${m.label}` : ""}</div>
                        </div>
                        <div className="diary-entryItem__summary">{e.summary || "(요약 없음)"}</div>
                        <div className="text-muted font-small">
                          업데이트: {e.updatedAt ? moment(e.updatedAt).format("MM/DD HH:mm") : "-"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-muted font-small">아직 작성한 일기가 없습니다.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
