import React, { useEffect, useMemo, useState } from "react";
import { statsApi } from "../../services/localMockApi";
import "../../styles/timeflow-ui.css";
import "../../styles/compare-stats.css";

// MUI Components
import Drawer from "@mui/material/Drawer";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";

// Radix UI
import * as Tabs from "@radix-ui/react-tabs";

// Icons
import {
  X, RefreshCw, Search, Filter, ArrowDownUp, Save,
  Clock, AlertCircle, CheckCircle2, TrendingUp
} from "lucide-react";

/** =========================
 * Utils
 * ========================= */
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

function minutesToHhmm(min) {
  const isNeg = min < 0;
  const m = Math.abs(Math.round(min));
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${isNeg ? "-" : ""}${h}h ${String(mm).padStart(2, "0")}m`;
}

function getRangeLabel(period, baseDate) {
  // 실제 날짜 계산 로직은 생략하고 화면 표시용 더미 반환
  if (period === 'DAY') return baseDate;
  if (period === 'WEEK') return `${baseDate} 주간`;
  if (period === 'MONTH') return `${baseDate.substring(0, 7)} 월간`;
  return `${baseDate.substring(0, 4)} 연간`;
}

function statusFromDelta(deltaMin) {
  if (deltaMin >= 30) return "OVER";   // 계획보다 30분 이상 더 씀 (과소평가)
  if (deltaMin <= -30) return "UNDER"; // 계획보다 30분 이상 덜 씀 (과대평가)
  return "ONTRACK";                    // 적절함
}

function getPredictionBadge(plan, actual) {
  const delta = actual - plan;
  if (Math.abs(delta) < 15) return { label: "정확함", color: "success", icon: <CheckCircle2 size={12}/> };
  if (delta > 0) return { label: "과소평가 (시간부족)", color: "error", icon: <TrendingUp size={12}/> };
  return { label: "과대평가 (시간남음)", color: "warning", icon: <AlertCircle size={12}/> };
}

// LocalStorage Helper
function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return { ok: true, persisted: true };
  } catch {
    return { ok: true, persisted: false };
  }
}

function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** =========================
 * Main Component
 * ========================= */
export default function CompareStatsScreen() {
  // --- States ---
  const [period, setPeriod] = useState("WEEK");
  const [baseDate, setBaseDate] = useState(todayStr());
  
  // Filters
  const [groupBy, setGroupBy] = useState("CATEGORY");
  const [actualMode, setActualMode] = useState("HYBRID");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("DELTA_DESC");
  const [q, setQ] = useState("");

  // Data
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // UI States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [drillTab, setDrillTab] = useState("summary");
  
  // Reflection (회고)
  const [reflect, setReflect] = useState({ tags: [], note: "", nextActions: ["", "", ""] });
  const [toast, setToast] = useState({ open: false, type: "info", msg: "" });

  // --- Actions ---
  async function load() {
    setLoading(true);
    try {
      // API 호출 시뮬레이션
      const res = await statsApi.getCompare({ period, baseDate });
      setData(res);
    } catch (e) {
      setToast({ open: true, type: "error", msg: "데이터 로드 실패" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [period]);

  // Derived Data (Filtering & Sorting)
  const processedRows = useMemo(() => {
    if (!data?.rows) return [];
    
    let rows = data.rows.map(r => ({
      ...r,
      deltaMin: r.actualHours * 60 - r.planHours * 60,
      status: statusFromDelta(r.actualHours * 60 - r.planHours * 60)
    }));

    // Filter
    if (q) rows = rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase()));
    if (statusFilter !== "ALL") rows = rows.filter(r => r.status === statusFilter);

    // Sort
    rows.sort((a, b) => {
      if (sortKey === "DELTA_DESC") return Math.abs(b.deltaMin) - Math.abs(a.deltaMin);
      if (sortKey === "RATE_DESC") return b.rate - a.rate;
      return 0;
    });

    return rows;
  }, [data, q, statusFilter, sortKey]);

  // Handlers
  const handleRowClick = (row) => {
    setSelectedRow(row);
    setDrawerOpen(true);
    
    // Load saved reflection
    const key = `pva_ref_${row.id}`;
    const saved = safeStorageGet(key);
    if (saved) setReflect(JSON.parse(saved));
    else setReflect({ tags: [], note: "", nextActions: ["", "", ""] });
  };

  const handleSaveReflection = () => {
    if (!selectedRow) return;
    const key = `pva_ref_${selectedRow.id}`;
    safeStorageSet(key, JSON.stringify(reflect));
    setToast({ open: true, type: "success", msg: "회고가 저장되었습니다." });
  };

  return (
    <div className="tf-page pva-page">
      
      {/* 1. Header */}
      <div className="pva-header">
        <div>
          <h1 className="tf-title">비교 분석 (Plan vs Actual)</h1>
          <p className="tf-subtitle">
            {getRangeLabel(period, baseDate)} · 그룹 {groupBy}
          </p>
        </div>
        <div className="pva-actions">
          <button className="tf-btn" onClick={load} disabled={loading}>
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            <span className="mobile-hidden">새로고침</span>
          </button>
        </div>
      </div>

      {/* 2. Controls & Filter Bar (Grid Layout) */}
      <div className="tf-card pva-controls">
        {/* Top Row: Period & Date */}
        <div className="pva-controls__row">
          <div className="control-group">
            <label className="pva-label">기간 설정</label>
            <div className="control-wrapper">
              <ToggleButtonGroup
                size="small"
                exclusive
                value={period}
                onChange={(_, v) => v && setPeriod(v)}
                className="pva-toggle-group"
              >
                <ToggleButton value="DAY">일</ToggleButton>
                <ToggleButton value="WEEK">주</ToggleButton>
                <ToggleButton value="MONTH">월</ToggleButton>
              </ToggleButtonGroup>
              
              <TextField
                type="date"
                size="small"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="pva-date-input"
                hiddenLabel
              />
            </div>
          </div>

          <div className="control-group right-align">
            <div className="pva-summary-box">
              <span className="label">총 달성률</span>
              <span className="value">85%</span>
              <span className="delta warning">▲ 5%</span>
            </div>
          </div>
        </div>

        <Divider className="pva-divider" />

        {/* Bottom Row: Filters (Grid) */}
        <div className="pva-filter-grid">
          <div className="filter-item">
            <label className="pva-label">그룹핑</label>
            <select className="tf-select" value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
              <option value="CATEGORY">카테고리별</option>
              <option value="TYPE">유형별 (Task/Event)</option>
            </select>
          </div>

          <div className="filter-item">
            <label className="pva-label">Actual 기준</label>
            <select className="tf-select" value={actualMode} onChange={(e) => setActualMode(e.target.value)}>
              <option value="HYBRID">하이브리드 (권장)</option>
              <option value="DONE">완료 체크 기반</option>
              <option value="TIME">타임블록 시간 기반</option>
            </select>
          </div>

          <div className="filter-item">
            <label className="pva-label">상태 필터</label>
            <select className="tf-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">전체 보기</option>
              <option value="OVER">초과 (Over)</option>
              <option value="UNDER">미달 (Under)</option>
              <option value="ONTRACK">양호 (On-track)</option>
            </select>
          </div>

          <div className="filter-item search-item">
            <label className="pva-label">검색</label>
            <div className="pva-search-box">
              <Search size={16} />
              <input 
                placeholder="항목 검색..." 
                value={q} 
                onChange={(e) => setQ(e.target.value)} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main List (Ghost UI Applied) */}
      <div className="pva-main-content">
        {loading ? (
          <div className="pva-loading"><CircularProgress /></div>
        ) : processedRows.length === 0 ? (
          <div className="pva-empty">데이터가 없습니다.</div>
        ) : (
          <div className="pva-grid-list">
            {processedRows.map((row) => {
              // Ghost Chart Calculation
              const maxVal = Math.max(row.planHours, row.actualHours, 1);
              const planPercent = (row.planHours / maxVal) * 100;
              const actualPercent = (row.actualHours / maxVal) * 100;
              const badge = getPredictionBadge(row.planHours, row.actualHours);

              return (
                <div key={row.id} className="pva-card-item" onClick={() => handleRowClick(row)}>
                  <div className="pva-item-header">
                    <div className="pva-icon-box">{row.icon}</div>
                    <div className="pva-info">
                      <div className="pva-name">{row.name}</div>
                      <div className={`pva-badge ${badge.color}`}>
                        {badge.icon} {badge.label}
                      </div>
                    </div>
                    <div className="pva-rate">
                      <span className="val">{row.rate}%</span>
                      <span className="lbl">달성</span>
                    </div>
                  </div>

                  {/* PvsA Ghost Bar Chart */}
                  <div className="pva-ghost-chart">
                    <div className="chart-label">
                      <span>Plan {row.planHours}h</span>
                      <span>Actual {row.actualHours}h</span>
                    </div>
                    <div className="chart-track">
                      {/* Ghost (Plan) */}
                      <div className="bar-ghost" style={{ width: `${planPercent}%` }}></div>
                      {/* Solid (Actual) */}
                      <div 
                        className={`bar-solid ${row.status.toLowerCase()}`} 
                        style={{ width: `${actualPercent}%` }}
                      ></div>
                    </div>
                    <div className="chart-diff">
                      Gap: {minutesToHhmm(row.deltaMin)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Drilldown Drawer */}
      <Drawer 
        anchor="right" 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        classes={{ paper: "pva-drawer-paper" }}
      >
        {selectedRow && (
          <div className="pva-drawer-content">
            <div className="drawer-header">
              <h2>{selectedRow.name} 상세 분석</h2>
              <div className="drawer-actions">
                <IconButton onClick={handleSaveReflection} color="primary"><Save size={20}/></IconButton>
                <IconButton onClick={() => setDrawerOpen(false)}><X size={20}/></IconButton>
              </div>
            </div>

            <Tabs.Root value={drillTab} onValueChange={setDrillTab} className="pva-tabs-root">
              <Tabs.List className="pva-tabs-list">
                <Tabs.Trigger value="summary" className="pva-tab-trigger">요약</Tabs.Trigger>
                <Tabs.Trigger value="review" className="pva-tab-trigger">회고</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="summary" className="pva-tab-content">
                <div className="drawer-stats">
                  <div className="stat-box">
                    <span className="lbl">Plan</span>
                    <span className="val">{selectedRow.planHours}h</span>
                  </div>
                  <div className="stat-box">
                    <span className="lbl">Actual</span>
                    <span className="val">{selectedRow.actualHours}h</span>
                  </div>
                  <div className="stat-box">
                    <span className="lbl">Gap</span>
                    <span className="val" style={{color: selectedRow.deltaMin > 0 ? '#ef4444' : '#10b981'}}>
                      {minutesToHhmm(selectedRow.deltaMin)}
                    </span>
                  </div>
                </div>
                <Divider style={{margin: '20px 0'}} />
                <p className="pva-desc">
                  이곳에 일자별 그래프나 상세 항목 리스트가 표시됩니다. (현재 Mock Data)
                </p>
              </Tabs.Content>

              <Tabs.Content value="review" className="pva-tab-content">
                <div className="form-group">
                  <label>원인 분석</label>
                  <textarea 
                    className="tf-textarea" 
                    rows={4} 
                    placeholder="계획과 달라진 원인은 무엇인가요?"
                    value={reflect.note}
                    onChange={e => setReflect({...reflect, note: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>다음 액션 (Next Steps)</label>
                  {reflect.nextActions.map((act, idx) => (
                    <input 
                      key={idx} 
                      className="tf-input mb-2" 
                      placeholder={`액션 ${idx+1}`}
                      value={act}
                      onChange={e => {
                        const newActs = [...reflect.nextActions];
                        newActs[idx] = e.target.value;
                        setReflect({...reflect, nextActions: newActs});
                      }}
                    />
                  ))}
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        )}
      </Drawer>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert severity={toast.type} variant="filled">{toast.msg}</MuiAlert>
      </Snackbar>
    </div>
  );
}