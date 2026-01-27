// FILE: src/main/frontend/src/api.js
import axios from "axios";
import safeStorage from "./shared/utils/safeStorage";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },

  // refreshToken이 HttpOnly 쿠키라면 사실상 필수(특히 다른 포트/도메인일 때)
  withCredentials: true,
});

// 동시에 401이 여러 개 터질 때 refresh는 1번만 하도록 락
let refreshingPromise = null;

/**
 * accessToken은 (권장) 메모리로 들고 가는 게 안전하지만,
 * 지금은 기존 구조를 최대한 유지하려고 safeStorage(auth.session)에서 읽고/갱신하는 방식으로 구성.
 */
function getSession() {
  return safeStorage.getJSON("auth.session");
}

function setSession(next) {
  safeStorage.setJSON("auth.session", next);
}

function updateAccessToken(newAccessToken) {
  const session = getSession() || {};
  setSession({ ...session, accessToken: newAccessToken });
}

function clearSession() {
  safeStorage.removeItem("auth.session");
}

/** refresh 호출(서버는 쿠키의 refreshToken으로 accessToken을 재발급해서 내려줘야 함) */
async function refreshAccessToken() {
  if (refreshingPromise) return refreshingPromise;

  refreshingPromise = (async () => {
    // refresh는 Authorization 없이 가는 게 일반적이라 헤더 제거/skip 처리
    const res = await axios.post(
      "http://localhost:8080/api/auth/refresh",
      null,
      { withCredentials: true }
    );

    // 서버 응답 형태는 프로젝트마다 다름:
    // 1) { success:true, data:{ accessToken } }
    // 2) { accessToken }
    const accessToken = res?.data?.data?.accessToken ?? res?.data?.accessToken;

    if (!accessToken) {
      throw new Error("REFRESH_FAILED: missing accessToken");
    }

    updateAccessToken(accessToken);
    return accessToken;
  })().finally(() => {
    refreshingPromise = null;
  });

  return refreshingPromise;
}

// 요청마다 accessToken 자동 첨부
api.interceptors.request.use((config) => {
  const session = getSession();
  const token = session?.accessToken;

  // refresh/login 같은 엔드포인트는 토큰 붙이지 않게 하고 싶으면 아래 조건 추가 가능
  // if (config.url?.includes("/api/auth/refresh")) return config;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401이면 refresh -> 원요청 1회 재시도
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;
    const originalConfig = err?.config;

    // 네트워크 에러 등은 그대로 던짐
    if (!status || !originalConfig) {
      return Promise.reject(err);
    }

    // refresh 요청 자체가 401이면(만료/폐기) 더 이상 재시도하지 않음
    const isRefreshCall =
      typeof originalConfig.url === "string" &&
      originalConfig.url.includes("/api/auth/refresh");

    // 무한루프 방지: 한 요청당 1번만 retry
    if (status === 401 && !isRefreshCall && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // 새 토큰으로 Authorization 갱신 후 재시도
        originalConfig.headers = originalConfig.headers || {};
        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalConfig);
      } catch (refreshErr) {
        // refresh 실패 -> 세션 제거 -> 로그인 이동은 앱에서 처리
        clearSession();

        // 앱 전역에서 잡을 수 있도록 이벤트 던져두면 편함
        window.dispatchEvent(new CustomEvent("auth:logout"));

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
