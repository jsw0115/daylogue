// FILE: src/main/frontend/src/screens/admin/AdminUserScreen.jsx
import React, { useMemo, useState } from "react";
import { Button, Card, Drawer, Form, Input, Select, Space, Table, Tag, Typography } from "antd";
import { Search, Shield, User, Ban, CheckCircle2 } from "lucide-react";

const { Title, Text } = Typography;

const MOCK_USERS = [
  { id: "ULID01", email: "demo@example.com", name: "Demo User", role: "ADMIN", status: "ACTIVE", mode: "B", createdAt: "2025-01-01" },
  { id: "ULID02", email: "user1@example.com", name: "플래너 유저", role: "USER", status: "ACTIVE", mode: "J", createdAt: "2025-02-10" },
  { id: "ULID03", email: "user2@example.com", name: "루틴러", role: "USER", status: "INACTIVE", mode: "P", createdAt: "2025-06-04" },
];

export default function AdminUserScreen() {
  const [form] = Form.useForm();
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const rows = useMemo(() => {
    return MOCK_USERS.filter((u) => {
      const hit = !q.trim() || u.email.includes(q) || u.name.includes(q);
      const hitRole = !role || u.role === role;
      const hitStatus = !status || u.status === status;
      return hit && hitRole && hitStatus;
    });
  }, [q, role, status]);

  const columns = [
    { title: "이메일", dataIndex: "email", key: "email" },
    { title: "닉네임", dataIndex: "name", key: "name" },
    { title: "권한", dataIndex: "role", key: "role", render: (v) => <Tag color={v === 'ADMIN' ? 'blue' : 'default'}>{v}</Tag> },
    { title: "상태", dataIndex: "status", key: "status", render: (v) => <Tag color={v === 'ACTIVE' ? 'success' : 'error'}>{v}</Tag> },
    { title: "모드", dataIndex: "mode", key: "mode" },
    { title: "가입일", dataIndex: "createdAt", key: "createdAt" },
  ];

  const openUser = (u) => {
    setSelected(u);
    setDrawerOpen(true);
    form.setFieldsValue(u);
  };

  return (
    <div className="admin-two-col">
      <Card title="검색 필터">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input placeholder="검색어" value={q} onChange={(e) => setQ(e.target.value)} prefix={<Search size={16} />} allowClear />
          <Select placeholder="권한" style={{ width: "100%" }} value={role} onChange={setRole} options={[{ value: "", label: "전체" }, { value: "ADMIN", label: "ADMIN" }, { value: "USER", label: "USER" }]} />
          <Select placeholder="상태" style={{ width: "100%" }} value={status} onChange={setStatus} options={[{ value: "", label: "전체" }, { value: "ACTIVE", label: "ACTIVE" }, { value: "INACTIVE", label: "INACTIVE" }]} />
          <Button onClick={() => { setQ(""); setRole(""); setStatus(""); }}>초기화</Button>
        </Space>
      </Card>

      <Card title="사용자 목록">
        <Table rowKey="id" columns={columns} dataSource={rows} pagination={{ pageSize: 8 }} onRow={(record) => ({ onClick: () => openUser(record), style: { cursor: "pointer" } })} />
      </Card>

      <Drawer title="사용자 상세 정보" open={drawerOpen} onClose={() => setDrawerOpen(false)} width={400}>
        {selected && (
          <Form layout="vertical" form={form}>
            <Form.Item label="이메일" name="email"><Input disabled /></Form.Item>
            <Form.Item label="닉네임" name="name"><Input /></Form.Item>
            <Form.Item label="권한" name="role"><Select options={[{ value: "ADMIN", label: "ADMIN" }, { value: "USER", label: "USER" }]} /></Form.Item>
            <Form.Item label="상태" name="status"><Select options={[{ value: "ACTIVE", label: "ACTIVE" }, { value: "INACTIVE", label: "INACTIVE" }]} /></Form.Item>
            <Space>
              <Button type="primary" onClick={() => alert("저장됨")}>저장</Button>
              <Button danger>강제 탈퇴</Button>
            </Space>
          </Form>
        )}
      </Drawer>
    </div>
  );
}