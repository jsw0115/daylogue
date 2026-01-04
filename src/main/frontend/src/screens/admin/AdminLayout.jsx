
// FILE: src/screens/admin/AdminLayout.jsx
import React, { useMemo, useState } from "react";
import { Layout, Menu, Button, Typography, Grid, Drawer } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Bell,
  ScrollText,
  BarChart3,
  Settings,
  PanelLeft,
} from "lucide-react";

import "../../styles/screens/admin-ui.css";
import AdminOnly from "../../components/common/AdminOnly";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

function getSelectedKey(pathname) {
  // /admin, /admin/users, /admin/notices ...
  if (pathname === "/admin" || pathname === "/admin/") return "dashboard";
  if (pathname.startsWith("/admin/users")) return "users";
  if (pathname.startsWith("/admin/notices")) return "notices";
  if (pathname.startsWith("/admin/logs")) return "logs";
  if (pathname.startsWith("/admin/stats")) return "stats";
  if (pathname.startsWith("/admin/settings")) return "settings";
  return "dashboard";
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedKey = useMemo(() => getSelectedKey(location.pathname), [location.pathname]);

  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const items = [
    { key: "dashboard", icon: <LayoutDashboard size={18} />, label: "대시보드", path: "/admin" },
    { key: "users", icon: <Users size={18} />, label: "사용자/권한", path: "/admin/users" },
    { key: "notices", icon: <Bell size={18} />, label: "공지/배너", path: "/admin/notices" },
    { key: "logs", icon: <ScrollText size={18} />, label: "로그/감사", path: "/admin/logs" },
    { key: "stats", icon: <BarChart3 size={18} />, label: "통계 리포트", path: "/admin/stats" },
    { key: "settings", icon: <Settings size={18} />, label: "관리자 설정", path: "/admin/settings" },
  ];

  const menu = (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      items={items.map((it) => ({ key: it.key, icon: it.icon, label: it.label }))}
      onClick={({ key }) => {
        const target = items.find((x) => x.key === key)?.path ?? "/admin";
        if (isMobile) setDrawerOpen(false);
        navigate(target);
      }}
      className="admin-ui__menu"
    />
  );

  return (
    <AdminOnly fallback={<div className="screen"><div className="card">권한이 없습니다.</div></div>}>
      <Layout className="admin-ui">
        {!isMobile ? (
          <Sider width={260} className="admin-ui__sider" breakpoint="lg" collapsedWidth={72}>
            <div className="admin-ui__brand">
              <div className="admin-ui__brandIcon">TF</div>
              <div className="admin-ui__brandText">
                <div className="admin-ui__brandTitle">TimeFlow Admin</div>
                <div className="admin-ui__brandSub">운영/정책/감사</div>
              </div>
            </div>
            {menu}
          </Sider>
        ) : (
          <Drawer
            title="관리자 메뉴"
            placement="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            bodyStyle={{ padding: 0 }}
          >
            {menu}
          </Drawer>
        )}

        <Layout>
          <Header className="admin-ui__header">
            <div className="admin-ui__headerLeft">
              {isMobile ? (
                <Button
                  icon={<PanelLeft size={18} />}
                  onClick={() => setDrawerOpen(true)}
                />
              ) : null}

              <div>
                <Title level={5} style={{ margin: 0 }}>관리자</Title>
                <Text type="secondary" className="admin-ui__headerSub">
                  데모 UI · 실제 운영은 서버 권한으로 보호
                </Text>
              </div>
            </div>

            <div className="admin-ui__headerRight">
              <Text type="secondary">v0 데모</Text>
            </div>
          </Header>

          <Content className="admin-ui__content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </AdminOnly>
  );
}
