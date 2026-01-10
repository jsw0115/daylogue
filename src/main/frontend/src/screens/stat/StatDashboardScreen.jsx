// FILE : src/main/frontend/src/screens/stat/StatDashboardScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import "../../styles/screens/statDashboard.css";
import { safeStorage } from "../../shared/utils/safeStorage";

/**
 * 유틸
 */
function pad2(n) {
  const s = String(n);
  return s.length === 1 ? "0" + s : s;
}

function toISODate(d) {
  // 로컬 기준 yyyy-mm-dd
  const yy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  return `${yy}-${mm}-${dd}`;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function formatMin(min) {
  const m = Math.max(0, Math.round(min || 0));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h <= 0) return `${r}분`;
  if (r === 0) return `${h}시간`;
  return `${h}시간 ${r}분`;
}

function percent(part, total) {
  const t = total > 0 ? total : 0;
  if (t === 0) return 0;
  return Math.round((part / t) * 100);
}

/**
 * KPI 카드
 */
function KPI({ label, value, sub }) {
  return (
    <div className="kpi">
      <div className="kpi__label">{label}</div>
      <div className="kpi__value">{value}</div>
      {sub ? <div className="kpi__sub">{sub}</div> : null}
    </div>
  );
}

/**
 * Segmented Tabs
 */
