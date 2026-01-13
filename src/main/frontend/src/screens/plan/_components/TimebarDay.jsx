// FILE: src/main/frontend/src/screens/plan/_components/TimebarDay.jsx
import React, { useMemo, useRef } from "react";

/**
 * 종이 플래너 느낌의 일간 타임테이블
 * - 10분 단위 그리드
 * - 일정 색상 블록 렌더링
 * - 겹침 허용 + lane 분할 레이아웃
 * - 더블클릭으로 해당 시간대 블록 생성(draft)
 */

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

function buildOverlapMinutes(items) {
  // sweep line로 "동시 2개 이상"인 구간 합산
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
  // items: [{id, startMin, endMin, ...}]
  const sorted = [...items].sort((a, b) => a.startMin - b.startMin || b.endMin - a.endMin);

  // 1) 겹치는 connected-group 만들기
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

  // 2) 각 그룹 내부 lane 배정
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

export default function TimebarDay({
  dateKey,
  events,
  onClickEvent,
  onCreateDraft,
  stepMinutes = 10,
  defaultBlockMinutes = 30,
}) {
  const scrollRef = useRef(null);

  const normalized = useMemo(() => {
    const list = Array.isArray(events) ? events : [];
    const items = [];

    for (const ev of list) {
      const s = parseHHMMToMin(ev?.start);
      const e = parseHHMMToMin(ev?.end);

      if (s == null || e == null) continue;

      const startMin = clamp(s, 0, 1440);
      const endMinRaw = clamp(e, 0, 1440);
      const endMin = endMinRaw <= startMin ? clamp(startMin + stepMinutes, 0, 1440) : endMinRaw;

      items.push({
        id: ev?.id ?? `${dateKey}.${startMin}.${endMin}.${Math.random().toString(16).slice(2)}`,
        raw: ev,
        title: String(ev?.title ?? ""),
        startMin,
        endMin,
        colorHex: ev?.colorHex ?? ev?.color ?? null,
      });
    }

    const laid = layoutWithLanes(items);

    const overlappedCount = laid.filter((x) => x.isOverlapped).length;
    const overlapMinutesTotal = (() => {
      // 그룹별 overlapMinutesGroup은 그룹 내 모든 item에 중복으로 들어가므로 Set으로 합산
      const seen = new Set();
      let sum = 0;
      for (const it of laid) {
        const key = `${it.startMin}-${it.endMin}-${it.laneCount}`;
        // 완전한 그룹키는 아니지만, overlapMinutesGroup이 0이면 스킵
        if (!it.overlapMinutesGroup) continue;
        // group키는 별도로 추적: 같은 그룹은 같은 overlapMinutesGroup이지만 아이템마다 반복되므로
        // start~end 범위가 다를 수 있어도 overlapMinutesGroup은 그룹 기준이라 중복될 수 있음.
        // 여기선 "laneCount>=2인 아이템 묶음" 수준으로만 중복 방지.
        const groupKey = `g:${it.laneCount}:${Math.floor(it.startMin / 60)}-${Math.floor(it.endMin / 60)}`;
        if (seen.has(groupKey)) continue;
        seen.add(groupKey);
        sum += it.overlapMinutesGroup;
      }
      return sum;
    })();

    // 보여줄 시간 범위(종이 플래너 느낌: 기본 06~24, 필요하면 자동 확장)
    const minStart = items.length ? Math.min(...items.map((x) => x.startMin)) : 6 * 60;
    const maxEnd = items.length ? Math.max(...items.map((x) => x.endMin)) : 24 * 60;

    const startHour = Math.min(6, Math.floor(minStart / 60));
    const endHour = Math.max(24, Math.ceil(maxEnd / 60));

    return {
      laid,
      startHour: clamp(startHour, 0, 23),
      endHour: clamp(endHour, 1, 24),
      overlappedCount,
      overlapMinutesTotal,
    };
  }, [events, dateKey, stepMinutes]);

  const rowPx = 8; // 10분 1칸 높이(종이 플래너 느낌)
  const pxPerMin = rowPx / stepMinutes;

  const startMinWindow = normalized.startHour * 60;
  const endMinWindow = normalized.endHour * 60;
  const totalMin = endMinWindow - startMinWindow;
  const totalHeight = totalMin * pxPerMin;

  const hours = useMemo(() => {
    const arr = [];
    for (let h = normalized.startHour; h <= normalized.endHour; h++) arr.push(h);
    return arr;
  }, [normalized.startHour, normalized.endHour]);

  const onDoubleClick = (e) => {
    const host = scrollRef.current;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    const y = e.clientY - rect.top + host.scrollTop;
    const clickedMin = startMinWindow + y / pxPerMin;
    const start = snapMin(clickedMin, stepMinutes);
    const end = clamp(start + defaultBlockMinutes, 0, 1440);

    onCreateDraft?.({
      title: "",
      start: minToHHMM(start),
      end: minToHHMM(end),
      colorHex: "#99aaff",
    });
  };

  return (
    <div className="timebarWrap">
      <div className="timebarBanner">
        {normalized.overlappedCount ? (
          <div className="timebarBanner__warn">
            겹침 {normalized.overlappedCount}건 · 겹친 시간 {Math.floor(normalized.overlapMinutesTotal / 60)}h {normalized.overlapMinutesTotal % 60}m
          </div>
        ) : (
          <div className="timebarBanner__ok">겹침 없음</div>
        )}
        <div className="timebarBanner__hint text-muted font-small">더블클릭으로 블록 추가 · 10분 단위</div>
      </div>

      <div className="timebar" ref={scrollRef} onDoubleClick={onDoubleClick}>
        <div className="timebar__axis" style={{ height: totalHeight }}>
          {hours.map((h) => {
            const isLast = h === normalized.endHour;
            const label = h === 24 ? "24" : pad2(h);
            return (
              <div
                key={h}
                className={"timebar__tick " + (h % 2 === 0 ? "is-even" : "")}
                style={{ height: isLast ? 1 : 60 * pxPerMin }}
              >
                {!isLast ? <span className="timebar__tickLabel">{label}:00</span> : null}
              </div>
            );
          })}
        </div>

        <div className="timebar__canvas" style={{ height: totalHeight }}>
          <div
            className="timebar__grid"
            style={{
              height: totalHeight,
              "--tbRowPx": `${rowPx}px`,
            }}
          />

          {normalized.laid.map((it) => {
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
                className={"timebar__block " + (it.isOverlapped ? "is-overlap" : "")}
                style={{
                  top,
                  height,
                  left: `calc(${leftPct}% + 2px)`,
                  width: `calc(${widthPct}% - 4px)`,
                  border,
                  background: bg,
                }}
                title={`${it.raw?.title ?? ""} · ${minToHHMM(it.startMin)}~${minToHHMM(it.endMin)}${it.isOverlapped ? " · 겹침" : ""}`}
                onClick={() => onClickEvent?.(it.raw)}
              >
                <div className="timebar__blockTitle">{it.raw?.title || "(제목 없음)"}</div>
                <div className="timebar__blockTime">
                  {minToHHMM(it.startMin)}~{minToHHMM(it.endMin)}
                </div>
                {it.isOverlapped ? <div className="timebar__badge">겹침</div> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
