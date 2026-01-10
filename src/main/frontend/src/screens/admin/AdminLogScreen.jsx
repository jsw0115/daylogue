import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Drawer,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import {
  Search,
  RefreshCw,
  Bug,
  ShieldAlert,
  FileDown,
  Fingerprint,
} from "lucide-react";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const MOCK_APP_LOGS = [
  {
    id: 1,
    time: "2026-01-01 13:10:23",
    level: "ERROR",
    source: "PlannerApi",
    message: "일간 플래너 조회 중 예외 발생",
    traceId: "TRC-AAA",
    userId: "U-1001",
    ip: "10.0.0.21",
  },
  {
    id: 2,
    time: "2026-01-01 13:02:01",
    level: "WARN",
    source: "AuthApi",
    message: "만료 임박 토큰 자동 재발급",
    traceId: "TRC-BBB",
    userId: "U-1002",
    ip: "10.0.0.55",
  },
  {
    id: 3,
    time: "2026-01-01 12:58:44",
    level: "INFO",
    source: "FocusService",
    message: "포커스 세션 종료 · 25분",
    traceId: "TRC-CCC",
    userId: "U-1001",
    ip: "10.0.0.21",
  },
  {
    id: 4,
    time: "2026-01-01 12:31:18",
    level: "ERROR",
    source: "AdminApi",
    message: "권한 정책 로딩 실패(데모)",
    traceId: "TRC-DDD",
    userId: "ADM-0001",
    ip: "10.0.0.9",
  },
];

const MOCK_AUDIT_LOGS = [
  {
    id: 101,
    time: "2026-01-01 14:20:11",
    actorRole: "ops",
    actorId: "ADM-0002",
    action: "USER_SUSPEND",
    entityType: "User",
    entityId: "U-1007",
    summary: "사용자 정지 7일",
    traceId: "AUD-111",
    ip: "10.0.0.10",
  },
  {
    id: 102,
    time: "2026-01-01 14:10:02",
    actorRole: "superAdmin",
    actorId: "ADM-0001",
    action: "POLICY_UPDATE",
    entityType: "Policy",
    entityId: "PVA_TIME_CAPPING",
    summary: "시간 달성률 캡핑 정책: 100%로 변경",
    traceId: "AUD-222",
    ip: "10.0.0.9",
  },
  {
    id: 103,
    time: "2026-01-01 13:55:40",
    actorRole: "moderator",
    actorId: "ADM-0003",
    action: "REPORT_HIDE_POST",
    entityType: "Post",
    entityId: "P-8812",
    summary: "신고 누적 5건으로 게시물 숨김 처리",
    traceId: "AUD-333",
    ip: "10.0.0.12",
  },
];

function levelTag(level) {
  if (level === "ERROR") return <Tag color="error">ERROR</Tag>;
  if (level === "WARN") return <Tag color="warning">WARN</Tag>;
  return <Tag>INFO</Tag>;
}