function SegTabs({ value, onChange, items }) {
  return (
    <div className="segTabs" role="tablist" aria-label="통계 대시보드 탭">
      {items.map((it) => (
        <button
          key={it.value}
          type="button"
          className={"segTab " + (value === it.value ? "is-active" : "")}
          onClick={() => onChange(it.value)}
          role="tab"
          aria-selected={value === it.value}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Plan/Actual 토글
 */
function ModeToggle({ value, onChange }) {
  return (
    <div className="pillGroup" role="tablist" aria-label="Plan Actual 전환">
      <button
        type="button"
        className={"pill " + (value === "plan" ? "is-active" : "")}
        onClick={() => onChange("plan")}
        role="tab"
        aria-selected={value === "plan"}
      >
        Plan
      </button>
      <button
        type="button"
        className={"pill " + (value === "actual" ? "is-active" : "")}
        onClick={() => onChange("actual")}
        role="tab"
        aria-selected={value === "actual"}
      >
        Actual
      </button>
    </div>
  );
}

/**
 * 기간 선택(최근 7/30, 이번달, 커스텀)
 * - 실제 API 붙이면 rangeKey -> 서버 파라미터로 전달
 */
function RangePicker({ value, onChange, from, to, onChangeFrom, onChangeTo }) {
  return (
    <div className="rangeBar">
      <div className="pillGroup" aria-label="기간 선택">
        <button
          type="button"
          className={"pill " + (value === "7d" ? "is-active" : "")}
          onClick={() => onChange("7d")}
          aria-pressed={value === "7d"}
        >
          최근 7일
        </button>
        <button
          type="button"
          className={"pill " + (value === "30d" ? "is-active" : "")}
          onClick={() => onChange("30d")}
          aria-pressed={value === "30d"}
        >
          최근 30일
        </button>
        <button
          type="button"
          className={"pill " + (value === "month" ? "is-active" : "")}
          onClick={() => onChange("month")}
          aria-pressed={value === "month"}
        >
          이번 달
        </button>
        <button
          type="button"
          className={"pill " + (value === "custom" ? "is-active" : "")}
          onClick={() => onChange("custom")}
          aria-pressed={value === "custom"}
        >
          기간 지정
        </button>
      </div>

      {value === "custom" ? (
        <div className="rangeCustom">
          <label className="rangeCustom__label">
            시작
            <input type="date" value={from} onChange={(e) => onChangeFrom(e.target.value)} />
          </label>
          <label className="rangeCustom__label">
            종료
            <input type="date" value={to} onChange={(e) => onChangeTo(e.target.value)} />
          </label>
        </div>
      ) : null}
    </div>
  );
}

/**
 * 도넛(간단 CSS conic-gradient)
 */
function Donut({ slices, totalMin, selectedId, onSelect }) {
  const gradient = useMemo(() => {
    if (!slices || slices.length === 0) return "conic-gradient(#e5e7eb 0deg 360deg)";
    const t = totalMin > 0 ? totalMin : 0;
    if (t === 0) return "conic-gradient(#e5e7eb 0deg 360deg)";

    let cur = 0;
    const parts = slices.map((s) => {
      const deg = (s.min / t) * 360;
      const start = cur;
      const end = cur + deg;
      cur += deg;
      return `${s.color} ${start}deg ${end}deg`;
    });

    // 누적 오차 보정
    if (cur < 360) parts.push(`#e5e7eb ${cur}deg 360deg`);
    return `conic-gradient(${parts.join(", ")})`;
  }, [slices, totalMin]);

  return (
    <div className="donutWrap">
      <div className="donut" style={{ background: gradient }} aria-label="카테고리 도넛 차트">
        <div className="donut__hole">
          <div className="donut__centerLabel">총합</div>
          <div className="donut__centerValue">{formatMin(totalMin)}</div>
        </div>
      </div>

      <div className="donutLegend" aria-label="카테고리 범례">
        {(slices || []).map((s) => {
          const isActive = selectedId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              className={"legendItem " + (isActive ? "is-active" : "")}
              onClick={() => onSelect(isActive ? null : s.id)}
              title="클릭하면 드릴다운"
            >
              <span className="legendDot" style={{ background: s.color }} />
              <span className="legendName">{s.name}</span>
              <span className="legendMeta">
                {formatMin(s.min)} · {percent(s.min, totalMin)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 카테고리 리스트(정렬/드릴다운)
 */
function CategoryTable({ rows, totalMin, selectedId, onSelect, sortKey, sortDir, onChangeSort }) {
  function toggleSort(key) {
    if (key === sortKey) {
      onChangeSort(key, sortDir === "desc" ? "asc" : "desc");
      return;
    }
    onChangeSort(key, "desc");
  }

  return (
    <div className="catTable">
      <div className="catTable__head">
        <button type="button" className="catTh catTh--name" onClick={() => toggleSort("name")}>
          카테고리 {sortKey === "name" ? (sortDir === "desc" ? "▼" : "▲") : ""}
        </button>
        <button type="button" className="catTh" onClick={() => toggleSort("min")}>
          시간 {sortKey === "min" ? (sortDir === "desc" ? "▼" : "▲") : ""}
        </button>
        <button type="button" className="catTh" onClick={() => toggleSort("ratio")}>
          비율 {sortKey === "ratio" ? (sortDir === "desc" ? "▼" : "▲") : ""}
        </button>
        <button type="button" className="catTh" onClick={() => toggleSort("pva")}>
          달성률 {sortKey === "pva" ? (sortDir === "desc" ? "▼" : "▲") : ""}
        </button>
      </div>

      <div className="catTable__body">
        {rows.map((r) => {
          const isActive = selectedId === r.id;
          return (
            <button
              key={r.id}
              type="button"
              className={"catRow " + (isActive ? "is-active" : "")}
              onClick={() => onSelect(isActive ? null : r.id)}
            >
              <div className="catCell catCell--name">
                <span className="legendDot" style={{ background: r.color }} />
                <span className="catName">{r.name}</span>
              </div>
              <div className="catCell">{formatMin(r.min)}</div>
              <div className="catCell">{percent(r.min, totalMin)}%</div>
              <div className="catCell">{r.pva == null ? "NA" : `${r.pva}%`}</div>
            </button>
          );
        })}
        {rows.length === 0 ? <div className="emptyHint">표시할 카테고리가 없습니다.</div> : null}
      </div>
    </div>
  );
}

/**
 * 방해요인 태그(사전 + 커스텀)
 */
function TagPicker({ label, allTags, valueSet, onToggle, onAddCustom }) {
  const [custom, setCustom] = useState("");

  return (
    <div className="tagBox">
      <div className="tagBox__title">{label}</div>
      <div className="tagChips">
        {allTags.map((t) => {
          const active = valueSet.has(t);
          return (
            <button
              key={t}
              type="button"
              className={"chip " + (active ? "is-active" : "")}
              onClick={() => onToggle(t)}
              aria-pressed={active}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="tagAdd">
        <input
          className="tagAdd__input"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="태그 추가(예: 소음, 컨디션)"
          maxLength={20}
        />
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            const v = custom.trim();
            if (!v) return;
            onAddCustom(v);
            setCustom("");
          }}
        >
          추가
        </button>
      </div>
    </div>
  );
}

/**
 * 드릴다운 패널(선택 카테고리의 타임블록/Task 근거)
 */
function Drilldown({ selected, mode, items }) {
  if (!selected) return null;

  const tb = items?.timeblocks || [];
  const tasks = items?.tasks || [];

  return (
    <div className="card card--drill">
      <div className="card__title">
        드릴다운: <span className="badge">{selected.name}</span>
        <span className="text-muted font-small" style={{ marginLeft: 8 }}>
          (현재 보기: {mode === "plan" ? "Plan" : "Actual"})
        </span>
      </div>

      <div className="drillGrid">
        <div className="drillSection">
          <div className="drillSection__title">타임블록</div>
          {tb.length ? (
            <div className="drillList">
              {tb.map((x) => (
                <div key={x.id} className="drillItem">
                  <div className="drillItem__top">
                    <div className="drillItem__title">{x.title}</div>
                    <div className="drillItem__meta">
                      {x.start}~{x.end} · {formatMin(x.min)}
                    </div>
                  </div>
                  {x.memo ? <div className="drillItem__memo">{x.memo}</div> : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="emptyHint">근거 타임블록이 없습니다.</div>
          )}
        </div>

        <div className="drillSection">
          <div className="drillSection__title">할 일</div>
          {tasks.length ? (
            <div className="drillList">
              {tasks.map((t) => (
                <div key={t.id} className="drillItem">
                  <div className="drillItem__top">
                    <div className="drillItem__title">
                      {t.done ? "✓ " : ""}
                      {t.title}
                    </div>
                    <div className="drillItem__meta">
                      {t.done ? "완료" : "미완료"}
                      {t.estimateMin != null ? ` · 예상 ${formatMin(t.estimateMin)}` : ""}
                      {t.actualMin != null ? ` · 실행 ${formatMin(t.actualMin)}` : ""}
                    </div>
                  </div>
                  {t.note ? <div className="drillItem__memo">{t.note}</div> : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="emptyHint">근거 할 일이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * mock 데이터(안전한 기본값)
 * - 실제 API 붙이면 여기 구조 그대로 DTO로 맞추면 화면 변경량이 적음
 */
function getDefaultMock() {
  return {
    kpi: {
      planRate: 85,
      actionRate: 60,
      diaryRate: 95,
      focusMinWeek: 320,
      routineStreak: 7,
      taskDoneWeek: 18,
    },
    categories: [
      { id: "work", name: "업무", color: "#6366f1" },
      { id: "study", name: "공부", color: "#22c55e" },
      { id: "health", name: "운동", color: "#f97316" },
      { id: "life", name: "일상", color: "#06b6d4" },
      { id: "rest", name: "휴식", color: "#a3a3a3" },
    ],
    // 기간 합산(분)
    agg: {
      // categoryId -> { planMin, actualMin }
      work: { planMin: 780, actualMin: 640 },
      study: { planMin: 520, actualMin: 390 },
      health: { planMin: 240, actualMin: 210 },
      life: { planMin: 300, actualMin: 340 },
      rest: { planMin: 600, actualMin: 720 },
    },
    // 드릴다운 근거(예시): categoryId -> { plan: {timeblocks,tasks}, actual: {...} }
    drill: {
      work: {
        plan: {
          timeblocks: [
            { id: "p-w-1", title: "업무 계획: 이슈 정리", start: "09:00", end: "10:00", min: 60, memo: "" },
            { id: "p-w-2", title: "업무 계획: 개발", start: "10:30", end: "12:30", min: 120, memo: "" },
          ],
          tasks: [
            { id: "p-w-t1", title: "API 설계 정리", done: false, estimateMin: 60, actualMin: null, note: "" },
            { id: "p-w-t2", title: "리팩터링 계획", done: false, estimateMin: 45, actualMin: null, note: "" },
          ],
        },
        actual: {
          timeblocks: [
            { id: "a-w-1", title: "이슈 분석", start: "09:10", end: "10:05", min: 55, memo: "로그/재현 케이스 정리" },
            { id: "a-w-2", title: "개발", start: "10:40", end: "12:10", min: 90, memo: "테스트 포함" },
          ],
          tasks: [
            { id: "a-w-t1", title: "API 설계 정리", done: true, estimateMin: 60, actualMin: 70, note: "예상보다 조금 더 걸림" },
            { id: "a-w-t2", title: "리팩터링 계획", done: false, estimateMin: 45, actualMin: 15, note: "일부만 진행" },
          ],
        },
      },
      study: {
        plan: {
          timeblocks: [{ id: "p-s-1", title: "CS 정리", start: "20:00", end: "21:00", min: 60, memo: "" }],
          tasks: [{ id: "p-s-t1", title: "네트워크 복습", done: false, estimateMin: 40, actualMin: null, note: "" }],
        },
        actual: {
          timeblocks: [{ id: "a-s-1", title: "CS 정리", start: "20:10", end: "20:50", min: 40, memo: "" }],
          tasks: [{ id: "a-s-t1", title: "네트워크 복습", done: true, estimateMin: 40, actualMin: 35, note: "" }],
        },
      },
    },
    // PvsA 예시(기간 단위)
    pva: {
      // overall: { planMin, actualMin }
      overall: { planMin: 2440, actualMin: 2300 },
      // byCategory: categoryId -> { planMin, actualMin }
      byCategory: {
        work: { planMin: 780, actualMin: 640 },
        study: { planMin: 520, actualMin: 390 },
        health: { planMin: 240, actualMin: 210 },
        life: { planMin: 300, actualMin: 340 },
        rest: { planMin: 600, actualMin: 720 },
      },
      // 달성/미달성 목록 예시
      achieved: [{ id: "health", title: "운동", rate: 88 }],
      missed: [
        { id: "work", title: "업무", rate: 82 },
        { id: "study", title: "공부", rate: 75 },
      ],
    },
    // 관리자 통계(예시)
    admin: {
      dau: 120,
      mau: 860,
      retentionD7: 24,
      newUsers7d: 53,
      reports7d: 18,
      csOpen: 7,
    },
  };
}

/**
 * 기존 mock(구버전 shape)을 새 shape으로 흡수(호환)
 */
function normalizeMock(raw) {
  const d = getDefaultMock();
  if (!raw || typeof raw !== "object") return d;

  // 새 shape이면 그대로 병합
  if (raw.categories && raw.agg) {
    return {
      ...d,
      ...raw,
      kpi: { ...d.kpi, ...(raw.kpi || {}) },
      admin: { ...d.admin, ...(raw.admin || {}) },
    };
  }

  // 구버전(kpi만 있던 케이스) -> 기본값에 kpi만 덮어씀
  const hasOld =
    raw.planRate != null ||
    raw.actionRate != null ||
    raw.diaryRate != null ||
    raw.focusMinWeek != null ||
    raw.routineStreak != null ||
    raw.taskDoneWeek != null;

  if (hasOld) {
    return {
      ...d,
      kpi: {
        planRate: raw.planRate ?? d.kpi.planRate,
        actionRate: raw.actionRate ?? d.kpi.actionRate,
        diaryRate: raw.diaryRate ?? d.kpi.diaryRate,
        focusMinWeek: raw.focusMinWeek ?? d.kpi.focusMinWeek,
        routineStreak: raw.routineStreak ?? d.kpi.routineStreak,
        taskDoneWeek: raw.taskDoneWeek ?? d.kpi.taskDoneWeek,
      },
    };
  }

  return d;
}

export default function StatDashboardScreen() {
  // UI 상태(복원)
  const today = useMemo(() => toISODate(new Date()), []);
  const [tab, setTab] = useState(() => safeStorage.getItem("stats.ui.tab", "overview")); // overview | pva | focus | routine | task | admin
  const [mode, setMode] = useState(() => safeStorage.getItem("stats.ui.mode", "actual")); // plan | actual
  const [rangeKey, setRangeKey] = useState(() => safeStorage.getItem("stats.ui.range", "7d")); // 7d | 30d | month | custom
  const [from, setFrom] = useState(() => safeStorage.getItem("stats.ui.from", today));
  const [to, setTo] = useState(() => safeStorage.getItem("stats.ui.to", today));
  const [selectedCatId, setSelectedCatId] = useState(() => safeStorage.getItem("stats.ui.cat", "") || null);

  // 회고(부족/미룰 일) + 방해요인(태그): 날짜 단위 저장
  const reflectionKey = useMemo(() => `stats.reflection.${today}`, [today]);
  const [reflection, setReflection] = useState(() =>
    safeStorage.getJSON(reflectionKey, {
      부족_미룰일: "",
      방해요인: [],
      customTags: [],
    })
  );

  // mock 데이터
  const mock = useMemo(() => {
    const raw = safeStorage.getJSON("stats.mock", null);
    return normalizeMock(raw);
  }, []);

  // 권한(임시): auth.user.role === 'ADMIN' 이면 관리자 탭 활성
  const isAdmin = useMemo(() => {
    const u = safeStorage.getJSON("auth.user", null);
    return u?.role === "ADMIN";
  }, []);

  // UI 저장
  useEffect(() => safeStorage.setItem("stats.ui.tab", tab), [tab]);
  useEffect(() => safeStorage.setItem("stats.ui.mode", mode), [mode]);
  useEffect(() => safeStorage.setItem("stats.ui.range", rangeKey), [rangeKey]);
  useEffect(() => safeStorage.setItem("stats.ui.from", from), [from]);
  useEffect(() => safeStorage.setItem("stats.ui.to", to), [to]);
  useEffect(() => safeStorage.setItem("stats.ui.cat", selectedCatId || ""), [selectedCatId]);

  // 회고 저장
  useEffect(() => {
    safeStorage.setJSON(reflectionKey, reflection);
  }, [reflectionKey, reflection]);

  // 카테고리 + 합산 기반 rows 구성
  const derived = useMemo(() => {
    const cats = mock.categories || [];
    const agg = mock.agg || {};
    const rows = cats.map((c) => {
      const a = agg[c.id] || { planMin: 0, actualMin: 0 };
      const min = mode === "plan" ? a.planMin : a.actualMin;
      const pva =
        a.planMin > 0 ? Math.round((clamp(a.actualMin, 0, 10 ** 9) / a.planMin) * 100) : null;

      return {
        id: c.id,
        name: c.name,
        color: c.color || "#94a3b8",
        planMin: a.planMin || 0,
        actualMin: a.actualMin || 0,
        min,
        pva,
      };
    });

    const totalMin = rows.reduce((s, r) => s + (r.min || 0), 0);

    return { rows, totalMin };
  }, [mock, mode]);

  const [sortKey, setSortKey] = useState("min"); // name | min | ratio | pva
  const [sortDir, setSortDir] = useState("desc");

  const sortedRows = useMemo(() => {
    const arr = [...(derived.rows || [])];
    const total = derived.totalMin || 0;

    function getVal(r) {
      if (sortKey === "name") return r.name;
      if (sortKey === "min") return r.min;
      if (sortKey === "ratio") return total > 0 ? r.min / total : 0;
      if (sortKey === "pva") return r.pva == null ? -1 : r.pva;
      return r.min;
    }

    arr.sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);

      // 문자열
      if (typeof va === "string" && typeof vb === "string") {
        return sortDir === "desc" ? vb.localeCompare(va) : va.localeCompare(vb);
      }

      // 숫자
      const na = Number(va);
      const nb = Number(vb);
      if (Number.isNaN(na) || Number.isNaN(nb)) return 0;
      return sortDir === "desc" ? nb - na : na - nb;
    });

    return arr;
  }, [derived.rows, derived.totalMin, sortKey, sortDir]);

  const slices = useMemo(() => {
    return sortedRows.map((r) => ({ id: r.id, name: r.name, min: r.min, color: r.color }));
  }, [sortedRows]);

  const selectedCat = useMemo(() => {
    if (!selectedCatId) return null;
    const found = (derived.rows || []).find((x) => x.id === selectedCatId);
    return found || null;
  }, [derived.rows, selectedCatId]);

  const drillItems = useMemo(() => {
    if (!selectedCat) return null;
    const d = mock.drill?.[selectedCat.id];
    if (!d) return { timeblocks: [], tasks: [] };
    const pack = mode === "plan" ? d.plan : d.actual;
    return {
      timeblocks: pack?.timeblocks || [],
      tasks: pack?.tasks || [],
    };
  }, [mock, selectedCat, mode]);

  // 방해요인 태그 사전 + 커스텀
  const baseObstacleTags = useMemo(
    () => ["피곤", "회의", "돌발", "집중력저하", "컨디션", "연락/가족", "환경(소음)", "계획과다"],
    []
  );
  const allObstacleTags = useMemo(() => {
    const custom = Array.isArray(reflection.customTags) ? reflection.customTags : [];
    const merged = [...baseObstacleTags];
    for (const t of custom) if (t && !merged.includes(t)) merged.push(t);
    return merged;
  }, [baseObstacleTags, reflection.customTags]);

  const obstacleSet = useMemo(() => new Set(reflection.방해요인 || []), [reflection.방해요인]);

  // PvsA 계산(기간/카테고리별)
  const pvaView = useMemo(() => {
    const p = mock.pva || {};
    const overall = p.overall || { planMin: 0, actualMin: 0 };
    const overallRate =
      overall.planMin > 0 ? Math.round((overall.actualMin / overall.planMin) * 100) : null;

    const by = p.byCategory || {};
    const catRates = (mock.categories || []).map((c) => {
      const v = by[c.id] || { planMin: 0, actualMin: 0 };
      const rate = v.planMin > 0 ? Math.round((v.actualMin / v.planMin) * 100) : null;
      return {
        id: c.id,
        name: c.name,
        color: c.color || "#94a3b8",
        planMin: v.planMin || 0,
        actualMin: v.actualMin || 0,
        rate,
      };
    });

    return {
      overall,
      overallRate,
      achieved: p.achieved || [],
      missed: p.missed || [],
      catRates,
    };
  }, [mock]);

  const tabs = useMemo(() => {
    const base = [
      { value: "overview", label: "개요" },
      { value: "pva", label: "PvsA" },
      { value: "focus", label: "포커스" },
      { value: "routine", label: "루틴" },
      { value: "task", label: "할 일" },
      { value: "admin", label: "관리자" },
    ];
    return base;
  }, []);

  return (
    <div className="screen statDash">
      <div className="screen-header">
        <div className="screen-header__left">
          <div>
            <h1 className="screen-header__title">통합 통계 대시보드</h1>
            <p className="text-muted font-small">Plan/Actual, PvsA, 포커스·루틴·할 일을 한 곳에서 확인</p>
          </div>

          <div className="screen-header__tools">
            <RangePicker
              value={rangeKey}
              onChange={(k) => {
                setRangeKey(k);
                // 기간 전환 시 선택 카테고리 유지/해제는 취향인데, 여기서는 유지
              }}
              from={from}
              to={to}
              onChangeFrom={setFrom}
              onChangeTo={setTo}
            />
          </div>
        </div>

        <SegTabs value={tab} onChange={setTab} items={tabs} />
      </div>

      {/* OVERVIEW: STAT-001 느낌의 핵심 UI(Plan/Actual + 도넛/리스트/드릴다운 + 회고/방해요인) */}
      {tab === "overview" ? (
        <>
          <div className="topBar">
            <ModeToggle
              value={mode}
              onChange={(m) => {
                setMode(m);
                // mode 바뀌면 기존 선택 카테고리가 의미 없을 수 있어도 UX상 유지
              }}
            />
            <div className="topBar__hint text-muted font-small">
              기간: {rangeKey === "7d" ? "최근 7일" : rangeKey === "30d" ? "최근 30일" : rangeKey === "month" ? "이번 달" : `${from} ~ ${to}`}
              <span className="dotSep">·</span>
              기준일(회고 저장): {today}
            </div>
          </div>

          <div className="kpiRow">
            <KPI label="PLAN 달성률" value={`${mock.kpi.planRate}%`} sub="기간 기준(요약)" />
            <KPI label="ACTION 완료율" value={`${mock.kpi.actionRate}%`} sub="기간 기준(요약)" />
            <KPI label="DIARY 작성율" value={`${mock.kpi.diaryRate}%`} sub="기간 기준(요약)" />
          </div>

          <div className="card">
            <div className="card__title">기간 내 시간 사용 분포</div>
            <div className="split">
              <div>
                <Donut
                  slices={slices}
                  totalMin={derived.totalMin}
                  selectedId={selectedCatId}
                  onSelect={setSelectedCatId}
                />
              </div>

              <div>
                <CategoryTable
                  rows={sortedRows}
                  totalMin={derived.totalMin}
                  selectedId={selectedCatId}
                  onSelect={setSelectedCatId}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onChangeSort={(k, d) => {
                    setSortKey(k);
                    setSortDir(d);
                  }}
                />

                <div className="text-muted font-small" style={{ marginTop: 10 }}>
                  TODO(API): /api/stats/category(집계), /api/stats/drilldown(근거 리스트), /api/stats/plan-actual(PvsA)
                </div>
              </div>
            </div>
          </div>

          <Drilldown selected={selectedCat} mode={mode} items={drillItems} />

          <div className="card">
            <div className="card__title">부족/미룰 일 (회고)</div>
            <div className="text-muted font-small" style={{ marginBottom: 10 }}>
              STAT-001-F05 / DIARY-002와 데이터 공유 가능하도록 날짜 단위로 저장합니다.
            </div>

            <textarea
              className="memoArea"
              value={reflection.부족_미룰일 || ""}
              onChange={(e) =>
                setReflection((prev) => ({
                  ...prev,
                  부족_미룰일: e.target.value,
                }))
              }
              placeholder="오늘 부족했던 점 / 미룬 일 / 내일 한 줄 계획을 간단히 적어두세요."
              rows={4}
              maxLength={600}
            />

            <div className="hr" />

            <TagPicker
              label="방해요인 태깅 (Plan 실패 원인)"
              allTags={allObstacleTags}
              valueSet={obstacleSet}
              onToggle={(t) => {
                setReflection((prev) => {
                  const cur = new Set(prev.방해요인 || []);
                  if (cur.has(t)) cur.delete(t);
                  else cur.add(t);
                  return { ...prev, 방해요인: Array.from(cur) };
                });
              }}
              onAddCustom={(t) => {
                setReflection((prev) => {
                  const cur = Array.isArray(prev.customTags) ? [...prev.customTags] : [];
                  if (!cur.includes(t)) cur.push(t);
                  return { ...prev, customTags: cur };
                });
              }}
            />
          </div>
        </>
      ) : null}

      {/* PVA: STAT-003 */}
      {tab === "pva" ? (
        <div className="card">
          <div className="card__title">Plan vs Actual (달성률)</div>

          <div className="kpiRow">
            <KPI
              label="전체 달성률"
              value={pvaView.overallRate == null ? "NA" : `${pvaView.overallRate}%`}
              sub={`Plan ${formatMin(pvaView.overall.planMin)} / Actual ${formatMin(pvaView.overall.actualMin)}`}
            />
            <KPI label="달성 항목" value={`${(pvaView.achieved || []).length}개`} sub="자동 분류(예시)" />
            <KPI label="미달성 항목" value={`${(pvaView.missed || []).length}개`} sub="사유 기록 유도" />
          </div>

          <div className="pvaGrid">
            <div className="pvaPanel">
              <div className="pvaPanel__title">카테고리별 달성률</div>
              <div className="pvaRows">
                {pvaView.catRates.map((c) => (
                  <div key={c.id} className="pvaRow">
                    <div className="pvaRow__left">
                      <span className="legendDot" style={{ background: c.color }} />
                      <div>
                        <div className="pvaName">{c.name}</div>
                        <div className="pvaSub text-muted font-small">
                          Plan {formatMin(c.planMin)} · Actual {formatMin(c.actualMin)}
                        </div>
                      </div>
                    </div>
                    <div className="pvaRow__right">
                      <span className="badge">{c.rate == null ? "NA" : `${c.rate}%`}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pvaPanel">
              <div className="pvaPanel__title">달성/미달성 목록</div>

              <div className="pvaLists">
                <div>
                  <div className="pvaLists__head">달성</div>
                  {(pvaView.achieved || []).length ? (
                    <div className="simpleList">
                      {pvaView.achieved.map((x) => (
                        <div key={x.id} className="simpleItem">
                          <span>{x.title}</span>
                          <span className="badge">{x.rate}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="emptyHint">달성 항목이 없습니다.</div>
                  )}
                </div>

                <div>
                  <div className="pvaLists__head">미달성</div>
                  {(pvaView.missed || []).length ? (
                    <div className="simpleList">
                      {pvaView.missed.map((x) => (
                        <div key={x.id} className="simpleItem">
                          <span>{x.title}</span>
                          <span className="badge badge--warn">{x.rate}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="emptyHint">미달성 항목이 없습니다.</div>
                  )}

                  <div className="text-muted font-small" style={{ marginTop: 10 }}>
                    TODO: 미달성 사유 기록(PVA-001-F05) 모달/패널 연동, DIARY-002 링크
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-muted font-small" style={{ marginTop: 12 }}>
            TODO(API): /api/stats/pva, /api/stats/obstacles(추이), /api/stats/pva/reasons
          </div>
        </div>
      ) : null}

      {/* FOCUS: STAT-004-F01 */}
      {tab === "focus" ? (
        <div className="card">
          <div className="card__title">포커스 리포트</div>
          <div className="kpiRow">
            <KPI label="이번 주 집중 시간" value={`${mock.kpi.focusMinWeek}분`} sub="포모도로/세션 합산" />
            <KPI label="가장 많이 집중한 요일" value="수요일" sub="TODO: API" />
            <KPI label="세션 완료율" value="72%" sub="TODO: API" />
          </div>
          <div className="text-muted font-small">TODO(API): /api/stats/focus</div>
        </div>
      ) : null}

      {/* ROUTINE: STAT-004-F02 일부 */}
      {tab === "routine" ? (
        <div className="card">
          <div className="card__title">루틴 (갓생/루틴 리포트)</div>
          <div className="kpiRow">
            <KPI label="연속 스트릭" value={`${mock.kpi.routineStreak}일`} sub="최대/현재/이번주" />
            <KPI label="완료율" value="68%" sub="TODO: API" />
            <KPI label="상위 루틴" value="Morning Stretch" sub="TODO: API" />
          </div>
          <div className="text-muted font-small">TODO(API): /api/stats/routine, /api/stats/badges</div>
        </div>
      ) : null}

      {/* TASK */}
      {tab === "task" ? (
        <div className="card">
          <div className="card__title">할 일</div>
          <div className="kpiRow">
            <KPI label="이번 주 완료" value={`${mock.kpi.taskDoneWeek}개`} sub="완료/생성 추이" />
            <KPI label="미뤄짐" value="3개" sub="TODO: API" />
            <KPI label="평균 소요" value="32분" sub="TODO: API" />
          </div>
          <div className="text-muted font-small">TODO(API): /api/stats/tasks</div>
        </div>
      ) : null}

      {/* ADMIN */}
      {tab === "admin" ? (
        <div className="card">
          <div className="card__title">관리자 통계 / 운영 요약</div>

          {!isAdmin ? (
            <div className="emptyHint">
              이 탭은 관리자 권한이 필요합니다. (임시 가드: localStorage의 auth.user.role === "ADMIN")
            </div>
          ) : (
            <>
              <div className="kpiRow">
                <KPI label="DAU" value={`${mock.admin.dau}`} sub="일간 활성 사용자(예시)" />
                <KPI label="MAU" value={`${mock.admin.mau}`} sub="월간 활성 사용자(예시)" />
                <KPI label="D7 리텐션" value={`${mock.admin.retentionD7}%`} sub="코호트(예시)" />
              </div>

              <div className="kpiRow">
                <KPI label="최근 7일 신규가입" value={`${mock.admin.newUsers7d}`} sub="TODO: API" />
                <KPI label="최근 7일 신고" value={`${mock.admin.reports7d}`} sub="커뮤니티 신고 큐" />
                <KPI label="CS 미처리" value={`${mock.admin.csOpen}`} sub="OPEN 티켓" />
              </div>

              <div className="text-muted font-small">
                TODO(API): /api/admin/kpi(dau/mau/retention), /api/admin/reports(queue), /api/admin/cs(open), /api/admin/audit
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
