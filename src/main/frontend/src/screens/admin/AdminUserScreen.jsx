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

function roleTag(role) {
  return role === "ADMIN" ? <Tag color="processing">ADMIN</Tag> : <Tag>USER</Tag>;
}

function statusTag(st) {
  return st === "ACTIVE" ? <Tag color="success">활성</Tag> : <Tag color="default">비활성</Tag>;
}

export default function AdminUserScreen() {
  const [form] = Form.useForm();
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const rows = useMemo(() => {
    return MOCK_USERS.filter((u) => {
      const hit =
        !q.trim() ||
        u.email.toLowerCase().includes(q.trim().toLowerCase()) ||
        u.name.toLowerCase().includes(q.trim().toLowerCase());
      const hitRole = !role || u.role === role;
      const hitStatus = !status || u.status === status;
      return hit && hitRole && hitStatus;
    });
  }, [q, role, status]);

  const columns = [
    { title: "이메일", dataIndex: "email", key: "email" },
    { title: "닉네임", dataIndex: "name", key: "name" },
    {
      title: "권한",
      dataIndex: "role",
      key: "role",
      render: (v) => roleTag(v),
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      render: (v) => statusTag(v),
    },
    { title: "모드", dataIndex: "mode", key: "mode" },
    { title: "가입일", dataIndex: "createdAt", key: "createdAt" },
  ];

  const openUser = (u) => {
    setSelected(u);
    setDrawerOpen(true);
    form.setFieldsValue({
      email: u.email,
      name: u.name,
      role: u.role,
      status: u.status,
      mode: u.mode,
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <Title level={3} style={{ margin: 0 }}>사용자/권한</Title>
          <Text type="secondary">목업 데이터 · 실제 구현: /api/admin/users, /api/admin/roles</Text>
        </div>
      </div>

      <Card>
        <Space orientation="vertical" size={12} style={{ width: "100%" }}>
          <Space wrap>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="이메일 또는 닉네임 검색"
              prefix={<Search size={16} />}
              style={{ width: 320 }}
              allowClear
            />

            <Select
              value={role}
              onChange={setRole}
              placeholder="권한"
              style={{ width: 160 }}
              options={[
                { value: "", label: "전체" },
                { value: "ADMIN", label: "관리자" },
                { value: "USER", label: "일반 사용자" },
              ]}
            />

            <Select
              value={status}
              onChange={setStatus}
              placeholder="상태"
              style={{ width: 160 }}
              options={[
                { value: "", label: "전체" },
                { value: "ACTIVE", label: "활성" },
                { value: "INACTIVE", label: "비활성" },
              ]}
            />

            <Button onClick={() => { setQ(""); setRole(""); setStatus(""); }}>
              초기화
            </Button>
          </Space>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={rows}
            pagination={{ pageSize: 8 }}
            onRow={(record) => ({
              onClick: () => openUser(record),
              style: { cursor: "pointer" },
            })}
          />
        </Space>
      </Card>

      <Drawer
        title="사용자 상세(데모)"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={460}
      >
        {selected ? (
          <>
            <Space orientation="vertical" size={10} style={{ width: "100%" }}>
              <Text type="secondary">ID: {selected.id}</Text>

              <Form layout="vertical" form={form}>
                <Form.Item label="이메일" name="email">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="닉네임" name="name">
                  <Input />
                </Form.Item>
                <Form.Item label="권한" name="role">
                  <Select
                    options={[
                      { value: "ADMIN", label: "ADMIN" },
                      { value: "USER", label: "USER" },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="상태" name="status">
                  <Select
                    options={[
                      { value: "ACTIVE", label: "ACTIVE" },
                      { value: "INACTIVE", label: "INACTIVE" },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="기본 모드" name="mode">
                  <Select
                    options={[
                      { value: "J", label: "J" },
                      { value: "P", label: "P" },
                      { value: "B", label: "B" },
                    ]}
                  />
                </Form.Item>

                <Space wrap>
                  <Button icon={<User size={16} />} onClick={() => alert("데모: 프로필 이동(추후)")}>
                    프로필
                  </Button>
                  <Button icon={<Shield size={16} />} type="primary" onClick={() => alert("데모: 권한 변경 저장(추후 API)")}>
                    권한 저장
                  </Button>
                  <Button icon={<Ban size={16} />} danger onClick={() => alert("데모: 비활성 처리(추후 API)")}>
                    비활성 처리
                  </Button>
                  <Button icon={<CheckCircle2 size={16} />} onClick={() => alert("데모: 활성 복구(추후 API)")}>
                    활성 복구
                  </Button>
                </Space>
              </Form>

              <Text type="secondary">
                실제 구현 시: 변경 저장은 PATCH /api/admin/users/{`{id}`}, 권한은 role 기반 정책으로 제한
              </Text>
            </Space>
          </>
        ) : null}
      </Drawer>
    </div>
  );
}
