// FILE: src/main/frontend/src/screens/admin/AdminLogScreen.jsx
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

// Mock Data
const MOCK_APP_LOGS = [
  { id: 1, time: "2026-01-01 13:10:23", level: "ERROR", source: "PlannerApi", message: "일간 플래너 조회 중 예외 발생", traceId: "TRC-AAA", userId: "U-1001", ip: "10.0.0.21" },
  { id: 2, time: "2026-01-01 13:02:01", level: "WARN", source: "AuthApi", message: "만료 임박 토큰 자동 재발급", traceId: "TRC-BBB", userId: "U-1002", ip: "10.0.0.55" },
  { id: 3, time: "2026-01-01 12:58:44", level: "INFO", source: "FocusService", message: "포커스 세션 종료 · 25분", traceId: "TRC-CCC", userId: "U-1001", ip: "10.0.0.21" },
  { id: 4, time: "2026-01-01 12:31:18", level: "ERROR", source: "AdminApi", message: "권한 정책 로딩 실패(데모)", traceId: "TRC-DDD", userId: "ADM-0001", ip: "10.0.0.9" },
];

const MOCK_AUDIT_LOGS = [
  { id: 101, time: "2026-01-01 14:20:11", actorRole: "ops", actorId: "ADM-0002", action: "USER_SUSPEND", entityType: "User", entityId: "U-1007", summary: "사용자 정지 7일", traceId: "AUD-111", ip: "10.0.0.10" },
  { id: 102, time: "2026-01-01 14:10:02", actorRole: "superAdmin", actorId: "ADM-0001", action: "POLICY_UPDATE", entityType: "Policy", entityId: "PVA_TIME_CAPPING", summary: "시간 달성률 캡핑 정책: 100%로 변경", traceId: "AUD-222", ip: "10.0.0.9" },
];

function levelTag(level) {
  if (level === "ERROR") return <Tag color="error">ERROR</Tag>;
  if (level === "WARN") return <Tag color="warning">WARN</Tag>;
  return <Tag color="default">INFO</Tag>;
}

