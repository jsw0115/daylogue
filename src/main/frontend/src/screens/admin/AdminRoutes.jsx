
// FILE: src/screens/admin/AdminRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./AdminLayout";
import AdminDashboardScreen from "./AdminDashboardScreen";
import AdminUserScreen from "./AdminUserScreen";
import AdminNoticeScreen from "./AdminNoticeScreen";
import AdminLogScreen from "./AdminLogScreen";
import AdminStatsScreen from "./AdminStatsScreen";
import AdminSettingsScreen from "./AdminSettingsScreen";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardScreen />} />
        <Route path="users" element={<AdminUserScreen />} />
        <Route path="notices" element={<AdminNoticeScreen />} />
        <Route path="logs" element={<AdminLogScreen />} />
        <Route path="stats" element={<AdminStatsScreen />} />
        <Route path="settings" element={<AdminSettingsScreen />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
