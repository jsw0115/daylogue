// FILE: src/main/frontend/src/screens/plan/_components/WeeklyTimebarGrid.jsx
import React, { useMemo, useRef } from "react";
import moment from "moment";

function pad2(n) {
  return String(n).padStart(2, "0");
}
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
function parseHHMMToMin(hhmm) {
  const s = String(hhmm ?? "").trim();
  if (!s) return null;
  if (s === "24:00") return 1440;

  const m = /^(\d{1,2}):(\d{2})$/.exec(s);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  if (hh < 0 || hh > 24) return null;
  if (mm < 0 || mm >= 60) return null;

  const total = hh * 60 + mm;
  if (total < 0 || total > 1440) return null;
  return total;
}
function minToHHMM(min) {
  const m = clamp(Math.round(min), 0, 1440);
  if (m === 1440) return "24:00";
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${pad2(hh)}:${pad2(mm)}`;
}
function snapMin(min, step = 10) {
  const s = Math.round(min / step) * step;
  return clamp(s, 0, 1440);
}

/** overlap lane layout (하루 단위) */
function buildOverlapMinutes(items) {
  const points = [];
  for (const it of items) {
    points.push({ t: it.startMin, d: +1 });
    points.push({ t: it.endMin, d: -1 });
  }
  points.sort((a, b) => a.t - b.t || b.d - a.d);

  let cnt = 0;
  let prev = null;
  let overlap = 0;
  for (const p of points) {
    if (prev != null && cnt >= 2) overlap += Math.max(0, p.t - prev);
    cnt += p.d;
    prev = p.t;
  }
  return overlap;
}

function layoutWithLanes(items) {
  const sorted = [...items].sort((a, b) => a.startMin - b.startMin || b.endMin - a.endMin);

  const groups = [];
  let cur = [];
  let curEnd = -1;

  for (const it of sorted) {
    if (!cur.length) {
      cur = [it];
      curEnd = it.endMin;
      continue;
    }
    if (it.startMin < curEnd) {
      cur.push(it);
      curEnd = Math.max(curEnd, it.endMin);
    } else {
      groups.push(cur);
      cur = [it];
      curEnd = it.endMin;
    }
  }
  if (cur.length) groups.push(cur);

  const out = [];
  for (const g of groups) {
    const laneEnds = [];
    const placed = [];

    const gSorted = [...g].sort((a, b) => a.startMin - b.startMin || b.endMin - a.endMin);
    for (const it of gSorted) {
      let lane = -1;
      for (let i = 0; i < laneEnds.length; i++) {
        if (laneEnds[i] <= it.startMin) {
          lane = i;
          break;
        }
      }
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(it.endMin);
      } else {
        laneEnds[lane] = it.endMin;
      }
      placed.push({ ...it, lane });
    }

    const laneCount = Math.max(1, laneEnds.length);
    const overlapMinutes = laneCount >= 2 ? buildOverlapMinutes(gSorted) : 0;

    for (const p of placed) {
      out.push({
        ...p,
        laneCount,
        isOverlapped: laneCount >= 2,
        overlapMinutesGroup: overlapMinutes,
      });
    }
  }

  return out;
}

export default function WeeklyTimebarGrid({
  weekDays, // moment[]
  getEventsForDateKey, // (dateKey)=> events[]
  onClickEvent,
  onCreateDraft, // (dateObj, draft)=> void
  stepMinutes = 10,
  defaultBlockMinutes = 30,
  startHour = 7,
  endHour = 24,
}) {
  const wrapRef = useRef(null);

  const axis = useMemo(() => {
    const arr = [];
    for (let h = startHour; h <= endHour; h++) arr.push(h);
    return arr;
  }, [startHour, endHour]);

  const rowPx = 6; // 10분 한 칸 높이(주간은 더 촘촘)
  const pxPerMin = rowPx / stepMinutes;

  const startMinWindow = startHour * 60;
  const endMinWindow = endHour * 60;
  const totalHeight = (endMinWindow - startMinWindow) * pxPerMin;

  const days = useMemo(() => {
    return (weekDays || []).map((m) => {
      const dateKey = m.format("YYYY-MM-DD");
      const raw = Array.isArray(getEventsForDateKey?.(dateKey)) ? getEventsForDateKey(dateKey) : [];
      const items = [];

      for (const ev of raw) {
        const s = parseHHMMToMin(ev?.start);
        const e = parseHHMMToMin(ev?.end);
        if (s == null || e == null) continue;

        const startMin = clamp(s, 0, 1440);
        const endMinRaw = clamp(e, 0, 1440);
        const endMin = endMinRaw <= startMin ? clamp(startMin + stepMinutes, 0, 1440) : endMinRaw;

        items.push({
          id: ev?.id ?? `${dateKey}.${startMin}.${endMin}.${Math.random().toString(16).slice(2)}`,
          raw: ev,
          startMin,
          endMin,
          colorHex: ev?.colorHex ?? ev?.color ?? null,
        });
      }

      const laid = layoutWithLanes(items);

      const overlapMinutesTotal = (() => {
        // group overlap을 대충 중복 방지(과도하게 무겁게 계산하지 않음)
        const seen = new Set();
        let sum = 0;
        for (const it of laid) {
          if (!it.overlapMinutesGroup) continue;
          const groupKey = `g:${it.laneCount}:${Math.floor(it.startMin / 60)}-${Math.floor(it.endMin / 60)}`;
          if (seen.has(groupKey)) continue;
          seen.add(groupKey);
          sum += it.overlapMinutesGroup;
        }
        return sum;
      })();

      return {
        m,
        dateKey,
        laid,
        rawCount: raw.length,
        overlappedCount: laid.filter((x) => x.isOverlapped).length,
        overlapMinutesTotal,
      };
    });
  }, [weekDays, getEventsForDateKey, stepMinutes]);

  const handleDoubleClickDay = (evt, dateKey) => {
    const col = evt.currentTarget;
    const rect = col.getBoundingClientRect();
    const y = evt.clientY - rect.top + col.scrollTop;

    const clickedMin = startMinWindow + y / pxPerMin;
    const start = snapMin(clickedMin, stepMinutes);
    const end = clamp(start + defaultBlockMinutes, 0, 1440);

    const d = moment(dateKey, "YYYY-MM-DD", true).isValid()
      ? moment(dateKey, "YYYY-MM-DD", true).toDate()
      : new Date();

    onCreateDraft?.(d, {
      title: "",
      start: minToHHMM(start),
      end: minToHHMM(end),
      colorHex: "#99aaff",
    });
  };

  return (
    <div className="weeklyTimebar" ref={wrapRef}>
      <div className="weeklyTimebar__head">
        <div className="weeklyTimebar__hint text-muted font-small">
          더블클릭으로 블록 추가 · 10분 단위 · 겹침 시 가로 분할
        </div>
      </div>

      <div className="weeklyTimebar__grid">
        <div className="weeklyTimebar__axis" style={{ height: totalHeight }}>
          {axis.map((h) => {
            const isLast = h === endHour;
            return (
              <div
                key={h}
                className={"weeklyTimebar__tick " + (h % 2 === 0 ? "is-even" : "")}
                style={{ height: isLast ? 1 : 60 * pxPerMin }}
              >
                {!isLast ? <span className="weeklyTimebar__tickLabel">{pad2(h)}:00</span> : null}
              </div>
            );
          })}
        </div>

        <div className="weeklyTimebar__days">
          {days.map((d) => (
            <div key={d.dateKey} className="weeklyTimebar__day">
              <div className="weeklyTimebar__dayHead">
                <div className="weeklyTimebar__dayTitle">
                  <span className="wkDow">{d.m.format("ddd")}</span>
                  <span className="wkDate">{d.m.format("M/D")}</span>
                </div>
                <div className="weeklyTimebar__dayMeta text-muted font-small">
                  {d.rawCount ? `${d.rawCount}개` : "0개"}
                  {d.overlappedCount ? ` · 겹침 ${d.overlappedCount}` : ""}
                </div>
              </div>

              <div
                className="weeklyTimebar__dayCanvas"
                style={{ height: totalHeight, "--tbRowPx": `${rowPx}px` }}
                onDoubleClick={(e) => handleDoubleClickDay(e, d.dateKey)}
              >
                <div className="weeklyTimebar__bg" />

                {d.laid.map((it) => {
                  const top = (it.startMin - startMinWindow) * pxPerMin;
                  const height = Math.max(stepMinutes * pxPerMin, (it.endMin - it.startMin) * pxPerMin);

                  const laneW = 100 / it.laneCount;
                  const leftPct = it.lane * laneW;
                  const widthPct = laneW;

                  const color = it.colorHex || "rgba(99,102,241,1)";
                  const bg = it.colorHex ? `${it.colorHex}22` : "rgba(99,102,241,0.12)";
                  const border = it.isOverlapped ? "2px solid rgba(239,68,68,0.85)" : `1px solid ${color}`;

                  return (
                    <button
                      key={it.id}
                      type="button"
                      className={"weeklyTimebar__block " + (it.isOverlapped ? "is-overlap" : "")}
                      style={{
                        top,
                        height,
                        left: `calc(${leftPct}% + 2px)`,
                        width: `calc(${widthPct}% - 4px)`,
                        border,
                        background: bg,
                      }}
                      title={`${it.raw?.title ?? ""} · ${minToHHMM(it.startMin)}~${minToHHMM(it.endMin)}${it.isOverlapped ? " · 겹침" : ""}`}
                      onClick={() => onClickEvent?.(d.dateKey, it.raw)}
                    >
                      <div className="weeklyTimebar__blockTitle">{it.raw?.title || ""}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
