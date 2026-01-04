// FILE: src/main/frontend/src/screens/admin/AdminNoticeScreen.jsx
import React, { useMemo, useState } from "react";
import { Button, Card, DatePicker, Form, Input, Select, Space, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { Plus, RefreshCw, Save, Megaphone } from "lucide-react";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const SEED = [
  {
    id: 1,
    title: "Timebar Diary 베타 오픈 안내",
    content: "베타 기간 동안 피드백 환영합니다.",
    channel: "웹 · 모바일",
    priority: 10,
    startAt: "2025-12-01",
    endAt: "2026-01-31",
    status: "노출중",
  },
  {
    id: 2,
    title: "점검 안내 – 01/10 02:00~04:00",
    content: "점검 시간 동안 서비스가 불안정할 수 있습니다.",
    channel: "웹",
    priority: 5,
    startAt: "2026-01-08",
    endAt: "2026-01-10",
    status: "예약",
  },
];

function statusTag(st) {
  if (st === "노출중") return <Tag color="success">노출중</Tag>;
  if (st === "예약") return <Tag color="processing">예약</Tag>;
  return <Tag>종료</Tag>;
}

export default function AdminNoticeScreen() {
  const [form] = Form.useForm();
  const [items, setItems] = useState(SEED);
  const [selectedId, setSelectedId] = useState(null);

  const selected = useMemo(() => items.find((x) => x.id === selectedId) ?? null, [items, selectedId]);

  const resetForm = () => {
    setSelectedId(null);
    form.resetFields();
  };

  const onSelectRow = (row) => {
    setSelectedId(row.id);
    form.setFieldsValue({
      title: row.title,
      content: row.content,
      channel: row.channel,
      priority: String(row.priority),
      status: row.status,
      period: [dayjs(row.startAt), dayjs(row.endAt)],
    });
  };

  const submit = (values) => {
    const [s, e] = values.period || [];
    const payload = {
      title: values.title,
      content: values.content,
      channel: values.channel,
      priority: Number(values.priority || 0),
      status: values.status,
      startAt: s ? s.format("YYYY-MM-DD") : "",
      endAt: e ? e.format("YYYY-MM-DD") : "",
    };

    if (selected) {
      setItems((prev) => prev.map((x) => (x.id === selected.id ? { ...x, ...payload } : x)));
      alert("데모: 수정 저장 완료(로컬 상태)");
      return;
    }

    const nextId = Math.max(...items.map((x) => x.id), 0) + 1;
    setItems((prev) => [{ id: nextId, ...payload }, ...prev]);
    alert("데모: 신규 등록 완료(로컬 상태)");
    resetForm();
  };

  const columns = [
    { title: "제목", dataIndex: "title", key: "title" },
    {
      title: "기간",
      key: "period",
      render: (_, r) => `${r.startAt} ~ ${r.endAt}`,
    },
    { title: "채널", dataIndex: "channel", key: "channel" },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      render: (v) => statusTag(v),
    },
    { title: "우선순위", dataIndex: "priority", key: "priority", width: 100 },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <Title level={3} style={{ margin: 0 }}>공지/배너</Title>
          <Text type="secondary">목업 데이터 · 실제 구현: /api/admin/notices, /api/admin/banners</Text>
        </div>
      </div>

      <div className="admin-two-col">
        <Card
          title={
            <Space size={8}>
              <Megaphone size={18} />
              <span>{selected ? "공지 수정" : "공지 등록"}</span>
            </Space>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={submit}
            initialValues={{
              status: "예약",
              priority: "10",
            }}
          >
            <Form.Item
              label="제목"
              name="title"
              rules={[{ required: true, message: "제목을 입력하세요." }]}
            >
              <Input placeholder="공지 제목" />
            </Form.Item>

            <Form.Item
              label="내용"
              name="content"
              rules={[{ required: true, message: "내용을 입력하세요." }]}
            >
              <Input.TextArea rows={5} placeholder="공지 내용을 입력" />
            </Form.Item>

            <Form.Item
              label="노출 기간"
              name="period"
              rules={[{ required: true, message: "기간을 선택하세요." }]}
            >
              <RangePicker />
            </Form.Item>

            <Space wrap style={{ width: "100%" }}>
              <Form.Item
                label="채널"
                name="channel"
                style={{ width: 220, marginBottom: 0 }}
                rules={[{ required: true, message: "채널을 입력/선택하세요." }]}
              >
                <Select
                  options={[
                    { value: "웹", label: "웹" },
                    { value: "모바일", label: "모바일" },
                    { value: "웹 · 모바일", label: "웹 · 모바일" },
                  ]}
                />
              </Form.Item>

              <Form.Item label="상태" name="status" style={{ width: 160, marginBottom: 0 }}>
                <Select
                  options={[
                    { value: "예약", label: "예약" },
                    { value: "노출중", label: "노출중" },
                    { value: "종료", label: "종료" },
                  ]}
                />
              </Form.Item>

              <Form.Item label="우선순위" name="priority" style={{ width: 160, marginBottom: 0 }}>
                <Select
                  options={[
                    { value: "1", label: "1" },
                    { value: "5", label: "5" },
                    { value: "10", label: "10" },
                    { value: "20", label: "20" },
                  ]}
                />
              </Form.Item>
            </Space>

            <Space wrap style={{ marginTop: 12 }}>
              <Button icon={<RefreshCw size={16} />} onClick={resetForm}>
                초기화
              </Button>
              <Button type="primary" htmlType="submit" icon={<Save size={16} />}>
                {selected ? "수정 저장" : "등록"}
              </Button>
              <Button icon={<Plus size={16} />} onClick={() => alert("데모: 이미지/배너 업로드(추후)")}>
                배너 업로드(추후)
              </Button>
            </Space>
          </Form>

          <Text type="secondary" style={{ display: "block", marginTop: 10 }}>
            실제 운영에서는 노출 채널/플랫폼, 사용자 세그먼트(관리자/일반), 우선순위 충돌 규칙이 필요
          </Text>
        </Card>

        <Card title="등록된 공지(목록)" className="admin-card-fullHeight">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={items}
            pagination={{ pageSize: 6 }}
            onRow={(record) => ({
              onClick: () => onSelectRow(record),
              style: { cursor: "pointer" },
            })}
          />
        </Card>
      </div>
    </div>
  );
}
