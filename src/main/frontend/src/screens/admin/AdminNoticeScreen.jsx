import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { Plus, RefreshCw, Save, Megaphone, Wand2 } from "lucide-react";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const SEED = [
  {
    id: 1,
    type: "공지",
    title: "Timebar Diary 베타 오픈 안내",
    content: "베타 기간 동안 피드백 환영합니다.",
    channel: "웹 · 모바일",
    os: "ALL",
    minAppVersion: "",
    maxAppVersion: "",
    segment: "ALL",
    priority: 10,
    startAt: "2025-12-01",
    endAt: "2026-01-31",
    status: "노출중",
  },
  {
    id: 2,
    type: "팝업",
    title: "점검 안내 – 01/10 02:00~04:00",
    content: "점검 시간 동안 서비스가 불안정할 수 있습니다.",
    channel: "웹",
    os: "ALL",
    minAppVersion: "",
    maxAppVersion: "",
    segment: "ALL",
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

function typeTag(tp) {
  if (tp === "공지") return <Tag color="blue">공지</Tag>;
  if (tp === "배너") return <Tag color="purple">배너</Tag>;
  return <Tag color="gold">팝업</Tag>;
}

const EMERGENCY_TEMPLATES = [
  {
    value: "incident",
    label: "장애 공지",
    title: "[긴급] 서비스 장애 안내",
    content:
      "현재 일부 기능에서 오류가 발생하고 있습니다.\n원인 파악 및 복구 중이며, 진행 상황을 업데이트하겠습니다.",
  },
  {
    value: "maintenance",
    label: "점검 공지",
    title: "시스템 점검 안내",
    content:
      "아래 시간 동안 시스템 점검이 진행됩니다.\n점검 시간에는 서비스가 불안정할 수 있습니다.",
  },
  {
    value: "policy",
    label: "정책 변경",
    title: "운영 정책 변경 안내",
    content:
      "서비스 운영 정책이 일부 변경됩니다.\n변경 내용 및 적용 일정을 확인해 주세요.",
  },
];

export default function AdminNoticeScreen() {
  const [form] = Form.useForm();
  const [items, setItems] = useState(SEED);
  const [selectedId, setSelectedId] = useState(null);

  const selected = useMemo(
    () => items.find((x) => x.id === selectedId) ?? null,
    [items, selectedId]
  );

  const resetForm = () => {
    setSelectedId(null);
    form.resetFields();
  };

  const onSelectRow = (row) => {
    setSelectedId(row.id);
    form.setFieldsValue({
      type: row.type,
      title: row.title,
      content: row.content,
      channel: row.channel,
      os: row.os,
      minAppVersion: row.minAppVersion,
      maxAppVersion: row.maxAppVersion,
      segment: row.segment,
      priority: String(row.priority),
      status: row.status,
      period: [dayjs(row.startAt), dayjs(row.endAt)],
    });
  };

  const applyTemplate = (tplKey) => {
    const tpl = EMERGENCY_TEMPLATES.find((t) => t.value === tplKey);
    if (!tpl) return;
    form.setFieldsValue({
      title: tpl.title,
      content: tpl.content,
      type: "공지",
      status: "예약",
      priority: "20",
      channel: "웹 · 모바일",
      os: "ALL",
      segment: "ALL",
    });
  };

  const submit = (values) => {
    const [s, e] = values.period || [];
    const payload = {
      type: values.type,
      title: values.title,
      content: values.content,
      channel: values.channel,
      os: values.os,
      minAppVersion: values.minAppVersion || "",
      maxAppVersion: values.maxAppVersion || "",
      segment: values.segment || "ALL",
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
    {
      title: "타입",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (v) => typeTag(v),
    },
    { title: "제목", dataIndex: "title", key: "title" },
    { title: "기간", key: "period", width: 220, render: (_, r) => `${r.startAt} ~ ${r.endAt}` },
    { title: "채널", dataIndex: "channel", key: "channel", width: 120 },
    { title: "세그먼트", dataIndex: "segment", key: "segment", width: 120 },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      width: 100,
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
          <Space wrap style={{ marginBottom: 10 }}>
            <Select
              placeholder="긴급 템플릿 적용"
              style={{ width: 220 }}
              onChange={applyTemplate}
              options={EMERGENCY_TEMPLATES.map((t) => ({ value: t.value, label: t.label }))}
            />
            <Button icon={<Wand2 size={16} />} onClick={() => alert("데모: 템플릿 기반 자동 문구 생성(추후)")}>
              문구 자동 생성(추후)
            </Button>
          </Space>

          <Form
            form={form}
            layout="vertical"
            onFinish={submit}
            initialValues={{
              type: "공지",
              status: "예약",
              priority: "10",
              channel: "웹 · 모바일",
              os: "ALL",
              segment: "ALL",
            }}
          >
            <Space wrap style={{ width: "100%" }}>
              <Form.Item
                label="타입"
                name="type"
                style={{ width: 160, marginBottom: 0 }}
                rules={[{ required: true, message: "타입을 선택하세요." }]}
              >
                <Select
                  options={[
                    { value: "공지", label: "공지" },
                    { value: "배너", label: "배너" },
                    { value: "팝업", label: "팝업" },
                  ]}
                />
              </Form.Item>

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

              <Form.Item label="OS" name="os" style={{ width: 140, marginBottom: 0 }}>
                <Select
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "iOS", label: "iOS" },
                    { value: "Android", label: "Android" },
                  ]}
                />
              </Form.Item>

              <Form.Item label="세그먼트" name="segment" style={{ width: 180, marginBottom: 0 }}>
                <Select
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "NEW_USERS", label: "NEW_USERS" },
                    { value: "SYNC_ENABLED", label: "SYNC_ENABLED" },
                    { value: "PVA_ACTIVE", label: "PVA_ACTIVE" },
                    { value: "SUBSCRIBERS", label: "SUBSCRIBERS" },
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

            <Form.Item
              label="제목"
              name="title"
              rules={[{ required: true, message: "제목을 입력하세요." }]}
              style={{ marginTop: 10 }}
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

            <Space wrap style={{ width: "100%" }}>
              <Form.Item
                label="노출 기간"
                name="period"
                rules={[{ required: true, message: "기간을 선택하세요." }]}
                style={{ marginBottom: 0 }}
              >
                <RangePicker />
              </Form.Item>

              <Form.Item label="minAppVersion" name="minAppVersion" style={{ marginBottom: 0 }}>
                <Input placeholder="예) 1.2.0" style={{ width: 160 }} />
              </Form.Item>

              <Form.Item label="maxAppVersion" name="maxAppVersion" style={{ marginBottom: 0 }}>
                <Input placeholder="예) 2.0.0" style={{ width: 160 }} />
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
            실제 운영: 타겟(플랫폼/OS/버전/세그먼트), 우선순위 충돌 규칙, 긴급 공지 템플릿이 필요
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
