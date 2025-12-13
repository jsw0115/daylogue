// src/shared/utils/permissionScopes.js

export const ROLE_ORDER = ["viewer", "editor", "owner"]; // owner는 공유로 부여 불가(작성자 고정)
export const SCOPE_ORDER = ["none", "single", "future", "all"];

export function scopeRank(scope) {
  const idx = SCOPE_ORDER.indexOf(scope);
  return idx >= 0 ? idx : 0;
}

export function roleRank(role) {
  const idx = ROLE_ORDER.indexOf(role);
  return idx >= 0 ? idx : 0;
}

export function clampScope(requested, maxAllowed) {
  const r = scopeRank(requested);
  const m = scopeRank(maxAllowed);
  return SCOPE_ORDER[Math.min(r, m)];
}

export function isUpgradeScope(prev, next) {
  return scopeRank(next) >= scopeRank(prev);
}

export function clampRole(requestedRole, maxRole) {
  // owner는 공유로 부여 불가. 서버도 강제해야 함.
  const req = requestedRole === "owner" ? "editor" : requestedRole;
  const r = roleRank(req);
  const m = roleRank(maxRole);
  return ROLE_ORDER[Math.min(r, m)];
}

export function isUpgradeRole(prev, next) {
  // viewer -> editor (업그레이드), editor -> viewer (다운그레이드)
  return roleRank(next) >= roleRank(prev);
}

export function minScope(a, b) {
  return SCOPE_ORDER[Math.min(scopeRank(a), scopeRank(b))];
}