export default function AdminLogScreen() {
  const [range, setRange] = useState([dayjs().subtract(7, "day"), dayjs()]);
  const [kind, setKind] = useState("app"); // app | audit

  // App Filters
  const [level, setLevel] = useState("");
  const [keyword, setKeyword] = useState("");
  const [traceId, setTraceId] = useState("");

  // Audit Filters
  const [actorId, setActorId] = useState("");
  const [action, setAction] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const data = useMemo(() => {
    // 날짜 필터 로직 (간소화)
    const [s, e] = range || [];
    const isWithin = (tStr) => {
      if (!s || !e) return true;
      const t = dayjs(tStr);
      return t.isAfter(s.startOf('day')) && t.isBefore(e.endOf('day'));
    };

    if (kind === "audit") {
      return MOCK_AUDIT_LOGS.filter(l => {
        if (!isWithin(l.time)) return false;
        if (actorId && !l.actorId.includes(actorId)) return false;
        if (action && !l.action.includes(action)) return false;
        if (traceId && !l.traceId.includes(traceId)) return false;
        return true;
      });
    }

    return MOCK_APP_LOGS.filter(l => {
      if (!isWithin(l.time)) return false;
      if (level && l.level !== level) return false;
      if (keyword && !l.message.includes(keyword) && !l.source.includes(keyword)) return false;
      if (traceId && !l.traceId.includes(traceId)) return false;
      return true;
    });
  }, [kind, range, level, keyword, traceId, actorId, action]);

  const columns = useMemo(() => {
    if (kind === "audit") {
      return [
        { title: "시간", dataIndex: "time", width: 160 },
        { title: "Role", dataIndex: "actorRole", render: v => <Tag>{v}</Tag>, width: 90 },
        { title: "Actor", dataIndex: "actorId", width: 100 },
        { title: "Action", dataIndex: "action", width: 140 },
        { title: "요약", dataIndex: "summary" },
        { title: "TraceID", dataIndex: "traceId", width: 100 },
      ];
    }
    return [
      { title: "시간", dataIndex: "time", width: 160 },
      { title: "레벨", dataIndex: "level", render: v => levelTag(v), width: 80 },
      { title: "소스", dataIndex: "source", width: 120 },
      { title: "메시지", dataIndex: "message" },
      { title: "UserID", dataIndex: "userId", width: 100 },
    ];
  }, [kind]);

  const openDetail = (row) => {
    setSelectedRow(row);
    setDetailOpen(true);
  };

  const reset = () => {
    setLevel(""); setKeyword(""); setTraceId(""); setActorId(""); setAction("");
  };

  return (
    <div className="admin-two-col">
      {/* 1. Filter Card */}
      <Card title={<Space><ShieldAlert size={18}/><span>로그 검색</span></Space>}>
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          <div>
            <Text type="secondary">로그 유형</Text>
            <Select 
              value={kind} onChange={setKind} style={{ width: '100%' }}
              options={[{value:'app', label:'시스템 로그 (App)'}, {value:'audit', label:'감사 로그 (Audit)'}]}
            />
          </div>
          <div>
            <Text type="secondary">기간</Text>
            <RangePicker value={range} onChange={setRange} style={{ width: '100%' }} />
          </div>

          {kind === 'app' ? (
            <>
              <div>
                <Text type="secondary">레벨</Text>
                <Select value={level} onChange={setLevel} style={{ width: '100%' }} options={[{value:'', label:'전체'}, {value:'ERROR', label:'ERROR'}, {value:'WARN', label:'WARN'}]} />
              </div>
              <div>
                <Text type="secondary">키워드 (메시지/소스)</Text>
                <Input value={keyword} onChange={e => setKeyword(e.target.value)} prefix={<Search size={14}/>} />
              </div>
            </>
          ) : (
            <>
              <div>
                <Text type="secondary">Actor ID (관리자)</Text>
                <Input value={actorId} onChange={e => setActorId(e.target.value)} />
              </div>
              <div>
                <Text type="secondary">Action</Text>
                <Input value={action} onChange={e => setAction(e.target.value)} />
              </div>
            </>
          )}

          <div>
            <Text type="secondary">Trace ID</Text>
            <Input value={traceId} onChange={e => setTraceId(e.target.value)} prefix={<Fingerprint size={14}/>} />
          </div>

          <Space style={{marginTop: 8}}>
            <Button icon={<RefreshCw size={14}/>} onClick={reset}>초기화</Button>
            <Button type="primary" icon={<Search size={14}/>}>검색</Button>
          </Space>
        </Space>
      </Card>

      {/* 2. List Card */}
      <Card 
        title="로그 목록" 
        extra={<Button icon={<FileDown size={14}/>} size="small">CSV</Button>}
        className="admin-card-fullHeight"
      >
        <Table 
          dataSource={data} 
          columns={columns} 
          rowKey="id" 
          size="small"
          onRow={(record) => ({
            onClick: () => openDetail(record),
            style: { cursor: 'pointer' }
          })}
        />
      </Card>

      <Drawer title="로그 상세 정보" width={500} onClose={() => setDetailOpen(false)} open={detailOpen}>
        {selectedRow && (
          <Space direction="vertical" style={{width:'100%'}}>
            {Object.entries(selectedRow).map(([k, v]) => (
              <div key={k} style={{display:'flex', borderBottom:'1px solid #f0f0f0', padding:'8px 0'}}>
                <span style={{width: 100, fontWeight: 600, color: '#666'}}>{k}</span>
                <span style={{flex:1, wordBreak:'break-all'}}>{v}</span>
              </div>
            ))}
            <Button type="primary" block style={{marginTop: 20}}>이슈 트래커 등록</Button>
          </Space>
        )}
      </Drawer>
    </div>
  );
}