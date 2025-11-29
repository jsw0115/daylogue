// src/main/frontend/src/shared/api/httpClient.js
const BASE_URL = "/api";

export async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const res = await fetch(url, {
    headers: { ...defaultHeaders, ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} ${text}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export function get(path) {
  return request(path, { method: "GET" });
}

export function post(path, body) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function put(path, body) {
  return request(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function del(path) {
  return request(path, { method: "DELETE" });
}

