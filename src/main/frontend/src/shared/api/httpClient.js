// src/main/frontend/src/shared/api/httpClient.js
const BASE_URL = "/api";

/**
 * AccessToken은 "메모리"에만 둔다.
 * - 새로고침 시 사라짐
 * - 앱 시작 시 /api/auth/refresh로 access 복구(부트스트랩) 권장
 */
let accessToken = null;

/** 동시에 여러 요청이 401일 때 refresh는 1번만 */
let refreshingPromise = null;

export function setAccessToken(token) {
  accessToken = token || null;
}

export function clearAccessToken() {
  accessToken = null;
}

export function getAccessToken() {
  return accessToken;
}

/**
 * refresh 호출 (HttpOnly 쿠키 기반)
 * 서버는 refresh cookie를 읽고 새 accessToken을 내려줘야 함.
 * 응답 예: { accessToken, expiresIn }
 */
async function refreshAccessToken() {
  if (refreshingPromise) return refreshingPromise;

  refreshingPromise = (async () => {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      // refresh 실패면 로그인 풀린 상태로 처리
      clearAccessToken();
      const text = await res.text().catch(() => "");
      throw new Error(`REFRESH_FAILED: ${res.status} ${text}`);
    }

    // 204로 내려주는 서버도 있는데, 그 경우는 근거 부족(현재 너의 서버 스펙 미확정)
    // 여기서는 JSON을 기본으로 가정
    const data = await res.json().catch(() => null);
    if (!data?.accessToken) {
      clearAccessToken();
      throw new Error("REFRESH_FAILED: missing accessToken in response");
    }

    setAccessToken(data.accessToken);
    return data.accessToken;
  })().finally(() => {
    refreshingPromise = null;
  });

  return refreshingPromise;
}

async function parseErrorBody(res) {
  const ct = res.headers.get("content-type") || "";
  try {
    if (ct.includes("application/json")) {
      return await res.json();
    }
    return await res.text();
  } catch {
    return "";
  }
}

/**
 * options에 추가로 커스텀 플래그를 지원
 * - options.skipAuth: Authorization 부착/401 refresh 재시도 대상에서 제외
 */
export async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const headers = { ...defaultHeaders, ...(options.headers || {}) };

  // Authorization 자동 첨부
  const token = getAccessToken();
  const skipAuth = !!options.skipAuth;

  if (!skipAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // fetch 기본 credentials는 same-origin이지만, 분리 배포 대비 include를 기본으로 둠
  const fetchOptions = {
    ...options,
    headers,
    credentials: options.credentials || "include",
  };

  // GET/HEAD에서는 body 제거(브라우저 경고 방지)
  const method = (fetchOptions.method || "GET").toUpperCase();
  if ((method === "GET" || method === "HEAD") && "body" in fetchOptions) {
    delete fetchOptions.body;
  }

  const res = await fetch(url, fetchOptions);

  // 401 처리: refresh -> 원요청 1회 재시도
  if (res.status === 401 && !skipAuth && !options._retry) {
    try {
      await refreshAccessToken();

      const retryOptions = {
        ...options,
        _retry: true,
        headers: {
          ...defaultHeaders,
          ...(options.headers || {}),
          Authorization: `Bearer ${getAccessToken()}`,
        },
        credentials: options.credentials || "include",
      };

      const retryRes = await fetch(url, retryOptions);

      if (!retryRes.ok) {
        const body = await parseErrorBody(retryRes);
        throw new Error(`API error: ${retryRes.status} ${typeof body === "string" ? body : JSON.stringify(body)}`);
      }

      if (retryRes.status === 204) return null;
      return retryRes.json();
    } catch (e) {
      // refresh 자체가 실패하면 여기로 떨어짐 -> 로그인 화면으로 보내는 처리는 상위에서
      throw e;
    }
  }

  if (!res.ok) {
    const body = await parseErrorBody(res);
    throw new Error(`API error: ${res.status} ${typeof body === "string" ? body : JSON.stringify(body)}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export function get(path, options = {}) {
  return request(path, { method: "GET", ...options });
}

export function post(path, body, options = {}) {
  return request(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
    ...options,
  });
}

export function put(path, body, options = {}) {
  return request(path, {
    method: "PUT",
    body: body === undefined ? undefined : JSON.stringify(body),
    ...options,
  });
}

export function del(path, options = {}) {
  return request(path, { method: "DELETE", ...options });
}
