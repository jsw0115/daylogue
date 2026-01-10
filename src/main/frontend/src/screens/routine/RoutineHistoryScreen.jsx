// FILE: src/screens/routine/RoutineHistoryScreen.jsx
import React, { useMemo, useState } from "react";
import PageContainer from "../../layout/PageContainer";
import DatePicker from "../../components/common/DatePicker";
import Select from "../../components/common/Select";
import DashboardCard from "../../components/dashboard/DashboardCard";
import StatValue from "../../components/dashboard/StatValue";
import RoutineTrackerGrid from "../../components/routine/RoutineTrackerGrid";
import Modal from "../../components/common/Modal";

/**
 * ROUT-003-F01: 루틴 체크 (히스토리 표시)
 * ROUT-005-F01: 루틴 히스토리 조회
 * ROUT-005-F02: 루틴 달성률
 * (추가) ROUT-010: 과거 체크/수정(Backfill), 셀 상세 편집(상태/메모)
 */

const MOCK_ROUTINES = [
  { id: "r1", name: "아침 스트레칭", icon: "🌅" },
  { id: "r2", name: "저녁 회고 일기", icon: "📓" },
];

const MOCK_CELLS = [
  { routineId: "r1", date: "2025-11-30", status: "done" },
  { routineId: "r1", date: "2025-12-01", status: "done" },
  { routineId: "r1", date: "2025-12-02", status: "missed" },
  { routineId: "r2", date: "2025-12-01", status: "done" },
  { routineId: "r2", date: "2025-12-03", status: "skip" },
];

const STATUS_OPTIONS = [
  { value: "done", label: "완료" },
  { value: "missed", label: "미수행" },
  { value: "skip", label: "스킵(분모 제외)" },
];

function ymdToday() {
  return new Date().toISOString().slice(0, 10);
}

function parseYmd(ymd) {
  const [yy, mm, dd] = String(ymd || "").split("-").map((x) => parseInt(x, 10));
  if (!yy || !mm || !dd) return new Date();
  return new Date(yy, mm - 1, dd, 0, 0, 0, 0);
}

