// src/shared/utils/session.js
import { safeStorage } from "./safeStorage";
import { notifySessionChanged } from "../hooks/useIsAdmin";

export function setSession({ userId, name, email, role, roles }) {
  const roleNorm = role || (Array.isArray(roles) && roles.includes("ADMIN") ? "admin" : "user");
  const isAdmin = String(roleNorm).toLowerCase().includes("admin") || (roles || []).includes("ADMIN");

  safeStorage.setJSON("session", {
    userId,
    name,
    email,
    role: roleNorm,
    roles: Array.isArray(roles) ? roles : [],
    isAdmin,
    updatedAt: Date.now(),
  });
  safeStorage.setJSON("session.isAdmin", isAdmin);

  notifySessionChanged();
}
