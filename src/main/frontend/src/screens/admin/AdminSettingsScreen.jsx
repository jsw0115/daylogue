
// FILE: src/main/frontend/src/screens/admin/AdminSettingsScreen.jsx
import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Card, Typography } from "antd";
import clsx from "clsx";

import AdminUserScreen from "./AdminUserScreen";
import AdminNoticeScreen from "./AdminNoticeScreen";
import AdminLogScreen from "./AdminLogScreen";
import AdminStatsScreen from "./AdminStatsScreen";

const { Title, Text } = Typography;

const TABS = [
  { key: "users", label: "사용자/권한" },
  { key: "notices", label: "공지/배너" },
  { key: "logs", label: "로그/감사" },
  { key: "stats", label: "통계" },
];

export default function AdminSettingsScreen() {
  const [tab, setTab] = useState("users");

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <Title level={3} style={{ margin: 0 }}>관리자 설정(데모)</Title>
          <Text type="secondary">권한 체크는 AdminOnly로 보호 · 여기서는 UI 확인 목적</Text>
        </div>
      </div>

      <Card>
        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List className="admin-ui__tabs" aria-label="admin tabs">
            {TABS.map((t) => (
              <Tabs.Trigger
                key={t.key}
                value={t.key}
                className={clsx("admin-ui__tab")}
              >
                {t.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <div style={{ marginTop: 12 }}>
            <Tabs.Content value="users">
              <AdminUserScreen />
            </Tabs.Content>
            <Tabs.Content value="notices">
              <AdminNoticeScreen />
            </Tabs.Content>
            <Tabs.Content value="logs">
              <AdminLogScreen />
            </Tabs.Content>
            <Tabs.Content value="stats">
              <AdminStatsScreen />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </Card>
    </div>
  );
}
