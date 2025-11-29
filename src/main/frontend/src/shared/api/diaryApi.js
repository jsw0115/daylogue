// src/main/frontend/src/shared/api/diaryApi.js
import { get, post, put, del } from "./httpClient";

export function fetchDiaryCalendar(year, month) {
  return get(`/diary/calendar?year=${year}&month=${month}`);
}

export function fetchDiary(date) {
  return get(`/diary/${date}`);
}

export function saveDiary(date, body) {
  return post(`/diary/${date}`, body);
}

export function deleteDiary(date) {
  return del(`/diary/${date}`);
}

