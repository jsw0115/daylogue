// FILE: src/main/frontend/src/components/timebar/TimebarDayView.jsx
import React, { useMemo } from "react";
import {
  computeOverlaps,
  layoutByLanes,
  parseHHMMToMinutes,
  minutesToHHMM,
} from "../../shared/utils/timeEntryStore";
import "../../styles/components/timebar.css";

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function inRange(v, a, b) {
  return v >= a && v <= b;
}

function buildGaps(actualEntries, focusStartMin = 9 * 60, focusEndMin = 18 * 60) {
  const intervals = (Array.isArray(actualEntries) ? actualEntries : [])
    .map((e) => {
      const s = parseHHMMToMinutes(e.start);
      const en = parseHHMMToMinutes(e.end);
      if (s == null || en == null || en <= s) return null;
      return { s, e: en };
    })
    .filter(Boolean)
    .sort((a, b) => a.s - b.s);

  const merged = [];
  for (const it of intervals) {
    if (!merged.length) merged.push(it);
    else {
      const last = merged[merged.length - 1];
      if (it.s <= last.e) last.e = Math.max(last.e, it.e);
      else merged.push(it);
    }
  }

  const gaps = [];
  let cur = focusStartMin;
  for (const it of merged) {
    const s = clamp(it.s, focusStartMin, focusEndMin);
    const e = clamp(it.e, focusStartMin, focusEndMin);
    if (e <= focusStartMin || s >= focusEndMin) continue;

    if (s > cur) gaps.push({ s: cur, e: s });
    cur = Math.max(cur, e);
  }
  if (cur < focusEndMin) gaps.push({ s: cur, e: focusEndMin });

  // 너무 작은 갭은 제외(15분 미만)
  return gaps.filter((g) => g.e - g.s >= 15);
}

