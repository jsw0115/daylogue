// src/components/common/AdminOnly.jsx
import React from "react";
import useIsAdmin from "../../shared/hooks/useIsAdmin";

export default function AdminOnly({ children, fallback = null }) {
  const isAdmin = useIsAdmin();
  return isAdmin ? children : fallback;
}
