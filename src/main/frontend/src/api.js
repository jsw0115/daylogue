// FILE: src/main/frontend/src/api.js
import axios from "axios";
import safeStorage from "./shared/utils/safeStorage";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

// 요청마다 accessToken 자동 첨부
api.interceptors.request.use((config) => {
  const session = safeStorage.getJSON("auth.session");
  const token = session?.accessToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// (선택) 응답 공통 에러 로깅
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // 네트워크/서버 응답 확인
    // console.log("API ERROR:", err?.response?.status, err?.response?.data);
    return Promise.reject(err);
  }
);

export default api;
