// FILE : src/screens/admin/AdminSettingsScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Card, Select, Space, Typography, Tag } from "antd";
import clsx from "clsx";
import {
  Users, Shield, Megaphone, ScrollText, BarChart3,
  Settings, LifeBuoy, CreditCard, MessageSquareWarning,
} from "lucide-react";

// Sub Screens
import AdminUserScreen from "./AdminUserScreen";
import AdminNoticeScreen from "./AdminNoticeScreen";
import AdminLogScreen from "./AdminLogScreen";
import AdminStatsScreen from "./AdminStatsScreen";
import AdminAccessScreen from "./AdminAccessScreen";
import AdminPolicyScreen from "./AdminPolicyScreen";
import AdminCsScreen from "./AdminCsScreen";
import AdminBillingScreen from "./AdminBillingScreen";
import AdminCommunityScreen from "./AdminCommunityScreen";

import "../../styles/screens/admin-ui.css";

const { Title, Text } = Typography;

const ADMIN_ROLES = [
  { value: "superAdmin", label: "Super Admin" },
  { value: "ops", label: "Operations" },
  { value: "cs", label: "CS Manager" },
  { value: "moderator", label: "Moderator" },
  { value: "finance", label: "Finance" },
];

const ROLE_ALLOWED_TABS = {
  superAdmin: ["users", "access", "notices", "logs", "stats", "policies", "cs", "billing", "community"],
  ops: ["users", "access", "notices", "logs", "stats", "policies", "community"],
  cs: ["users", "logs", "cs", "notices"],
  moderator: ["users", "logs", "community", "notices"],
  finance: ["users", "logs", "billing"],
};

const TAB_DEFS = [
  { key: "users", label: "사용자/권한", icon: <Users size={16} />, element: <AdminUserScreen /> },
  { key: "access", label: "접근통제", icon: <Shield size={16} />, element: <AdminAccessScreen /> },
  { key: "notices", label: "공지/배너", icon: <Megaphone size={16} />, element: <AdminNoticeScreen /> },
  { key: "logs", label: "로그/감사", icon: <ScrollText size={16} />, element: <AdminLogScreen /> },
  { key: "stats", label: "통계", icon: <BarChart3 size={16} />, element: <AdminStatsScreen /> },
  { key: "policies", label: "운영정책", icon: <Settings size={16} />, element: <AdminPolicyScreen /> },
  { key: "cs", label: "CS", icon: <LifeBuoy size={16} />, element: <AdminCsScreen /> },
  { key: "billing", label: "결제/구독", icon: <CreditCard size={16} />, element: <AdminBillingScreen /> },
  { key: "community", label: "커뮤니티", icon: <MessageSquareWarning size={16} />, element: <AdminCommunityScreen /> },
];

export default function AdminSettingsScreen() {
  const [role, setRole] = useState("superAdmin");
  const [tab, setTab] = useState("users");

  const allowedTabs = useMemo(() => new Set(ROLE_ALLOWED_TABS[role] || []), [role]);
  const visibleTabs = useMemo(() => TAB_DEFS.filter((t) => allowedTabs.has(t.key)), [allowedTabs]);

  useEffect(() => {
    if (!allowedTabs.has(tab)) {
      setTab(visibleTabs[0]?.key || "users");
    }
  }, [role, allowedTabs, tab, visibleTabs]);

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <Title level={3} style={{ margin: 0 }}>관리자 설정 (Admin Console)</Title>
          <Text type="secondary">시스템 전반을 모니터링하고 제어합니다.</Text>
        </div>
        <Space wrap align="center">
          <Tag color="processing">Current Role</Tag>
          <Select
            value={role}
            onChange={setRole}
            style={{ width: 140 }}
            options={ADMIN_ROLES}
          />
        </Space>
      </div>

      <Card bodyStyle={{ padding: '16px' }}>
        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List className="admin-ui__tabs">
            {visibleTabs.map((t) => (
              <Tabs.Trigger key={t.key} value={t.key} className="admin-ui__tab">
                <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                  {t.icon} {t.label}
                </span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          <div style={{ marginTop: 20 }}>
            {visibleTabs.map((t) => (
              <Tabs.Content key={t.key} value={t.key}>
                {t.element}
              </Tabs.Content>
            ))}
          </div>
        </Tabs.Root>
      </Card>
    </div>
  );
}