function toYmd(d) {
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function addDays(ymd, n) {
  const d = parseYmd(ymd);
  d.setDate(d.getDate() + n);
  return toYmd(d);
}

function calcCompletionRate(cells) {
  const relevant = (cells || []).filter((c) => c.status !== "skip");
  const denom = relevant.length;
  if (denom === 0) return 0;
  const num = relevant.filter((c) => c.status === "done").length;
  return Math.round((num / denom) * 100);
}

/**
 * 단순 스트릭(전체 기준):
 * - 날짜별로 "스킵 제외한 셀"이 하나 이상 존재하고
 * - 그 날의 스킵 제외 셀이 전부 done이면 streak +1
 * - 그 외는 중단
 *
 * 실제 정책(예: "해당 날짜에 예정된 루틴만", "Anytime 제외" 등)은
 * 루틴 스케줄/예외일과 함께 계산해야 정확해집니다.
 */
function calcStreak(cells, maxLookbackDays = 365) {
  const map = new Map(); // date -> { done: n, missed: n, relevant: n }
  (cells || []).forEach((c) => {
    const k = c.date;
    if (!map.has(k)) map.set(k, { done: 0, missed: 0, relevant: 0 });
    if (c.status === "skip") return;
    const agg = map.get(k);
    agg.relevant += 1;
    if (c.status === "done") agg.done += 1;
    if (c.status === "missed") agg.missed += 1;
  });

  let streak = 0;
  let cur = ymdToday();
  for (let i = 0; i < maxLookbackDays; i += 1) {
    const agg = map.get(cur);
    if (!agg || agg.relevant === 0) break;
    if (agg.done === agg.relevant) {
      streak += 1;
      cur = addDays(cur, -1);
      continue;
    }
    break;
  }
  return streak;
}

function nextStatus(cur) {
  if (cur === "done") return "missed";
  if (cur === "missed") return "skip";
  return "done"; // skip or undefined
}

function RoutineHistoryScreen() {
  const today = ymdToday();
  const [startDate, setStartDate] = useState(today);
  const [period, setPeriod] = useState("30");

  const [routines] = useState(MOCK_ROUTINES);
  const [cells, setCells] = useState(MOCK_CELLS);

  // cell edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editCell, setEditCell] = useState(null); // { routineId, date, status, memo? }

  const dayCount = period === "7" ? 7 : period === "14" ? 14 : 30;

  const completionRate = useMemo(() => calcCompletionRate(cells), [cells]);
  const streak = useMemo(() => calcStreak(cells), [cells]);

  const findCell = (routineId, dateKey) =>
    (cells || []).find((c) => c.routineId === routineId && c.date === dateKey);

  const upsertCell = (routineId, dateKey, patch) => {
    setCells((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const idx = list.findIndex((c) => c.routineId === routineId && c.date === dateKey);
      if (idx === -1) {
        return [...list, { routineId, date: dateKey, status: "done", ...patch }];
      }
      const next = list.slice();
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  };

  const removeCell = (routineId, dateKey) => {
    setCells((prev) => (prev || []).filter((c) => !(c.routineId === routineId && c.date === dateKey)));
  };

  const handleCellToggle = (routineId, dateKey) => {
    // ROUT-003-F01: 토글 (Backfill 포함)
    const cell = findCell(routineId, dateKey);
    const cur = cell?.status;
    const ns = nextStatus(cur);
    upsertCell(routineId, dateKey, { status: ns });
  };

  const handleCellLongPress = (routineId, dateKey) => {
    // ROUT-005-F01: 상세 편집
    const cell = findCell(routineId, dateKey);
    setEditCell({
      routineId,
      date: dateKey,
      status: cell?.status || "done",
      memo: cell?.memo || "",
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditCell(null);
  };

  const saveEdit = () => {
    if (!editCell) return;
    upsertCell(editCell.routineId, editCell.date, {
      status: editCell.status,
      memo: editCell.memo || "",
    });
    closeEdit();
  };

  const deleteEdit = () => {
    if (!editCell) return;
    const ok = window.confirm("이 날짜의 기록을 삭제할까요?");
    if (!ok) return;
    removeCell(editCell.routineId, editCell.date);
    closeEdit();
  };

  const routineNameById = useMemo(() => {
    const m = new Map();
    routines.forEach((r) => m.set(r.id, `${r.icon || ""} ${r.name || ""}`.trim()));
    return m;
  }, [routines]);

  return (
    <PageContainer
      screenId="ROUT-003"
      title="루틴 히스토리 / 달성률"
      subtitle="그리드에서 과거 기록(Backfill)과 스킵/메모 편집까지 가능합니다."
    >
      <div className="screen routine-history-screen">
        <section className="filter-bar">
          <div className="filter-bar__row">
            <DatePicker label="시작일" value={startDate} onChange={setStartDate} />
            <Select
              label="기간"
              value={period}
              onChange={setPeriod}
              options={[
                { value: "7", label: "7일" },
                { value: "14", label: "14일" },
                { value: "30", label: "30일" },
              ]}
            />
          </div>
        </section>

        <div className="routine-history-layout">
          <DashboardCard title="루틴 히스토리 그리드" subtitle="각 루틴 × 날짜별 수행 현황">
            <RoutineTrackerGrid
              startDate={startDate}
              dayCount={dayCount}
              routines={routines}
              cells={cells}
              onCellToggle={handleCellToggle}
              onCellLongPress={handleCellLongPress}
            />
            <div className="text-muted font-small" style={{ marginTop: 10 }}>
              클릭: done → missed → skip 순환 / 길게 누름: 상태·메모 편집
            </div>
          </DashboardCard>

          <DashboardCard title="달성률 / 스트릭" subtitle="갓생 점수 계산에 활용되는 핵심 지표">
            <div className="routine-stats-row">
              <StatValue
                label="기간 달성률"
                value={completionRate}
                unit="%"
                trend={{ direction: "up", text: "스킵은 분모에서 제외" }}
              />
              <StatValue
                label="현재 스트릭"
                value={streak}
                unit="일"
                trend={{ direction: "up", text: "단순 계산(정책 확정 시 개선 가능)" }}
              />
            </div>
            <p className="routine-stats-helper">
              루틴 달성률은 STAT-004 갓생 리포트에서도 함께 사용됩니다.
            </p>
          </DashboardCard>
        </div>

        {/* 셀 상세 편집 모달 */}
        <Modal
          open={editOpen}
          title="기록 편집"
          onClose={closeEdit}
          footer={
            <>
              <button className="btn btn--ghost btn--sm" type="button" onClick={closeEdit}>
                닫기
              </button>
              <button className="btn btn--danger btn--sm" type="button" onClick={deleteEdit}>
                기록 삭제
              </button>
              <button className="btn btn--primary btn--sm" type="button" onClick={saveEdit}>
                저장
              </button>
            </>
          }
        >
          {editCell ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div className="text-muted font-small">
                {routineNameById.get(editCell.routineId)} · {editCell.date}
              </div>

              <div className="routineCreateModal__field">
                <label className="routineCreateModal__label">상태</label>
                <select
                  className="routineCreateModal__input"
                  value={editCell.status}
                  onChange={(e) => setEditCell((p) => ({ ...p, status: e.target.value }))}
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="routineCreateModal__field">
                <label className="routineCreateModal__label">메모(선택)</label>
                <textarea
                  className="routineCreateModal__input"
                  style={{ minHeight: 90, resize: "vertical" }}
                  value={editCell.memo}
                  onChange={(e) => setEditCell((p) => ({ ...p, memo: e.target.value }))}
                  placeholder="예) 컨디션이 안 좋아서 강도 낮춤"
                />
              </div>

              <div className="text-muted font-small">
                스킵은 달성률 분모에서 제외하는 정책을 전제로 표시했습니다.
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </PageContainer>
  );
}

export default RoutineHistoryScreen;
