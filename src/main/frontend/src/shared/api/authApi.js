// src/main/frontend/src/shared/api/authApi.js
import { post, get } from "./httpClient";

export function login(email, password) {
  // 실제 연결 전까진 더미
  return Promise.resolve({
    accessToken: "dummy-token",
    user: { email, nickname: "푸딩곰" },
  });

  // 실제로는
  // return post("/auth/login", { email, password });
}

export function signup({ email, password, nickname }) {
  return post("/auth/signup", { email, password, nickname });
}

export function me() {
  return get("/auth/me");
}

export function requestPasswordReset(email) {
  return post("/auth/password-reset", { email });
}

