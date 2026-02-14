// FILE : src/screens/stat/StatDashboardScreens.jsx
import React, { useEffect, useMemo, useState } from "react";
import "../../styles/screens/statDashboard.css";
import { safeStorage } from "../../shared/utils/safeStorage";
import { 
  BarChart2, TrendingUp, Calendar, Zap, 
  ArrowUpRight, Clock, Award, CheckCircle2, AlertCircle,
  Filter, ChevronDown
} from "lucide-react";

/**
 * 유틸리티 함수 (기존 로직 유지)
 */
function pad2(n) { return String(n).padStart(2, '0'); }
function toISODate(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function formatMin(min) {
  const m = Math.max(0, Math.round(min || 0));
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h === 0 ? `${r}m` : r === 0 ? `${h}h` : `${h}h ${r}m`;
}
function percent(part, total) {
  const t = total > 0 ? total : 0;
  return t === 0 ? 0 : Math.round((part / t) * 100);
}

/**
 * [New] Bento Grid용 카드 컴포넌트
 */
function StatCard({ title, icon: Icon, children, className = "", subAction }) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-card__header">
        <div className="stat-card__title-row">
          {Icon && <Icon size={16} className="stat-card__icon" />}
          <span className="stat-card__title">{title}</span>
        </div>
        {subAction}
      </div>
      <div className="stat-card__content">{children}</div>
    </div>
  );
}

/**
 * [New] 일관성 히트맵 (잔디 심기)
 */
function ConsistencyHeatmap({ data }) {
  // 데이터가 없으면 랜덤 생성 (시각화 예시용)
  const levels = useMemo(() => data || Array.from({ length: 28 }, () => Math.floor(Math.random() * 5)), [data]);
  return (
    <div className="heatmap-container">
      <div className="heatmap-grid">
        {levels.map((lvl, i) => (
          <div key={i} className={`heatmap-cell lvl-${lvl}`} title={`Day ${i+1}`} />
        ))}
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        <div className="heatmap-cell lvl-1" style={{width:8, height:8}}/>
        <div className="heatmap-cell lvl-4" style={{width:8, height:8}}/>
        <span>More</span>
      </div>
    </div>
  );
}

/**
 * [New] 도넛 차트 (기존 로직 + 새 디자인)
 */
