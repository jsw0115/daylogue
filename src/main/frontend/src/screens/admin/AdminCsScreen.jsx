import React, { useMemo, useState } from "react";
import { Button, Card, Input, Select, Space, Table, Tag, Typography } from "antd";
import { LifeBuoy, Fingerprint, Send, RefreshCw } from "lucide-react";

const { Title, Text } = Typography;

const SEED_TICKETS = [
  { id: "T-1001", status: "대기", type: "동기화", userId: "U-1001", title: "구글 캘린더 중복 생성", createdAt: "2026-01-01 11:02" },
  { id: "T-1002", status: "진행", type: "결제", userId: "U-1010", title: "구독 결제했는데 기능이 잠김", createdAt: "2026-01-01 09:40" },
  { id: "T-1003", status: "완료", type: "버그", userId: "U-1007", title: "플래너 저장 시 오류", createdAt: "2025-12-31 21:11" },
];

function statusTag(s) {
  if (s === "대기") return <Tag color="processing">대기</Tag>;
  if (s === "진행") return <Tag color="warning">진행</Tag>;
  return <Tag color="success">완료</Tag>;
}

export default function AdminCsScreen() {
  const [status, setStatus] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");

  const data = useMemo(() => {
    return SEED_TICKETS.filter((t) => {
      const hitStatus = status === "ALL" ? true : t.status === status;
      const hitType = type === "ALL" ? true : t.type === type;
      const hitKeyword = !keyword.trim()
        ? true
        : (t.title.toLowerCase().includes(keyword.trim().toLowerCase()) ||
          t.userId.toLowerCase().includes(keyword.trim().toLowerCase()));
      return hitStatus && hitType && hitKeyword;
    });
  }, [status, type, keyword]);

  const columns = [
    { title: "티켓", dataIndex: "id", key: "id", width: 110 },
    { title: "상태", dataIndex: "status", key: "status", width: 90, render: (v) => statusTag(v) },
    { title: "유형", dataIndex: "type", key: "type", width: 90 },
    { title: "userId", dataIndex: "userId", key: "userId", width: 110 },
    { title: "제목", dataIndex: "title", key: "title" },
    { title: "생성", dataIndex: "createdAt", key: "createdAt", width: 150 },
  ];

  const issueDiagCode = () => {
    const code = `DGN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    alert(`데모: 진단 코드 발급 = ${code}\n(실제: 서버 로그/세션과 매칭)`);
  };

  const sendReply = () => {
    if (!selected) return alert("데모: 티켓을 선택하세요.");
    alert("데모: 답변 전송(추후 API)");
    setReply("");
  };

  const reset = () => {
    setStatus("ALL");
    setType("ALL");
    setKeyword("");
  };

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <Title level={3} style={{ margin: 0 }}>CS</Title>
          <Text type="secondary">1:1 문의 티켓 + 진단 코드(데모)</Text>
        </div>
      </div>

      <div className="admin-two-col">
        <Card
          title={
            <Space size={8}>
              <LifeBuoy size={18} />
              <span>필터</span>
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
              <Text type="secondary">유형</Text>
              <Select
                value={type}
                onChange={setType}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "ALL" },
                  { value: "동기화", label: "동기화" },
                  { value: "결제", label: "결제" },
                  { value: "버그", label: "버그" },
                ]}
              />
            </div>

            <div>
              <Text type="secondary">키워드</Text>
              <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="제목/userId 검색" allowClear />
            </div>

            <Space wrap>
              <Button icon={<RefreshCw size={16} />} onClick={reset}>초기화</Button>
              <Button icon={<Fingerprint size={16} />} onClick={issueDiagCode}>진단 코드 발급</Button>
            </Space>

            <Text type="secondary">
              실제 운영: 티켓에 첨부 로그/스크린샷, 답변 템플릿, SLA 타이머가 필요.
            </Text>
          </Space>
        </Card>

        <Card title="티켓 목록">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 6 }}
            onRow={(record) => ({
              onClick: () => setSelected(record),
              style: { cursor: "pointer" },
            })}
          />
        </Card>
      </div>

      <Card title="답변(데모)" style={{ marginTop: 12 }}>
        {!selected ? (
          <Text type="secondary">왼쪽에서 티켓을 선택하세요.</Text>
        ) : (
          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <Text>
              선택: <Tag>{selected.id}</Tag> userId=<Tag>{selected.userId}</Tag> ({selected.type})
            </Text>

            <Input.TextArea
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="답변 내용을 입력"
            />

            <Button type="primary" icon={<Send size={16} />} onClick={sendReply}>
              답변 전송(데모)
            </Button>
          </Space>
        )}
      </Card>
    </div>
  );
}
