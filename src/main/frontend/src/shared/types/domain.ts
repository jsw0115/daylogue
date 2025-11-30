// src/shared/types/domain.ts

// 전역 카테고리 ID (Timebar 색상 기준)
export type CategoryId =
  | "study"
  | "work"
  | "family"
  | "friends"
  | "health"
  | "rest"
  | "other";

// Plan / Actual 구분
export type TimeBlockType = "PLAN" | "ACTUAL";

// 하루 타임바 블록 (PLAN-001의 기본 단위)
export interface TimeBlock {
  id: string;
  date: string; // 'YYYY-MM-DD'
  startMinutes: number; // 하루 0:00 기준 분 (예: 06:30 = 6 * 60 + 30)
  endMinutes: number;   // 하루 0:00 기준 분
  categoryId: CategoryId;
  title: string;
  memo?: string;
  type: TimeBlockType;
  taskId?: string;
  routineId?: string;
}

// 카테고리별 요약 (분)
export interface DailyCategorySlice {
  categoryId: CategoryId;
  minutes: number;
}

// 하루 요약 (DIARY-002 / WeeklyTimeBricks 등)
export interface DailyCategorySummary {
  date: string;                 // 'YYYY-MM-DD'
  slices: DailyCategorySlice[]; // 카테고리별 분
}

// (옵션) 주간 요약이 필요할 때 사용할 수 있는 타입
export interface WeeklyDaySummary {
  date: string;
  slices: DailyCategorySlice[];
  totalMinutes: number;
}

export interface WeeklySummary {
  weekStartDate: string;
  days: WeeklyDaySummary[];
}

// 루틴
export interface Routine {
  id: string;
  name: string;
  categoryId: CategoryId;
}

// 루틴 히스토리 셀
export interface RoutineTrackerCell {
  routineId: string;
  date: string; // 'YYYY-MM-DD'
  status: "none" | "done" | "skipped";
}