export default function TimebarDayView({
  dateKey,
  entries,
  showPlan = true,
  showActual = true,
  onlyOverlaps = false,
  showGaps = true,
  pxPerMin = 1.2,
  onClickEntry,
  onRequestCreate,
  onClickDerivedPlan,
}) {
  const list = Array.isArray(entries) ? entries : [];

  const visible = useMemo(() => {
    const filtered = list.filter((e) => {
      if (e.type === "plan" && !showPlan) return false;
      if (e.type === "actual" && !showActual) return false;
      return true;
    });

    // 겹침 필터는 "전체(Plan+Actual)" 기준으로 잡는 게 사용자가 이해하기 쉬움
    if (onlyOverlaps) {
      const { overlapMap } = computeOverlaps(filtered);
      return filtered.filter((e) => overlapMap[e.id]);
    }

    return filtered;
  }, [list, showPlan, showActual, onlyOverlaps]);

  const actualVisible = useMemo(() => visible.filter((e) => e.type === "actual"), [visible]);
  const planVisible = useMemo(() => visible.filter((e) => e.type === "plan"), [visible]);

  const overlapInfoAll = useMemo(() => computeOverlaps(visible), [visible]);
  const overlapInfoActual = useMemo(() => computeOverlaps(actualVisible), [actualVisible]);

  const planLanes = useMemo(() => layoutByLanes(planVisible), [planVisible]);
  const actualLanes = useMemo(() => layoutByLanes(actualVisible), [actualVisible]);

  const heightPx = Math.round(24 * 60 * pxPerMin);

  const nowLineTop = useMemo(() => {
    const now = new Date();
    const hh = now.getHours();
    const mm = now.getMinutes();
    return Math.round((hh * 60 + mm) * pxPerMin);
  }, [pxPerMin]);

  const gaps = useMemo(() => {
    if (!showGaps) return [];
    return buildGaps(actualVisible);
  }, [actualVisible, showGaps]);

  const renderBlock = (e, layer = "actual") => {
    const startMin = parseHHMMToMinutes(e.start) ?? 0;
    const endMin = parseHHMMToMinutes(e.end) ?? startMin + 1;

    const top = Math.round(startMin * pxPerMin);
    const h = Math.max(8, Math.round((endMin - startMin) * pxPerMin));

    const laneIndex = Number.isFinite(e.laneIndex) ? e.laneIndex : 0;
    const laneCount = Number.isFinite(e.laneCount) ? e.laneCount : 1;
    const leftPct = (laneIndex * 100) / laneCount;
    const widthPct = 100 / laneCount;

    const isOver = Boolean(overlapInfoAll.overlapMap?.[e.id]);
    const isDerivedPlan = String(e.id || "").startsWith("pe:");

    const cls =
      "timebar-block " +
      (layer === "plan" ? "is-plan " : "is-actual ") +
      (isOver ? "is-overlap " : "") +
      (isDerivedPlan ? "is-derived " : "");

    const click = () => {
      if (isDerivedPlan) {
        const evId = e?.link?.eventId || "";
        if (evId) onClickDerivedPlan?.(String(evId));
        else onClickEntry?.(e);
        return;
      }
      onClickEntry?.(e);
    };

    return (
      <button
        key={e.id}
        type="button"
        className={cls}
        style={{
          top,
          height: h,
          left: `${leftPct}%`,
          width: `${widthPct}%`,
        }}
        title={`${e.title || "(제목 없음)"} · ${e.start}~${e.end}${isOver ? " · 겹침" : ""}`}
        onClick={click}
      >
        <div className="timebar-block__title">{e.title || "(제목 없음)"}</div>
        <div className="timebar-block__meta">
          {e.start}~{e.end}
          {isOver ? " · 겹침" : ""}
        </div>
      </button>
    );
  };

  return (
    <div className="timebar">
      <div className="timebar__summary">
        <div className="timebar__summaryLeft">
          <div className="timebar__badge">
            Actual 겹침 {overlapInfoActual.overlapCoverageMin}분
          </div>
          <div className="timebar__badge">
            전체(Plan+Actual) 겹침 {overlapInfoAll.overlapCoverageMin}분
          </div>
        </div>

        <div className="timebar__summaryRight text-muted font-small">
          단축키: N(새 블록) · Ctrl/Cmd+Z(Undo)
        </div>
      </div>

      <div className="timebar__body">
        <div className="timebar__axis">
          {Array.from({ length: 24 }).map((_, h) => (
            <div key={h} className="timebar__axisRow" style={{ top: Math.round(h * 60 * pxPerMin) }}>
              <span>{String(h).padStart(2, "0")}:00</span>
            </div>
          ))}
        </div>

        <div
          className="timebar__canvas"
          style={{ height: heightPx }}
          onDoubleClick={(e) => {
            // 더블클릭으로 대충 생성(마우스 위치 → 시간)
            const rect = e.currentTarget.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const min = clamp(Math.round(y / pxPerMin), 0, 24 * 60 - 1);
            const start = minutesToHHMM(min);
            const end = minutesToHHMM(min + 30);
            onRequestCreate?.({ start, end, type: "actual" });
          }}
        >
          {/* hour lines */}
          {Array.from({ length: 24 }).map((_, h) => (
            <div
              key={h}
              className="timebar__hourLine"
              style={{ top: Math.round(h * 60 * pxPerMin) }}
            />
          ))}

          {/* gap blocks (09:00~18:00, actual 기준) */}
          {gaps.map((g, idx) => {
            const top = Math.round(g.s * pxPerMin);
            const h = Math.max(10, Math.round((g.e - g.s) * pxPerMin));
            const label =
              inRange(g.s, 9 * 60, 18 * 60) && inRange(g.e, 9 * 60, 18 * 60)
                ? `${minutesToHHMM(g.s)}~${minutesToHHMM(g.e)}`
                : "";

            return (
              <button
                key={`gap:${idx}`}
                type="button"
                className="timebar-gap"
                style={{ top, height: h }}
                title={`빈 시간: ${label} (클릭하여 기록 추가)`}
                onClick={() =>
                  onRequestCreate?.({
                    start: minutesToHHMM(g.s),
                    end: minutesToHHMM(Math.min(g.s + 30, g.e)),
                    type: "actual",
                  })
                }
              >
                <span className="timebar-gap__text">빈 시간</span>
              </button>
            );
          })}

          {/* plan layer behind */}
          <div className="timebar__layer is-plan">
            {planLanes.map((e) => renderBlock(e, "plan"))}
          </div>

          {/* actual layer */}
          <div className="timebar__layer is-actual">
            {actualLanes.map((e) => renderBlock(e, "actual"))}
          </div>

          {/* now line */}
          <div className="timebar-nowLine" style={{ top: nowLineTop }} />
        </div>
      </div>
    </div>
  );
}