export default function AdminLogScreen() {
  const [range, setRange] = useState([dayjs().add(-7, "day"), dayjs()]);
  const [kind, setKind] = useState("app"); // app | audit

  // app log filters
  const [level, setLevel] = useState("");
  const [source, setSource] = useState("");
  const [keyword, setKeyword] = useState("");
  const [traceId, setTraceId] = useState("");
  const [userId, setUserId] = useState("");
  const [ip, setIp] = useState("");

  // audit log filters
  const [actorId, setActorId] = useState("");
  const [actorRole, setActorRole] = useState("");
  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const [entityId, setEntityId] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const data = useMemo(() => {
    const [s, e] = range || [];
    const within = (timeStr) => {
      const t = dayjs(timeStr, "YYYY-MM-DD HH:mm:ss");
      if (!s || !e) return true;
      return t.isAfter(s.startOf("day")) && t.isBefore(e.endOf("day"));
    };

    if (kind === "audit") {
      return MOCK_AUDIT_LOGS.filter((l) => {
        const hitRange = within(l.time);
        const hitActorId = !actorId.trim() || String(l.actorId).toLowerCase().includes(actorId.trim().toLowerCase());
        const hitActorRole = !actorRole.trim() || String(l.actorRole).toLowerCase().includes(actorRole.trim().toLowerCase());
        const hitAction = !action.trim() || String(l.action).toLowerCase().includes(action.trim().toLowerCase());
        const hitEntityType = !entityType.trim() || String(l.entityType).toLowerCase().includes(entityType.trim().toLowerCase());
        const hitEntityId = !entityId.trim() || String(l.entityId).toLowerCase().includes(entityId.trim().toLowerCase());
        const hitTrace = !traceId.trim() || String(l.traceId).toLowerCase().includes(traceId.trim().toLowerCase());
        const hitIp = !ip.trim() || String(l.ip).toLowerCase().includes(ip.trim().toLowerCase());
        return hitRange && hitActorId && hitActorRole && hitAction && hitEntityType && hitEntityId && hitTrace && hitIp;
      });
    }

    return MOCK_APP_LOGS.filter((l) => {
      const hitRange = within(l.time);
      const hitLevel = !level || l.level === level;
      const hitSource = !source.trim() || l.source.toLowerCase().includes(source.trim().toLowerCase());
      const hitKeyword = !keyword.trim() || l.message.toLowerCase().includes(keyword.trim().toLowerCase());
      const hitTrace = !traceId.trim() || String(l.traceId).toLowerCase().includes(traceId.trim().toLowerCase());
      const hitUser = !userId.trim() || String(l.userId).toLowerCase().includes(userId.trim().toLowerCase());
      const hitIp = !ip.trim() || String(l.ip).toLowerCase().includes(ip.trim().toLowerCase());
      return hitRange && hitLevel && hitSource && hitKeyword && hitTrace && hitUser && hitIp;
    });
  }, [
    range,
    kind,
    level,
    source,
    keyword,
    traceId,
    userId,
    ip,
    actorId,
    actorRole,
    action,
    entityType,
    entityId,
  ]);

  const columns = useMemo(() => {
    if (kind === "audit") {
      return [
        { title: "시간", dataIndex: "time", key: "time", width: 180 },
        { title: "actorRole", dataIndex: "actorRole", key: "actorRole", width: 120, render: (v) => <Tag>{v}</Tag> },
        { title: "actorId", dataIndex: "actorId", key: "actorId", width: 140 },
        { title: "action", dataIndex: "action", key: "action", width: 160 },
        { title: "entity", key: "entity", width: 220, render: (_, r) => `${r.entityType}:${r.entityId}` },
        { title: "요약", dataIndex: "summary", key: "summary" },
        { title: "traceId", dataIndex: "traceId", key: "traceId", width: 120 },
      ];
    }

    return [
      { title: "시간", dataIndex: "time", key: "time", width: 180 },
      { title: "레벨", dataIndex: "level", key: "level", width: 100, render: (v) => levelTag(v) },
      { title: "서비스", dataIndex: "source", key: "source", width: 140 },
      { title: "메시지", dataIndex: "message", key: "message" },
      { title: "userId", dataIndex: "userId", key: "userId", width: 120 },
      { title: "traceId", dataIndex: "traceId", key: "traceId", width: 120 },
    ];
  }, [kind]);

  const reset = () => {
    setRange([dayjs().add(-7, "day"), dayjs()]);
    setKind("app");

    setLevel("");
    setSource("");
    setKeyword("");
    setTraceId("");
    setUserId("");
    setIp("");

    setActorId("");
    setActorRole("");
    setAction("");
    setEntityType("");
    setEntityId("");
  };

  const openDetail = (row) => {
    setSelectedRow(row);
    setDetailOpen(true);
  };

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <Title level={3} style={{ margin: 0 }}>로그/감사</Title>
          <Text type="secondary">
            목업 데이터 · 실제 구현: /api/admin/logs, /api/admin/audit (기간/레벨/traceId/사용자/actor/action 필터)
          </Text>
        </div>

        <Space wrap>
          <Button icon={<FileDown size={16} />} onClick={() => alert("데모: CSV 다운로드(추후 API)")}>
            CSV
          </Button>
        </Space>
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
          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <div>
              <Text type="secondary">로그 종류</Text>
              <Select
                value={kind}
                onChange={setKind}
                style={{ width: "100%" }}
                options={[
                  { value: "app", label: "오류/성능 로그" },
                  { value: "audit", label: "감사 로그(Audit)" },
                ]}
              />
            </div>

            <div>
              <Text type="secondary">기간</Text>
              <RangePicker value={range} onChange={(v) => setRange(v)} style={{ width: "100%" }} />
            </div>

            {kind === "app" ? (
              <>
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

                <div>
                  <Text type="secondary">userId</Text>
                  <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="예) U-1001" allowClear />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Text type="secondary">actorId</Text>
                  <Input value={actorId} onChange={(e) => setActorId(e.target.value)} placeholder="예) ADM-0001" allowClear />
                </div>

                <div>
                  <Text type="secondary">actorRole</Text>
                  <Input value={actorRole} onChange={(e) => setActorRole(e.target.value)} placeholder="예) ops" allowClear />
                </div>

                <div>
                  <Text type="secondary">action</Text>
                  <Input value={action} onChange={(e) => setAction(e.target.value)} placeholder="예) POLICY_UPDATE" allowClear />
                </div>

                <div>
                  <Text type="secondary">entityType</Text>
                  <Input value={entityType} onChange={(e) => setEntityType(e.target.value)} placeholder="예) User / Post / Policy" allowClear />
                </div>

                <div>
                  <Text type="secondary">entityId</Text>
                  <Input value={entityId} onChange={(e) => setEntityId(e.target.value)} placeholder="예) U-1007" allowClear />
                </div>
              </>
            )}

            <div>
              <Text type="secondary">traceId</Text>
              <Input
                value={traceId}
                onChange={(e) => setTraceId(e.target.value)}
                placeholder="예) TRC-AAA / AUD-222"
                prefix={<Fingerprint size={16} />}
                allowClear
              />
            </div>

            <div>
              <Text type="secondary">IP</Text>
              <Input value={ip} onChange={(e) => setIp(e.target.value)} placeholder="예) 10.0.0.9" allowClear />
            </div>

            <Space wrap>
              <Button onClick={reset} icon={<RefreshCw size={16} />}>초기화</Button>
              <Button
                type="primary"
                icon={<Bug size={16} />}
                onClick={() => alert("데모: 검색은 실시간 필터로 반영됨")}
              >
                검색
              </Button>
            </Space>
          </Space>
        </Card>

        <Card title={kind === "audit" ? "감사 로그 목록" : "로그 목록"}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 8 }}
            onRow={(record) => ({
              onClick: () => openDetail(record),
              style: { cursor: "pointer" },
            })}
          />
        </Card>
      </div>

      <Drawer
        title="상세"
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        width={520}
      >
        {!selectedRow ? null : (
          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            {Object.entries(selectedRow).map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 120, color: "rgba(0,0,0,0.45)" }}>{k}</div>
                <div style={{ flex: 1, wordBreak: "break-word" }}>{String(v)}</div>
              </div>
            ))}
          </Space>
        )}
      </Drawer>
    </div>
  );
}
