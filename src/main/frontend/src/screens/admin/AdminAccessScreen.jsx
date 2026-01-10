import React, { useMemo, useState } from "react";
import { Button, Card, Input, Select, Space, Switch, Table, Tag, Typography } from "antd";
import { Shield, Timer, KeyRound, Network, Save } from "lucide-react";

const { Title, Text } = Typography;

const ROLE_MATRIX = [
  { role: "superAdmin", can: ["ALL"] },
  { role: "ops", can: ["users", "access", "notices", "logs", "stats", "policies", "community"] },
  { role: "cs", can: ["users(read)", "logs(read)", "cs", "notices(read)"] },
  { role: "moderator", can: ["community", "logs(read)", "users(limited)", "notices(read)"] },
  { role: "finance", can: ["billing", "logs(read)", "users(read)"] },
];

export default function AdminAccessScreen() {
  const [require2fa, setRequire2fa] = useState(false);
  const [sessionMinutes, setSessionMinutes] = useState(60);
  const [allowlistEnabled, setAllowlistEnabled] = useState(false);
  const [allowlist, setAllowlist] = useState("10.0.0.0/24\n203.0.113.10");

  const [tempRole, setTempRole] = useState("ops");
  const [tempPerm, setTempPerm] = useState("policies");
  const [tempHours, setTempHours] = useState(1);

  const columns = [
    { title: "Role", dataIndex: "role", key: "role", width: 140, render: (v) => <Tag>{v}</Tag> },
    {
      title: "권한(요약)",
      dataIndex: "can",
      key: "can",
      render: (v) => (Array.isArray(v) ? v.join(", ") : String(v)),
    },
  ];

  const allowlistRows = useMemo(() => {
    return String(allowlist || "")
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
  }, [allowlist]);

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <Title level={3} style={{ margin: 0 }}>접근통제</Title>
          <Text type="secondary">RBAC / 관리자 보안(2FA/세션/IP) / 임시 권한(데모)</Text>
        </div>
      </div>

      <div className="admin-two-col">
        <Card
          title={
            <Space size={8}>
              <Shield size={18} />
              <span>RBAC(역할/권한) 매트릭스</span>
            </Space>
          }
        >
          <Table
            rowKey="role"
            columns={columns}
            dataSource={ROLE_MATRIX}
            pagination={false}
            size="small"
          />
          <Text type="secondary" style={{ display: "block", marginTop: 10 }}>
            실제 구현: 서버에서 permission set 내려주고, FE는 메뉴 표시만 제어. 서버는 반드시 재검증.
          </Text>
        </Card>

        <Card
          title={
            <Space size={8}>
              <KeyRound size={18} />
              <span>관리자 로그인 보안</span>
            </Space>
          }
        >
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <Text>2FA 강제(옵션)</Text>
                <div><Text type="secondary">관리자 계정에 2FA를 요구</Text></div>
              </div>
              <Switch checked={require2fa} onChange={setRequire2fa} />
            </div>

            <div>
              <Space size={8} align="center">
                <Timer size={16} />
                <Text>세션 만료(분)</Text>
              </Space>
              <Input
                type="number"
                value={sessionMinutes}
                onChange={(e) => setSessionMinutes(Number(e.target.value || 0))}
                style={{ marginTop: 6 }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <Space size={8} align="center">
                  <Network size={16} />
                  <Text>IP Allowlist(옵션)</Text>
                </Space>
                <div><Text type="secondary">허용된 IP 대역만 관리자 접근 가능</Text></div>
              </div>
              <Switch checked={allowlistEnabled} onChange={setAllowlistEnabled} />
            </div>

            <div>
              <Text type="secondary">Allowlist 목록</Text>
              <Input.TextArea
                rows={5}
                value={allowlist}
                onChange={(e) => setAllowlist(e.target.value)}
                placeholder="한 줄에 하나씩 (CIDR 가능)"
                disabled={!allowlistEnabled}
              />
              {allowlistEnabled ? (
                <Text type="secondary" style={{ display: "block", marginTop: 6 }}>
                  적용 대상: {allowlistRows.length}개
                </Text>
              ) : null}
            </div>

            <Button type="primary" icon={<Save size={16} />} onClick={() => alert("데모: 보안 설정 저장(추후 API)")}>
              저장
            </Button>
          </Space>
        </Card>

        <Card title="임시 권한 부여(데모)" className="admin-card-fullHeight">
          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <Text type="secondary">
              장애 대응 시 특정 권한을 “기간 한정”으로 부여하는 흐름(UI만 반영).
            </Text>

            <div>
              <Text type="secondary">대상 Role</Text>
              <Select
                value={tempRole}
                onChange={setTempRole}
                style={{ width: "100%" }}
                options={[
                  { value: "ops", label: "ops" },
                  { value: "cs", label: "cs" },
                  { value: "moderator", label: "moderator" },
                  { value: "finance", label: "finance" },
                ]}
              />
            </div>

            <div>
              <Text type="secondary">권한</Text>
              <Select
                value={tempPerm}
                onChange={setTempPerm}
                style={{ width: "100%" }}
                options={[
                  { value: "policies", label: "policies(운영정책)" },
                  { value: "logs", label: "logs(로그)" },
                  { value: "notices", label: "notices(공지)" },
                  { value: "users", label: "users(사용자)" },
                ]}
              />
            </div>

            <div>
              <Text type="secondary">기간(시간)</Text>
              <Input
                type="number"
                value={tempHours}
                onChange={(e) => setTempHours(Number(e.target.value || 0))}
              />
            </div>

            <Button
              type="primary"
              onClick={() => alert(`데모: ${tempRole}에 ${tempPerm} 권한을 ${tempHours}시간 부여(추후 API)`)}
            >
              임시 권한 부여
            </Button>

            <Text type="secondary">
              실제 구현: 발급/만료 이벤트는 Audit에 반드시 기록 + 만료 스케줄러 필요.
            </Text>
          </Space>
        </Card>
      </div>
    </div>
  );
}
