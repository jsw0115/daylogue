// src/main/frontend/src/shared/api/plannerApi.js
import { get, post } from "./httpClient";

export function fetchDailyPlan(date) {
  // TODO: 백엔드 붙이면 get("/planner/daily?date=...")
  return Promise.resolve({
    date,
    goals: ["SQLD 1강 듣기", "운동 30분"],
    blocks: [],
  });
}

export function saveDailyPlan(date, payload) {
  return post("/planner/daily", { date, ...payload });
}

export function fetchWeeklySummary(weekStart) {
  return get(`/planner/weekly?start=${weekStart}`);
}

