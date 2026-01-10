import React, { useMemo, useState } from "react";
import { Button, Card, Input, Select, Space, Table, Tag, Typography } from "antd";
import { CreditCard, RefreshCw, Search } from "lucide-react";

const { Title, Text } = Typography;

const SEED = [
  { id: "S-2001", userId: "U-1010", plan: "PRO", status: "ACTIVE", since: "2025-12-20", lastPayment: "2026-01-05", channel: "Store" },
  { id: "S-2002", userId: "U-1007", plan: "BASIC", status: "CANCELED", since: "2025-11-01", lastPayment: "2025-12-01", channel: "PG" },
];

function statusTag(s) {
  if (s === "ACTIVE") return <Tag color="success">ACTIVE</Tag>;
  if (s === "PAST_DUE") return <Tag color="warning">PAST_DUE</Tag>;
  return <Tag>CANCELED</Tag>;
}

export default function AdminBillingScreen() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");

  const data = useMemo(() => {
    return SEED.filter((r) => {
      const hitQ = !q.trim() ? true : (r.userId.toLowerCase().includes(q.trim().toLowerCase()) || r.id.toLowerCase().includes(q.trim().toLowerCase()));
      const hitStatus = status === "ALL" ? true : r.status === status;
      return hitQ && hitStatus;
    });
  }, [q, status]);

  const columns = [
    { title: "구독ID", dataIndex: "id", key: "id", width: 120 },
    { title: "userId", dataIndex: "userId", key: "userId", width: 110 },
    { title: "플랜", dataIndex: "plan", key: "plan", width: 90 },
    { title: "상태", dataIndex: "status", key: "status", width: 110, render: (v) => statusTag(v) },
    { title: "시작", dataIndex: "since", key: "since", width: 120 },
    { title: "최근 결제", dataIndex: "lastPayment", key: "lastPayment", width: 120 },
    { title: "채널", dataIndex: "channel", key: "channel", width: 90 },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <Title level={3} style={{ margin: 0 }}>결제/구독</Title>
          <Text type="secondary">현 단계: 조회/상태 동기화/CS 연계 중심(데모)</Text>
        </div>
      </div>

      <div className="admin-two-col">
        <Card
          title={
            <Space size={8}>
              <CreditCard size={18} />
              <span>검색</span>
            </Space>
          }
        >
          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <div>
              <Text type="secondary">userId / subscriptionId</Text>
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="예) U-1010"
                prefix={<Search size={16} />}
                allowClear
              />
            </div>

            <div>
              <Text type="secondary">상태</Text>
              <Select
                value={status}
                onChange={setStatus}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "ALL" },
                  { value: "ACTIVE", label: "ACTIVE" },
                  { value: "PAST_DUE", label: "PAST_DUE" },
                  { value: "CANCELED", label: "CANCELED" },
                ]}
              />
            </div>

            <Space wrap>
              <Button icon={<RefreshCw size={16} />} onClick={() => alert("데모: 결제 상태 동기화(추후 API)")}>
                상태 동기화
              </Button>
              <Button type="primary" onClick={() => alert("데모: 환불/해지 처리(연동 확정 후)")}>
                환불/해지(옵션)
              </Button>
            </Space>

            <Text type="secondary">
              결제 연동 방식(Store/PG/자체)에 따라 관리 기능이 크게 달라질 수 있음.
            </Text>
          </Space>
        </Card>

        <Card title="구독 목록">
          <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 6 }} />
        </Card>
      </div>
    </div>
  );
}
