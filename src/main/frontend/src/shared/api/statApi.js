// src/main/frontend/src/shared/api/statApi.js
import { get } from "./httpClient";

export function fetchStatDashboard(range = "week") {
  return get(`/stat/dashboard?range=${range}`);
}

export function fetchCategoryStats(range = "month") {
  return get(`/stat/category?range=${range}`);
}

export function fetchPlanActual(range = "month") {
  return get(`/stat/plan-actual?range=${range}`);
}

