// FILE: src/main/frontend/src/shared/api/plannerApi.js
import { get, post } from "./httpClient";

/**
 * 일간 플래너 조회 (PLAN-001)
 * - 앞으로는 이 함수를 기준으로 쓰되,
 * - 기존 코드 호환을 위해 fetchDailyPlan 도 alias 로 유지.
 */
export async function fetchDailyPlanner(date) {
  // TODO: 백엔드 연동 시:
  // return get(`/planner/daily?date=${date}`);

  // 임시 더미 데이터
  return {
    date,
    goals: ["SQLD 1강 듣기", "운동 30분"],
    planBlocks: [],   // 계획 타임블록
    actualBlocks: [], // 실제 타임블록
  };
}

// ✅ 기존 코드 호환용 alias (DailyPlannerScreen, Weekly/Monthly 에서 사용)
export const fetchDailyPlan = fetchDailyPlanner;

/**
 * 일간 플래너 저장
 */
export function saveDailyPlan(date, payload) {
  return post("/planner/daily", { date, ...payload });
}

/**
 * 주간 요약 조회 (PLAN-002 – 주간 플래너)
 * - WeeklyPlannerScreen 에서 import { fetchWeeklySummary } 로 사용.
 */
export function fetchWeeklySummary(weekStart) {
  // TODO: 백엔드 연동 시:
  // return get(`/planner/weekly?start=${weekStart}`);

  // 임시 더미 데이터 구조
  return Promise.resolve({
    weekStart,
    days: [
      // { date: "2025-12-01", planMinutes: 300, actualMinutes: 240, categorySlices: [...] }
    ],
  });
}

/**
 * (선택) 월간 요약 – MonthlyPlannerScreen 에서 필요하면 사용
 * 지금은 사용 안 해도 문제 없음
 */
export function fetchMonthlySummary(year, month) {
  return get(`/planner/monthly?year=${year}&month=${month}`);
}
