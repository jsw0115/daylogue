import React, { useEffect, useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Card, Select, Space, Typography, Tag } from "antd";
import clsx from "clsx";
import {
  Users,
  Shield,
  Megaphone,
  ScrollText,
  BarChart3,
  Settings,
  LifeBuoy,
  CreditCard,
  MessageSquareWarning,
} from "lucide-react";

import AdminUserScreen from "./AdminUserScreen";
import AdminNoticeScreen from "./AdminNoticeScreen";
import AdminLogScreen from "./AdminLogScreen";
import AdminStatsScreen from "./AdminStatsScreen";

// NEW screens
import AdminAccessScreen from "./AdminAccessScreen";
import AdminPolicyScreen from "./AdminPolicyScreen";
import AdminCsScreen from "./AdminCsScreen";
import AdminBillingScreen from "./AdminBillingScreen";
import AdminCommunityScreen from "./AdminCommunityScreen";

import "../../styles/screens/admin-ui.css";


const { Title, Text } = Typography;

const ADMIN_ROLES = [
  { value: "superAdmin", label: "superAdmin" },
  { value: "ops", label: "ops" },
  { value: "cs", label: "cs" },
  { value: "moderator", label: "moderator" },
  { value: "finance", label: "finance" },
];

/**
 * Demo RBAC
 * - 실제 서비스에서는 서버에서 role/permission 내려주고, FE는 “표시”만 통제.
 * - 서버는 반드시 재검증(권한 체크).
 */
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
  const [role, setRole] = useState("superAdmin"); // demo
  const [tab, setTab] = useState("users");

  const allowedTabs = useMemo(() => {
    return new Set(ROLE_ALLOWED_TABS[role] || []);
  }, [role]);

  const visibleTabs = useMemo(() => {
    return TAB_DEFS.filter((t) => allowedTabs.has(t.key));
  }, [allowedTabs]);

  useEffect(() => {
    // role 변경 시 현재 탭이 허용되지 않으면 첫 탭으로 이동
    if (!allowedTabs.has(tab)) {
      const first = visibleTabs[0]?.key || "users";
      setTab(first);
    }
  }, [role, allowedTabs, tab, visibleTabs]);

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <Title level={3} style={{ margin: 0 }}>
            관리자 설정(데모)
          </Title>
          <Text type="secondary">
            실제 운영: 서버 권한 재검증 필수 · 여기서는 UI 구조/흐름 확인 목적
          </Text>
        </div>

        <Space wrap align="center">
          <Tag color="processing">ROLE</Tag>
          <Select
            value={role}
            onChange={setRole}
            style={{ width: 160 }}
            options={ADMIN_ROLES}
          />
        </Space>
      </div>

      <Card>
        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List className="admin-ui__tabs" aria-label="admin tabs">
            {visibleTabs.map((t) => (
              <Tabs.Trigger
                key={t.key}
                value={t.key}
                className={clsx("admin-ui__tab")}
              >
                <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                  {t.icon}
                  {t.label}
                </span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <div style={{ marginTop: 12 }}>
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