function DonutChart({ slices, totalMin, onSelect, selectedId }) {
  const gradient = useMemo(() => {
    if (!slices || slices.length === 0 || totalMin === 0) return "conic-gradient(var(--tf-border) 0deg 360deg)";
    let cur = 0;
    const parts = slices.map((s) => {
      const deg = (s.min / totalMin) * 360;
      const res = `${s.color} ${cur}deg ${cur + deg}deg`;
      cur += deg;
      return res;
    });
    return `conic-gradient(${parts.join(", ")})`;
  }, [slices, totalMin]);

  return (
    <div className="donut-wrapper">
      <div className="donut-chart" style={{ background: gradient }}>
        <div className="donut-hole">
          <span className="donut-total">{formatMin(totalMin)}</span>
          <span className="donut-label">Total</span>
        </div>
      </div>
      <div className="donut-legend">
        {slices.slice(0, 4).map(s => (
          <div 
            key={s.id} 
            className={`donut-legend-item ${selectedId === s.id ? 'active' : ''}`}
            onClick={() => onSelect(selectedId === s.id ? null : s.id)}
          >
            <span className="legend-dot" style={{background: s.color}}/>
            <span className="legend-text">{s.name} ({percent(s.min, totalMin)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * [Existing] 기간 선택기 (디자인 리뉴얼)
 */
function RangePicker({ value, onChange, from, to, onChangeFrom, onChangeTo }) {
  return (
    <div className="range-picker">
      {["7d", "30d", "month", "custom"].map(key => (
        <button
          key={key}
          className={`range-btn ${value === key ? 'active' : ''}`}
          onClick={() => onChange(key)}
        >
          {key === "7d" ? "7일" : key === "30d" ? "30일" : key === "month" ? "월간" : "지정"}
        </button>
      ))}
      {value === "custom" && (
        <div className="range-custom-inputs">
          <input type="date" value={from} onChange={(e) => onChangeFrom(e.target.value)} />
          <span>~</span>
          <input type="date" value={to} onChange={(e) => onChangeTo(e.target.value)} />
        </div>
      )}
    </div>
  );
}

/**
 * [Existing] 드릴다운 패널 (디자인 리뉴얼)
 */
function Drilldown({ selected, mode, items }) {
  if (!selected) return null;
  const tb = items?.timeblocks || [];
  const tasks = items?.tasks || [];

  return (
    <StatCard className="col-span-4" title={`상세 분석: ${selected.name}`} icon={ArrowUpRight}>
      <div className="drill-grid">
        {/* 타임블록 */}
        <div className="drill-section">
          <div className="drill-header">타임블록 ({mode === 'plan' ? 'Plan' : 'Actual'})</div>
          {tb.length ? (
            <div className="drill-list">
              {tb.map((x) => (
                <div key={x.id} className="drill-item">
                  <div className="drill-row">
                    <span className="drill-title">{x.title}</span>
                    <span className="drill-meta">{x.start}~{x.end} ({formatMin(x.min)})</span>
                  </div>
                  {x.memo && <div className="drill-memo">{x.memo}</div>}
                </div>
              ))}
            </div>
          ) : <div className="empty-hint">데이터가 없습니다.</div>}
        </div>
        
        {/* 할 일 */}
        <div className="drill-section">
          <div className="drill-header">관련 할 일</div>
          {tasks.length ? (
            <div className="drill-list">
              {tasks.map((t) => (
                <div key={t.id} className="drill-item">
                  <div className="drill-row">
                    <span className={`drill-title ${t.done ? 'done' : ''}`}>
                      {t.done && "✓ "}{t.title}
                    </span>
                    <span className="drill-meta">
                      {t.actualMin ? `${formatMin(t.actualMin)}` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="empty-hint">연관된 할 일이 없습니다.</div>}
        </div>
      </div>
    </StatCard>
  );
}

/**
 * [Existing] 회고 & 태그 피커 (디자인 리뉴얼)
 */
function ReflectionSection({ reflection, setReflection }) {
  const baseTags = ["피곤", "회의", "돌발", "집중저하", "컨디션", "계획과다"];
  
  const toggleTag = (t) => {
    const cur = new Set(reflection.방해요인 || []);
    if (cur.has(t)) cur.delete(t); else cur.add(t);
    setReflection(prev => ({ ...prev, 방해요인: Array.from(cur) }));
  };

  return (
    <StatCard className="col-span-4" title="오늘의 회고 & 방해요인" icon={CheckCircle2}>
      <textarea
        className="reflection-input"
        placeholder="오늘 하루는 어땠나요? 부족했던 점이나 내일의 다짐을 기록해보세요."
        value={reflection.부족_미룰일 || ""}
        onChange={(e) => setReflection(prev => ({ ...prev, 부족_미룰일: e.target.value }))}
      />
      <div className="tag-container">
        {baseTags.map(t => (
          <button 
            key={t} 
            className={`tag-chip ${(reflection.방해요인 || []).includes(t) ? 'active' : ''}`}
            onClick={() => toggleTag(t)}
          >
            {t}
          </button>
        ))}
      </div>
    </StatCard>
  );
}

// --- Mock Data Generator (기존 로직 유지) ---
function getDefaultMock() {
  return {
    kpi: { planRate: 85, actionRate: 60, routineStreak: 7, focusMinWeek: 320 },
    categories: [
      { id: "work", name: "업무", color: "#6366f1" },
      { id: "study", name: "공부", color: "#10b981" },
      { id: "health", name: "운동", color: "#f97316" },
      { id: "life", name: "일상", color: "#06b6d4" },
      { id: "rest", name: "휴식", color: "#64748b" },
    ],
    agg: {
      work: { planMin: 780, actualMin: 640 },
      study: { planMin: 520, actualMin: 390 },
      health: { planMin: 240, actualMin: 210 },
      life: { planMin: 300, actualMin: 340 },
      rest: { planMin: 600, actualMin: 720 },
    },
    // Drilldown Mock
    drill: {
      work: {
        plan: { timeblocks: [{id:'1', title:'기획 회의', start:'10:00', end:'11:00', min:60}], tasks: [] },
        actual: { timeblocks: [{id:'2', title:'기획 회의', start:'10:10', end:'11:10', min:60}], tasks: [{id:'t1', title:'회의록 작성', done:true, actualMin:20}] }
      }
    },
    heatmap: Array.from({length: 28}, () => Math.floor(Math.random() * 5)),
    aiText: "오전 집중도가 가장 높습니다. 오후 3시 이후에는 루틴한 작업을 배치해보세요."
  };
}

export default function StatDashboardScreen() {
  // State Initialization (기존 로직 유지)
  const today = useMemo(() => toISODate(new Date()), []);
  const [mode, setMode] = useState(() => safeStorage.getItem("stats.ui.mode", "actual")); 
  const [rangeKey, setRangeKey] = useState(() => safeStorage.getItem("stats.ui.range", "7d"));
  const [from, setFrom] = useState(() => safeStorage.getItem("stats.ui.from", today));
  const [to, setTo] = useState(() => safeStorage.getItem("stats.ui.to", today));
  const [selectedCatId, setSelectedCatId] = useState(null);
  
  const reflectionKey = `stats.reflection.${today}`;
  const [reflection, setReflection] = useState(() => safeStorage.getJSON(reflectionKey, { 부족_미룰일: "", 방해요인: [] }));

  // Mock Data
  const mock = useMemo(() => getDefaultMock(), []);

  // Storage Effects
  useEffect(() => { safeStorage.setItem("stats.ui.mode", mode); }, [mode]);
  useEffect(() => { safeStorage.setJSON(reflectionKey, reflection); }, [reflection, reflectionKey]);

  // Derived Data (계산 로직)
  const derived = useMemo(() => {
    const cats = mock.categories || [];
    const agg = mock.agg || {};
    const rows = cats.map(c => {
      const a = agg[c.id] || { planMin: 0, actualMin: 0 };
      return {
        id: c.id, name: c.name, color: c.color,
        planMin: a.planMin, actualMin: a.actualMin,
        min: mode === "plan" ? a.planMin : a.actualMin
      };
    });
    const totalMin = rows.reduce((s, r) => s + r.min, 0);
    rows.sort((a, b) => b.min - a.min); // Sort desc
    return { rows, totalMin };
  }, [mock, mode]);

  // Selected Category Data for Drilldown
  const selectedCat = derived.rows.find(r => r.id === selectedCatId);
  const drillItems = useMemo(() => {
    if (!selectedCatId) return null;
    const d = mock.drill?.[selectedCatId];
    return d ? (mode === "plan" ? d.plan : d.actual) : { timeblocks: [], tasks: [] };
  }, [selectedCatId, mode, mock]);

  return (
    <div className="stat-screen">
      {/* Header */}
      <div className="stat-header-row">
        <div>
          <h1 className="stat-page-title">통계 대시보드</h1>
          <p className="stat-page-subtitle">데이터로 보는 나의 성장 기록</p>
        </div>
        
        <div className="stat-controls">
          {/* Mode Toggle (Plan vs Actual) */}
          <div className="mode-toggle">
            <button className={mode === 'plan' ? 'active' : ''} onClick={() => setMode('plan')}>Plan</button>
            <button className={mode === 'actual' ? 'active' : ''} onClick={() => setMode('actual')}>Actual</button>
          </div>
          {/* Range Picker */}
          <RangePicker 
            value={rangeKey} onChange={setRangeKey} 
            from={from} to={to} onChangeFrom={setFrom} onChangeTo={setTo} 
          />
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="stat-bento-grid">
        
        {/* 1. Sync Rate (KPI) */}
        <StatCard className="col-span-2 row-span-2 highlight-card" title="P vs A 싱크로율" icon={Award}>
          <div className="kpi-large-content">
            <div className="kpi-big-number">{mock.kpi.planRate}%</div>
            <div className="kpi-desc">
              계획 대비 실행률이 양호합니다. <br/>
              <strong>{mode === 'plan' ? '계획 모드' : '실행 모드'}</strong>를 보고 있습니다.
            </div>
            <div className="kpi-progress-bg">
              <div className="kpi-progress-fill" style={{width: `${mock.kpi.planRate}%`}} />
            </div>
          </div>
        </StatCard>

        {/* 2. Donut Chart (Time Distribution) */}
        <StatCard className="row-span-2" title="카테고리 점유율" icon={BarChart2}>
          <DonutChart 
            slices={derived.rows} 
            totalMin={derived.totalMin} 
            selectedId={selectedCatId}
            onSelect={setSelectedCatId}
          />
        </StatCard>

        {/* 3. Small KPIs */}
        <StatCard title="루틴 스트릭" icon={Calendar}>
          <div className="metric-single">
            <div className="metric-value text-orange">{mock.kpi.routineStreak}일</div>
            <div className="metric-label">연속 달성 중 🔥</div>
          </div>
        </StatCard>

        <StatCard title="몰입 시간" icon={Zap}>
          <div className="metric-single">
            <div className="metric-value text-accent">{formatMin(mock.kpi.focusMinWeek)}</div>
            <div className="metric-label">이번 주 누적</div>
          </div>
        </StatCard>

        {/* 4. Consistency Heatmap */}
        <StatCard className="col-span-2" title="Consistency (최근 4주)" icon={Clock}>
          <ConsistencyHeatmap data={mock.heatmap} />
        </StatCard>

        {/* 5. AI Insight */}
        <StatCard className="col-span-2 ai-card-bg" title="AI Insight" icon={TrendingUp}>
          <p className="ai-text">{mock.aiText}</p>
        </StatCard>

        {/* 6. Drilldown (Conditional) */}
        {selectedCatId && (
          <Drilldown selected={selectedCat} mode={mode} items={drillItems} />
        )}

        {/* 7. Reflection (Bottom) */}
        <ReflectionSection reflection={reflection} setReflection={setReflection} />

      </div>
    </div>
  );
}