// FILE: src/main/frontend/src/screens/stats/CompareStatsScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import { statsApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";
import "../../styles/compare-stats.css";

import Drawer from "@mui/material/Drawer";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";

import * as Tabs from "@radix-ui/react-tabs";
import { X, RefreshCw, Search, Filter, ArrowDownUp, Save } from "lucide-react";

/** =========================
 *  Utils
 *  ========================= */
function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function parseYmd(ymd) {
  // local date (00:00)
  const [y, m, d] = (ymd || "").split("-").map((v) => Number(v));
  return new Date(y, (m || 1) - 1, d || 1);
}

function toYmd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getRange(period, baseYmd) {
  const base = parseYmd(baseYmd);
  if (period === "DAY") {
    const d = toYmd(base);
    return { start: d, end: d, days: [d], label: d };
  }
  if (period === "WEEK") {
    // ISO-ish: Monday start
    const day = base.getDay(); // 0 Sun ... 6 Sat
    const diffToMon = (day + 6) % 7; // Mon=0
    const start = addDays(base, -diffToMon);
    const days = Array.from({ length: 7 }, (_, i) => toYmd(addDays(start, i)));
    return { start: days[0], end: days[6], days, label: `${days[0]} ~ ${days[6]}` };
  }
  if (period === "MONTH") {
    const start = new Date(base.getFullYear(), base.getMonth(), 1);
    const end = new Date(base.getFullYear(), base.getMonth() + 1, 0);
    const days = [];
    for (let d = new Date(start); d <= end; d = addDays(d, 1)) days.push(toYmd(d));
    return { start: toYmd(start), end: toYmd(end), days, label: `${toYmd(start)} ~ ${toYmd(end)}` };
  }
  // YEAR
  const start = new Date(base.getFullYear(), 0, 1);
  const end = new Date(base.getFullYear(), 11, 31);
  const days = [];
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) days.push(toYmd(d));
  return { start: toYmd(start), end: toYmd(end), days, label: `${toYmd(start)} ~ ${toYmd(end)}` };
}

