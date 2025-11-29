// src/main/frontend/src/shared/api/memoApi.js
import { get, post, del } from "./httpClient";

export function fetchMemos(params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/memos?${query}`);
}

export function saveMemo(body) {
  return post("/memos", body);
}

export function deleteMemo(id) {
  return del(`/memos/${id}`);
}

export function sttUpload(formData) {
  // 음성 업로드용 (multipart/form-data)
  return fetch("/api/memos/stt", {
    method: "POST",
    body: formData,
  }).then((res) => res.json());
}

