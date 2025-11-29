// src/main/frontend/src/shared/api/routineApi.js
import { get, post, put, del } from "./httpClient";

export function fetchRoutines() {
  return get("/routines");
}

export function saveRoutine(body) {
  if (body.id) return put(`/routines/${body.id}`, body);
  return post("/routines", body);
}

export function deleteRoutine(id) {
  return del(`/routines/${id}`);
}

export function fetchRoutineHistory(params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/routines/history?${query}`);
}

