import React, { useMemo, useState } from "react";
import { Button, Card, Input, Select, Space, Table, Tag, Typography } from "antd";
import { MessageSquareWarning, Ban, EyeOff, RefreshCw, Plus } from "lucide-react";

const { Title, Text } = Typography;

const REPORTS = [
  { id: "R-9001", type: "게시글", targetId: "P-8812", reason: "욕설", count: 5, status: "대기", createdAt: "2026-01-01 13:50" },
  { id: "R-9002", type: "채팅", targetId: "C-12009", reason: "도배", count: 3, status: "진행", createdAt: "2026-01-01 12:10" },
];

function stTag(s) {
  if (s === "대기") return <Tag color="processing">대기</Tag>;
  if (s === "진행") return <Tag color="warning">진행</Tag>;
  return <Tag color="success">완료</Tag>;
}

export default function AdminCommunityScreen() {
  const [status, setStatus] = useState("ALL");
  const [q, setQ] = useState("");

  const data = useMemo(() => {
    return REPORTS.filter((r) => {
      const hitStatus = status === "ALL" ? true : r.status === status;
      const hitQ = !q.trim()
        ? true
        : (r.targetId.toLowerCase().includes(q.trim().toLowerCase()) || r.reason.toLowerCase().includes(q.trim().toLowerCase()));
      return hitStatus && hitQ;
    });
  }, [status, q]);

  const columns = [
    { title: "신고ID", dataIndex: "id", key: "id", width: 110 },
    { title: "유형", dataIndex: "type", key: "type", width: 90 },
    { title: "대상", dataIndex: "targetId", key: "targetId", width: 120 },
    { title: "사유", dataIndex: "reason", key: "reason", width: 120 },
    { title: "누적", dataIndex: "count", key: "count", width: 80 },
    { title: "상태", dataIndex: "status", key: "status", width: 90, render: (v) => stTag(v) },
    { title: "생성", dataIndex: "createdAt", key: "createdAt", width: 160 },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <Title level={3} style={{ margin: 0 }}>커뮤니티 운영</Title>
          <Text type="secondary">신고 큐/제재/금칙어/도배 레이트리밋(데모)</Text>
        </div>
      </div>

      <div className="admin-two-col">
        <Card
          title={
            <Space size={8}>
              <MessageSquareWarning size={18} />
              <span>신고 큐</span>
            </Space>
          }
        >
          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <div>
              <Text type="secondary">상태</Text>
              <Select
                value={status}
                onChange={setStatus}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "ALL" },
                  { value: "대기", label: "대기" },
                  { value: "진행", label: "진행" },
                  { value: "완료", label: "완료" },
                ]}
              />
            </div>

            <div>
              <Text type="secondary">검색</Text>
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="targetId/사유" allowClear />
            </div>

            <Space wrap>
              <Button icon={<EyeOff size={16} />} onClick={() => alert("데모: 콘텐츠 숨김(추후 API)")}>숨김</Button>
              <Button icon={<Ban size={16} />} onClick={() => alert("데모: 사용자 제재(추후 API)")}>사용자 제재</Button>
              <Button icon={<RefreshCw size={16} />} onClick={() => alert("데모: 새로고침")}>새로고침</Button>
            </Space>

            <Text type="secondary">
              실제 구현: 증거(스크린샷/로그), 조치 이력(Audit), 단계 제재(뮤트/정지/제한) 필요.
            </Text>
          </Space>
        </Card>

        <Card title="신고 목록">
          <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 6 }} />
        </Card>
      </div>

      <Card title="금칙어/스팸 정책(데모)" style={{ marginTop: 12 }}>
        <Space wrap>
          <Button icon={<Plus size={16} />} onClick={() => alert("데모: 금칙어 추가(추후 API)")}>
            금칙어 추가
          </Button>
          <Button onClick={() => alert("데모: 도배 레이트리밋 파라미터 설정(추후 API)")}>
            레이트리밋 설정
          </Button>
        </Space>

        <Text type="secondary" style={{ display: "block", marginTop: 10 }}>
          실제 운영: 금칙어 버전 관리, 예외 처리, 신고/제재 지표 연동이 필요.
        </Text>
      </Card>
    </div>
  );
}
