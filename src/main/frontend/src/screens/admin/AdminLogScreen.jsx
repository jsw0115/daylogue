// FILE: src/main/frontend/src/screens/admin/AdminLogScreen.jsx
import React, { useMemo, useState } from "react";
import { Card, DatePicker, Input, Select, Space, Table, Tag, Typography, Button } from "antd";
import dayjs from "dayjs";
import { Search, RefreshCw, Bug, ShieldAlert } from "lucide-react";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const MOCK_LOGS = [
  { id: 1, time: "2026-01-01 13:10:23", level: "ERROR", source: "PlannerApi", message: "일간 플래너 조회 중 예외 발생", traceId: "TRC-AAA" },
  { id: 2, time: "2026-01-01 13:02:01", level: "WARN", source: "AuthApi", message: "만료 임박 토큰 자동 재발급", traceId: "TRC-BBB" },
  { id: 3, time: "2026-01-01 12:58:44", level: "INFO", source: "FocusService", message: "포커스 세션 종료 · 25분", traceId: "TRC-CCC" },
  { id: 4, time: "2026-01-01 12:31:18", level: "ERROR", source: "AdminApi", message: "권한 정책 로딩 실패(데모)", traceId: "TRC-DDD" },
];

function levelTag(level) {
  if (level === "ERROR") return <Tag color="error">ERROR</Tag>;
  if (level === "WARN") return <Tag color="warning">WARN</Tag>;
  return <Tag>INFO</Tag>;
}

export default function AdminLogScreen() {
  const [range, setRange] = useState([dayjs().add(-7, "day"), dayjs()]);
  const [level, setLevel] = useState("");
  const [source, setSource] = useState("");
  const [keyword, setKeyword] = useState("");

  const data = useMemo(() => {
    const [s, e] = range || [];
    return MOCK_LOGS.filter((l) => {
      const t = dayjs(l.time, "YYYY-MM-DD HH:mm:ss");
      const hitRange = !s || !e ? true : (t.isAfter(s.startOf("day")) && t.isBefore(e.endOf("day")));
      const hitLevel = !level || l.level === level;
      const hitSource = !source.trim() || l.source.toLowerCase().includes(source.trim().toLowerCase());
      const hitKeyword = !keyword.trim() || l.message.toLowerCase().includes(keyword.trim().toLowerCase());
      return hitRange && hitLevel && hitSource && hitKeyword;
    });
  }, [range, level, source, keyword]);

  const columns = [
    { title: "시간", dataIndex: "time", key: "time", width: 180 },
    { title: "레벨", dataIndex: "level", key: "level", width: 100, render: (v) => levelTag(v) },
    { title: "서비스", dataIndex: "source", key: "source", width: 140 },
    { title: "메시지", dataIndex: "message", key: "message" },
    { title: "traceId", dataIndex: "traceId", key: "traceId", width: 120 },
  ];

  const reset = () => {
    setRange([dayjs().add(-7, "day"), dayjs()]);
    setLevel("");
    setSource("");
    setKeyword("");
  };

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <Title level={3} style={{ margin: 0 }}>로그/감사</Title>
          <Text type="secondary">목업 데이터 · 실제 구현: /api/admin/logs (기간/레벨/traceId/사용자 필터)</Text>
        </div>
      </div>

      <div className="admin-two-col">
        <Card
          title={
            <Space size={8}>
              <ShieldAlert size={18} />
              <span>검색 조건</span>
            </Space>
          }
        >
          <Space orientation="vertical" size={10} style={{ width: "100%" }}>
            <div>
              <Text type="secondary">기간</Text>
              <RangePicker value={range} onChange={(v) => setRange(v)} style={{ width: "100%" }} />
            </div>

            <div>
              <Text type="secondary">레벨</Text>
              <Select
                value={level}
                onChange={setLevel}
                style={{ width: "100%" }}
                options={[
                  { value: "", label: "전체" },
                  { value: "ERROR", label: "ERROR" },
                  { value: "WARN", label: "WARN" },
                  { value: "INFO", label: "INFO" },
                ]}
              />
            </div>

            <div>
              <Text type="secondary">서비스/소스</Text>
              <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="예) PlannerApi" />
            </div>

            <div>
              <Text type="secondary">메시지 키워드</Text>
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="키워드 검색"
                prefix={<Search size={16} />}
                allowClear
              />
            </div>

            <Space wrap>
              <Button onClick={reset} icon={<RefreshCw size={16} />}>초기화</Button>
              <Button type="primary" icon={<Bug size={16} />} onClick={() => alert("데모: 검색은 이미 실시간 필터링으로 반영됨")}>
                검색
              </Button>
            </Space>
          </Space>
        </Card>

        <Card title="로그 목록">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 8 }}
          />
        </Card>
      </div>
    </div>
  );
}