function minutesToHhmm(min) {
  const m = Math.max(0, Math.round(min));
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h}h ${String(mm).padStart(2, "0")}m`;
}

function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/** localStorage 접근이 차단된 환경 대비(try/catch + 메모리 폴백) */
const __memStore = new Map();
function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return __memStore.get(key) ?? null;
  }
}
function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return { ok: true, persisted: true };
  } catch {
    __memStore.set(key, value);
    return { ok: true, persisted: false };
  }
}

/** Deterministic RNG (드릴다운 더미 데이터 고정용) */
function lcg(seed) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < (str || "").length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function statusFromDelta(deltaMin) {
  if (deltaMin >= 30) return "OVER";
  if (deltaMin <= -30) return "UNDER";
  return "ONTRACK";
}

function statusLabel(st) {
  if (st === "OVER") return "초과";
  if (st === "UNDER") return "미달";
  return "양호";
}

function statusTone(st) {
  if (st === "OVER") return "pva-pill--over";
  if (st === "UNDER") return "pva-pill--under";
  return "pva-pill--ok";
}

/** =========================
 *  Drilldown Dummy Builder
 *  - 실제 서비스에서는 서버 drilldown API로 대체
 *  ========================= */
function buildDrilldown({ row, period, baseDate, actualMode }) {
  const range = getRange(period, baseDate);
  const seed = hashStr(`${row.id}|${period}|${baseDate}|${actualMode}`);
  const rnd = lcg(seed);

  const planTotalMin = Math.max(0, Math.round((row.planHours || 0) * 60));
  const actualTotalMin = Math.max(0, Math.round((row.actualHours || 0) * 60));

  // 일자별 분배(더미)
  const weights = range.days.map(() => 0.4 + rnd() * 1.2); // 0.4~1.6
  const wsum = weights.reduce((a, b) => a + b, 0) || 1;

  const daily = range.days.map((d, i) => {
    const w = weights[i] / wsum;
    const planMin = Math.round(planTotalMin * w);
    const actualMin = Math.round(actualTotalMin * w);
    return { date: d, planMin, actualMin, deltaMin: actualMin - planMin };
  });

  // 항목 생성(더미)
  const itemCount = clamp(Math.floor(8 + rnd() * 10), 6, 18);
  const types = ["TASK", "EVENT", "TIMEBLOCK"];
  const obstaclePool = ["회의", "돌발", "피곤", "집중저하", "우선순위변경", "외부요청", "장애/이슈", "미루기"];

  const items = [];
  for (let i = 0; i < itemCount; i++) {
    const day = range.days[Math.floor(rnd() * range.days.length)];
    const t = types[Math.floor(rnd() * types.length)];
    const planned = t === "TIMEBLOCK" ? Math.floor(30 + rnd() * 120) : Math.floor(15 + rnd() * 90);
    // actualMode: DONE | TIME | HYBRID
    // - DONE: “완료” 중심이라 실제 시간이 0/계획만, 또는 완료면 계획과 비슷하게
    // - TIME: timeblock 중심이라 실제 시간 랜덤
    // - HYBRID: 섞음
    let actual = 0;
    if (actualMode === "DONE") {
      const done = rnd() > 0.35;
      actual = done ? clamp(planned + Math.floor(-20 + rnd() * 45), 0, 240) : 0;
    } else if (actualMode === "TIME") {
      actual = clamp(planned + Math.floor(-30 + rnd() * 90), 0, 300);
    } else {
      const style = rnd();
      if (style < 0.4) actual = 0;
      else actual = clamp(planned + Math.floor(-25 + rnd() * 80), 0, 300);
    }

    const delta = actual - planned;
    const st = statusFromDelta(delta);

    items.push({
      id: `it_${row.id}_${i}`,
      date: day,
      type: t,
      title: `${row.name} · 항목 ${i + 1}`,
      planMin: planned,
      actualMin: actual,
      deltaMin: delta,
      status: st,
      // 회고용(초기값 더미)
      obstacles: st === "UNDER" ? [obstaclePool[Math.floor(rnd() * obstaclePool.length)]] : [],
      note: "",
      nextAction: "",
    });
  }

  // Top 편차(절대값 기준)
  const topDeviations = [...items]
    .sort((a, b) => Math.abs(b.deltaMin) - Math.abs(a.deltaMin))
    .slice(0, 5);

  return { range, daily, items, topDeviations };
}

/** =========================
 *  Main Screen
 *  ========================= */
export default function CompareStatsScreen() {
  // Period / BaseDate
  const [period, setPeriod] = useState("WEEK"); // DAY | WEEK | MONTH | YEAR
  const [baseDate, setBaseDate] = useState(todayStr());

  // Granularity
  const [groupBy, setGroupBy] = useState("CATEGORY"); // CATEGORY | CATEGORY_SUB | TYPE
  const [actualMode, setActualMode] = useState("HYBRID"); // DONE | TIME | HYBRID

  // Filters / Sorting
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | UNDER | ONTRACK | OVER
  const [sortKey, setSortKey] = useState("DELTA_DESC"); // RATE_DESC | DELTA_DESC | PLAN_DESC | ACTUAL_DESC

  // Data
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // Drilldown
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [drill, setDrill] = useState(null);
  const [drillTab, setDrillTab] = useState("summary");

  // Reflection (persist)
  const [reflect, setReflect] = useState({
    tags: [],
    note: "",
    nextActions: ["", "", ""],
  });
  const [persistHint, setPersistHint] = useState(null);

  // Toast
  const [toast, setToast] = useState({ open: false, type: "info", msg: "" });
  const showToast = (type, msg) => setToast({ open: true, type, msg });

  async function load() {
    setLoading(true);
    try {
      const d = await statsApi.getCompare({ period, baseDate });
      setData(d);
    } catch (e) {
      showToast("error", `불러오기 실패: ${String(e?.message || e)}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // 기존 동작 유지: 기간 변경 시 자동 로드
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const summary = useMemo(() => {
    if (!data) return null;
    const plan = data.summary.planTotal || 0;
    const actual = data.summary.actualTotal || 0;
    const rate = plan === 0 ? 0 : Math.round((actual / plan) * 100);
    const delta = (actual - plan) * 60; // hours->min? (data는 hours 기준)
    return { plan, actual, rate, deltaMin: delta };
  }, [data]);

  const derivedRows = useMemo(() => {
    if (!data?.rows) return [];

    // groupBy 확장(더미): CATEGORY_SUB, TYPE은 화면 개발용으로 분해
    let rows = data.rows.map((r) => ({
      ...r,
      planMin: Math.round((r.planHours || 0) * 60),
      actualMin: Math.round((r.actualHours || 0) * 60),
      deltaMin: Math.round(((r.actualHours || 0) - (r.planHours || 0)) * 60),
      status: statusFromDelta(((r.actualHours || 0) - (r.planHours || 0)) * 60),
    }));

    if (groupBy === "CATEGORY_SUB") {
      const expanded = [];
      rows.forEach((r) => {
        const seed = hashStr(`sub|${r.id}`);
        const rnd = lcg(seed);
        const aRatio = 0.35 + rnd() * 0.4; // 0.35~0.75
        const bRatio = 1 - aRatio;

        const a = {
          ...r,
          id: `${r.id}_subA`,
          name: `${r.name} · 하위A`,
          planMin: Math.round(r.planMin * aRatio),
          actualMin: Math.round(r.actualMin * aRatio),
        };
        a.deltaMin = a.actualMin - a.planMin;
        a.status = statusFromDelta(a.deltaMin);

        const b = {
          ...r,
          id: `${r.id}_subB`,
          name: `${r.name} · 하위B`,
          planMin: Math.round(r.planMin * bRatio),
          actualMin: Math.round(r.actualMin * bRatio),
        };
        b.deltaMin = b.actualMin - b.planMin;
        b.status = statusFromDelta(b.deltaMin);

        expanded.push(a, b);
      });
      rows = expanded;
    }

    if (groupBy === "TYPE") {
      const expanded = [];
      const buckets = [
        { k: "TASK", label: "Task", icon: "✅" },
        { k: "EVENT", label: "Event", icon: "🗓️" },
        { k: "TIMEBLOCK", label: "TimeBlock", icon: "⏱️" },
      ];
      rows.forEach((r) => {
        const seed = hashStr(`type|${r.id}`);
        const rnd = lcg(seed);

        const splits = [0.2 + rnd() * 0.5, 0.15 + rnd() * 0.45, 0.15 + rnd() * 0.45];
        const sum = splits.reduce((a, b) => a + b, 0) || 1;
        const ratios = splits.map((x) => x / sum);

        buckets.forEach((b, idx) => {
          const planMin = Math.round(r.planMin * ratios[idx]);
          const actualMin = Math.round(r.actualMin * ratios[idx]);
          const deltaMin = actualMin - planMin;
          expanded.push({
            ...r,
            id: `${r.id}_${b.k}`,
            name: `${r.name} · ${b.label}`,
            icon: b.icon,
            planMin,
            actualMin,
            deltaMin,
            status: statusFromDelta(deltaMin),
            __type: b.k,
          });
        });
      });
      rows = expanded;
    }

    // filters
    const qq = q.trim().toLowerCase();
    if (qq) rows = rows.filter((r) => (r.name || "").toLowerCase().includes(qq));

    if (statusFilter !== "ALL") rows = rows.filter((r) => r.status === statusFilter);

    // sort
    const sorted = [...rows];
    sorted.sort((a, b) => {
      if (sortKey === "RATE_DESC") return (b.rate || 0) - (a.rate || 0);
      if (sortKey === "PLAN_DESC") return (b.planMin || 0) - (a.planMin || 0);
      if (sortKey === "ACTUAL_DESC") return (b.actualMin || 0) - (a.actualMin || 0);
      // DELTA_DESC (abs delta)
      return Math.abs(b.deltaMin || 0) - Math.abs(a.deltaMin || 0);
    });

    return sorted;
  }, [data, groupBy, q, statusFilter, sortKey]);

  function openDrilldown(row) {
    setSelectedRow(row);
    setDrill(buildDrilldown({ row, period, baseDate, actualMode }));
    setDrillTab("summary");
    setDrawerOpen(true);

    // 회고 데이터 로드
    const key = `pva_reflection_v1|${period}|${baseDate}|${row.id}`;
    const saved = safeJsonParse(safeStorageGet(key), null);
    if (saved) {
      setReflect({
        tags: Array.isArray(saved.tags) ? saved.tags : [],
        note: saved.note || "",
        nextActions: Array.isArray(saved.nextActions) ? saved.nextActions : ["", "", ""],
      });
      setPersistHint(saved.__persisted === false ? "이 환경에서는 저장이 제한될 수 있습니다." : null);
    } else {
      setReflect({ tags: [], note: "", nextActions: ["", "", ""] });
      setPersistHint(null);
    }
  }

  function closeDrilldown() {
    setDrawerOpen(false);
    setSelectedRow(null);
    setDrill(null);
    setPersistHint(null);
  }

  function toggleTag(tag) {
    setReflect((prev) => {
      const has = prev.tags.includes(tag);
      const tags = has ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag];
      return { ...prev, tags };
    });
  }

  function saveReflection() {
    if (!selectedRow) return;
    const key = `pva_reflection_v1|${period}|${baseDate}|${selectedRow.id}`;
    const payload = {
      tags: reflect.tags,
      note: reflect.note,
      nextActions: reflect.nextActions,
      updatedAt: new Date().toISOString(),
    };
    const raw = JSON.stringify(payload);
    const res = safeStorageSet(key, raw);
    setPersistHint(res.persisted ? null : "이 환경에서는 localStorage 접근이 막혀 새로고침 시 유실될 수 있습니다.");
    showToast("success", res.persisted ? "회고가 저장되었습니다." : "회고가 임시 저장되었습니다(새로고침 시 유실 가능).");
  }

  function exportDrilldownJson() {
    if (!selectedRow || !drill) return;
    const out = {
      meta: { period, baseDate, groupBy, actualMode, category: { id: selectedRow.id, name: selectedRow.name } },
      summary: {
        planMin: selectedRow.planMin,
        actualMin: selectedRow.actualMin,
        deltaMin: selectedRow.deltaMin,
        rate: selectedRow.rate,
      },
      drill,
      reflection: reflect,
    };
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pva_${period}_${baseDate}_${selectedRow.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const rangeLabel = useMemo(() => getRange(period, baseDate).label, [period, baseDate]);

  return (
    <div className="tf-page">
      {/* Header */}
      <div className="tf-page__header">
        <div>
          <div className="tf-title">비교 분석 (Plan vs Actual)</div>
          <div className="tf-subtitle">
            {rangeLabel} · 그룹 {groupBy} · Actual 기준 {actualMode}
          </div>
        </div>

        <div className="tf-actions pva-actions">
          <button className="tf-btn" onClick={load} disabled={loading}>
            <RefreshCw size={16} style={{ marginRight: 6 }} />
            새로고침
          </button>
        </div>
      </div>

      {/* Top Controls */}
      <div className="pva-top tf-card">
        <div className="pva-top__row">
          <div className="pva-top__left">
            <div className="pva-label">기간</div>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={period}
              onChange={(_, v) => v && setPeriod(v)}
              className="pva-toggle"
            >
              <ToggleButton value="DAY">일</ToggleButton>
              <ToggleButton value="WEEK">주</ToggleButton>
              <ToggleButton value="MONTH">월</ToggleButton>
              <ToggleButton value="YEAR">년</ToggleButton>
            </ToggleButtonGroup>

            <div className="pva-label" style={{ marginLeft: 12 }}>
              기준일
            </div>
            <TextField
              size="small"
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="pva-date"
              inputProps={{ "aria-label": "base-date" }}
            />
            <button className="tf-btn tf-btn--primary" onClick={load} disabled={loading} style={{ marginLeft: 8 }}>
              적용
            </button>
          </div>

          <div className="pva-top__right">
            <div className="pva-kpi">
              <div className="pva-kpi__title">요약</div>
              <div className="pva-kpi__value">
                {summary
                  ? `Plan ${summary.plan}h · Actual ${summary.actual}h · 달성률 ${summary.rate}%`
                  : loading
                    ? "불러오는 중..."
                    : "—"}
              </div>
              <div className="pva-kpi__hint">
                근거 부족: 현재 수치는 화면 검증용 더미이며, 실제 서비스에서는 서버 집계가 필요합니다.
              </div>
            </div>
          </div>
        </div>

        <Divider style={{ margin: "12px 0" }} />

        <div className="pva-top__row">
          <div className="pva-top__left">
            <div className="pva-label">그룹</div>
            <select className="tf-select pva-select" value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
              <option value="CATEGORY">카테고리</option>
              <option value="CATEGORY_SUB">카테고리 + 하위(더미)</option>
              <option value="TYPE">타입(Task/Event/Block 더미)</option>
            </select>

            <div className="pva-label" style={{ marginLeft: 12 }}>
              Actual 기준
            </div>
            <select className="tf-select pva-select" value={actualMode} onChange={(e) => setActualMode(e.target.value)}>
              <option value="HYBRID">하이브리드(추천)</option>
              <option value="DONE">완료 기반(DONE)</option>
              <option value="TIME">시간 기반(TimeBlock)</option>
            </select>

            <Tooltip title="정렬/필터/검색">
              <span className="pva-iconbar">
                <Filter size={16} />
              </span>
            </Tooltip>

            <div className="pva-search">
              <Search size={16} />
              <input
                className="pva-search__input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="카테고리 검색"
              />
            </div>
          </div>

          <div className="pva-top__right pva-right-controls">
            <div className="pva-label">상태</div>
            <select className="tf-select pva-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">전체</option>
              <option value="UNDER">미달</option>
              <option value="ONTRACK">양호</option>
              <option value="OVER">초과</option>
            </select>

            <div className="pva-label" style={{ marginLeft: 12 }}>
              정렬
            </div>
            <select className="tf-select pva-select" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
              <option value="DELTA_DESC">편차(|Δ|) 큰 순</option>
              <option value="RATE_DESC">달성률 높은 순</option>
              <option value="PLAN_DESC">Plan 큰 순</option>
              <option value="ACTUAL_DESC">Actual 큰 순</option>
            </select>

            <span className="pva-iconbar" title="정렬 기준 안내">
              <ArrowDownUp size={16} />
            </span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="tf-grid" style={{ marginTop: 12 }}>
        <div className="tf-col-12 tf-card">
          <div className="pva-list-head">
            <div className="pva-list-head__left">그룹별 비교</div>
            <div className="pva-list-head__right">{loading && <CircularProgress size={16} />}</div>
          </div>

          <div className="tf-divider" />

          {!data ? (
            <div className="tf-muted tf-small">{loading ? "불러오는 중..." : "데이터가 없습니다."}</div>
          ) : derivedRows.length === 0 ? (
            <div className="tf-muted tf-small">조건에 맞는 항목이 없습니다.</div>
          ) : (
            <div className="pva-list">
              {derivedRows.map((r) => {
                const rate = clamp(r.rate || 0, 0, 200);
                const width = clamp(rate, 0, 100);
                const deltaMin = r.deltaMin || 0;
                const st = r.status;

                return (
                  <div key={r.id} className="pva-row" onClick={() => openDrilldown(r)} role="button" tabIndex={0}>
                    <div className="pva-row__left">
                      <div className="pva-row__title">
                        <span className="pva-row__icon">{r.icon || "🏷️"}</span>
                        <span className="pva-row__name">{r.name}</span>
                      </div>

                      <div className="pva-row__meta">
                        <span className="pva-mchip">Plan {minutesToHhmm(r.planMin)}</span>
                        <span className="pva-mchip">Actual {minutesToHhmm(r.actualMin)}</span>
                        <span className="pva-mchip">Δ {minutesToHhmm(deltaMin)}</span>
                        <span className={`pva-pill ${statusTone(st)}`}>{statusLabel(st)}</span>
                      </div>
                    </div>

                    <div className="pva-row__right">
                      <div className="pva-row__rate">{rate}%</div>
                      <div className="pva-progress">
                        <div style={{ width: `${width}%` }} />
                      </div>
                      <div className="pva-row__hint">
                        {rate > 110 ? "초과 달성" : rate >= 80 ? "양호" : "개선 필요"} · 클릭해서 드릴다운
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Drilldown Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrilldown}
        PaperProps={{ className: "pva-drawer" }}
      >
        <div className="pva-drawer__header">
          <div className="pva-drawer__title">
            <div className="pva-drawer__name">
              <span className="pva-row__icon">{selectedRow?.icon || "🏷️"}</span>
              <span>{selectedRow?.name || "드릴다운"}</span>
            </div>
            <div className="pva-drawer__sub">
              {period} · {rangeLabel} · Actual {actualMode}
            </div>
          </div>

          <div className="pva-drawer__actions">
            <Tooltip title="회고 저장">
              <IconButton onClick={saveReflection} size="small">
                <Save size={18} />
              </IconButton>
            </Tooltip>
            <IconButton onClick={closeDrilldown} size="small">
              <X size={18} />
            </IconButton>
          </div>
        </div>

        <div className="pva-drawer__kpi">
          <div className="pva-kcard">
            <div className="pva-kcard__label">Plan</div>
            <div className="pva-kcard__value">{selectedRow ? minutesToHhmm(selectedRow.planMin) : "—"}</div>
          </div>
          <div className="pva-kcard">
            <div className="pva-kcard__label">Actual</div>
            <div className="pva-kcard__value">{selectedRow ? minutesToHhmm(selectedRow.actualMin) : "—"}</div>
          </div>
          <div className="pva-kcard">
            <div className="pva-kcard__label">달성률</div>
            <div className="pva-kcard__value">{selectedRow ? `${clamp(selectedRow.rate || 0, 0, 200)}%` : "—"}</div>
          </div>
          <div className="pva-kcard">
            <div className="pva-kcard__label">Δ</div>
            <div className="pva-kcard__value">{selectedRow ? minutesToHhmm(selectedRow.deltaMin || 0) : "—"}</div>
          </div>
        </div>

        <div className="pva-drawer__body">
          <Tabs.Root value={drillTab} onValueChange={setDrillTab} className="pva-tabs">
            <Tabs.List className="pva-tabs__list">
              <Tabs.Trigger value="summary" className="pva-tabs__trigger">
                요약
              </Tabs.Trigger>
              <Tabs.Trigger value="items" className="pva-tabs__trigger">
                항목
              </Tabs.Trigger>
              <Tabs.Trigger value="review" className="pva-tabs__trigger">
                회고
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="summary" className="pva-tabs__content">
              {!drill ? (
                <div className="tf-muted tf-small">데이터가 없습니다.</div>
              ) : (
                <>
                  <div className="pva-section-title">일자별 Plan vs Actual</div>
                  <div className="pva-daily">
                    {drill.daily.map((d) => {
                      const max = Math.max(d.planMin, d.actualMin, 1);
                      const planW = Math.round((d.planMin / max) * 100);
                      const actW = Math.round((d.actualMin / max) * 100);
                      const st = statusFromDelta(d.deltaMin);
                      return (
                        <div key={d.date} className="pva-daily__row">
                          <div className="pva-daily__date">{d.date}</div>
                          <div className="pva-daily__bars">
                            <div className="pva-bar pva-bar--plan" style={{ width: `${planW}%` }} />
                            <div className="pva-bar pva-bar--actual" style={{ width: `${actW}%` }} />
                          </div>
                          <div className="pva-daily__meta">
                            <span className="pva-mchip">P {minutesToHhmm(d.planMin)}</span>
                            <span className="pva-mchip">A {minutesToHhmm(d.actualMin)}</span>
                            <span className={`pva-pill ${statusTone(st)}`}>{statusLabel(st)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Divider style={{ margin: "14px 0" }} />

                  <div className="pva-section-title">Top 편차 항목</div>
                  <div className="pva-topdev">
                    {drill.topDeviations.map((it) => (
                      <div key={it.id} className="pva-topdev__row">
                        <div className="pva-topdev__title">
                          <span className="pva-type">{it.type}</span>
                          <span>{it.title}</span>
                        </div>
                        <div className="pva-topdev__meta">
                          <span className="pva-mchip">{it.date}</span>
                          <span className="pva-mchip">Δ {minutesToHhmm(it.deltaMin)}</span>
                          <span className={`pva-pill ${statusTone(it.status)}`}>{statusLabel(it.status)}</span>
                        </div>
                      </div>
                    ))}
                    <div className="pva-muted">
                      드릴다운은 실제 서비스에서 Task/Event/TimeBlock 원본을 서버 집계로 내려받아 정확히 구성해야 합니다.
                    </div>
                  </div>
                </>
              )}
            </Tabs.Content>

            <Tabs.Content value="items" className="pva-tabs__content">
              {!drill ? (
                <div className="tf-muted tf-small">데이터가 없습니다.</div>
              ) : (
                <DrillItemsPanel drill={drill} />
              )}
            </Tabs.Content>

            <Tabs.Content value="review" className="pva-tabs__content">
              <div className="pva-section-title">회고(카테고리 단위)</div>
              {persistHint && <div className="pva-warn">{persistHint}</div>}

              <div className="pva-review">
                <div className="pva-review__block">
                  <div className="pva-review__label">원인/방해요인 태그</div>
                  <div className="pva-tags">
                    {["회의", "돌발", "피곤", "집중저하", "우선순위변경", "외부요청", "장애/이슈", "미루기"].map((t) => (
                      <Chip
                        key={t}
                        label={t}
                        size="small"
                        clickable
                        color={reflect.tags.includes(t) ? "primary" : "default"}
                        onClick={() => toggleTag(t)}
                        className="pva-tag"
                      />
                    ))}
                  </div>
                </div>

                <div className="pva-review__block">
                  <div className="pva-review__label">이번 기간 한 줄 회고</div>
                  <textarea
                    className="pva-textarea"
                    value={reflect.note}
                    onChange={(e) => setReflect((p) => ({ ...p, note: e.target.value }))}
                    placeholder="예) 미달성 원인은 회의가 많았고, 오전 블록이 너무 길어서 유지가 어려웠다."
                    rows={4}
                  />
                  <div className="pva-review__hint">
                    팁: “원인(Why) → 개선(How) → 다음 액션(What)” 순으로 짧게 쓰면 회고에 재사용하기 쉽습니다.
                  </div>
                </div>

                <div className="pva-review__block">
                  <div className="pva-review__label">다음 액션(최대 3개)</div>
                  <div className="pva-actions3">
                    {reflect.nextActions.map((v, idx) => (
                      <input
                        key={idx}
                        className="pva-input"
                        value={v}
                        onChange={(e) =>
                          setReflect((p) => {
                            const next = [...p.nextActions];
                            next[idx] = e.target.value;
                            return { ...p, nextActions: next };
                          })
                        }
                        placeholder={`액션 ${idx + 1} (예: 내일 오전 블록을 30분 단위로 쪼개기)`}
                      />
                    ))}
                  </div>
                </div>

                <div className="pva-review__footer">
                  <button className="tf-btn tf-btn--primary" onClick={saveReflection}>
                    저장
                  </button>
                  <button className="tf-btn" onClick={exportDrilldownJson} style={{ marginLeft: 8 }}>
                    내보내기(JSON)
                  </button>
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </Drawer>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert severity={toast.type} variant="filled" onClose={() => setToast((t) => ({ ...t, open: false }))}>
          {toast.msg}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

/** =========================
 *  Drilldown Items Panel
 *  ========================= */
function DrillItemsPanel({ drill }) {
  const [typeFilter, setTypeFilter] = useState("ALL"); // ALL | TASK | EVENT | TIMEBLOCK
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | UNDER | ONTRACK | OVER
  const [sortKey, setSortKey] = useState("DATE_ASC"); // DATE_ASC | DELTA_DESC | PLAN_DESC | ACTUAL_DESC

  const items = useMemo(() => {
    let arr = drill.items || [];

    if (typeFilter !== "ALL") arr = arr.filter((x) => x.type === typeFilter);
    if (statusFilter !== "ALL") arr = arr.filter((x) => x.status === statusFilter);

    const sorted = [...arr];
    sorted.sort((a, b) => {
      if (sortKey === "DELTA_DESC") return Math.abs(b.deltaMin) - Math.abs(a.deltaMin);
      if (sortKey === "PLAN_DESC") return (b.planMin || 0) - (a.planMin || 0);
      if (sortKey === "ACTUAL_DESC") return (b.actualMin || 0) - (a.actualMin || 0);
      // DATE_ASC
      return (a.date || "").localeCompare(b.date || "");
    });

    return sorted;
  }, [drill.items, typeFilter, statusFilter, sortKey]);

  return (
    <div>
      <div className="pva-item-toolbar">
        <div className="pva-item-toolbar__left">
          <div className="pva-mini">타입</div>
          <select className="tf-select pva-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="ALL">전체</option>
            <option value="TASK">TASK</option>
            <option value="EVENT">EVENT</option>
            <option value="TIMEBLOCK">TIMEBLOCK</option>
          </select>

          <div className="pva-mini" style={{ marginLeft: 10 }}>
            상태
          </div>
          <select className="tf-select pva-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">전체</option>
            <option value="UNDER">미달</option>
            <option value="ONTRACK">양호</option>
            <option value="OVER">초과</option>
          </select>
        </div>

        <div className="pva-item-toolbar__right">
          <div className="pva-mini">정렬</div>
          <select className="tf-select pva-select" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="DATE_ASC">일자순</option>
            <option value="DELTA_DESC">편차(|Δ|) 큰 순</option>
            <option value="PLAN_DESC">Plan 큰 순</option>
            <option value="ACTUAL_DESC">Actual 큰 순</option>
          </select>
        </div>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <div className="pva-items">
        {items.map((it) => (
          <div key={it.id} className="pva-item">
            <div className="pva-item__top">
              <div className="pva-item__title">
                <span className="pva-type">{it.type}</span>
                <span>{it.title}</span>
              </div>
              <span className={`pva-pill ${statusTone(it.status)}`}>{statusLabel(it.status)}</span>
            </div>

            <div className="pva-item__meta">
              <span className="pva-mchip">{it.date}</span>
              <span className="pva-mchip">Plan {minutesToHhmm(it.planMin)}</span>
              <span className="pva-mchip">Actual {minutesToHhmm(it.actualMin)}</span>
              <span className="pva-mchip">Δ {minutesToHhmm(it.deltaMin)}</span>
            </div>

            {it.status === "UNDER" && it.obstacles?.length > 0 && (
              <div className="pva-item__ob">
                <span className="pva-mini">원인</span>
                {it.obstacles.map((o) => (
                  <span key={o} className="pva-obchip">
                    {o}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {items.length === 0 && <div className="pva-muted">조건에 맞는 항목이 없습니다.</div>}
      </div>
    </div>
  );
}
