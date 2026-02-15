// FILE: src/main/frontend/src/screens/admin/AdminAccessScreen.jsx
import React, { useState } from "react";
import { Button, Card, Input, Select, Space, Switch, Table, Tag, Typography, Divider } from "antd";
import { Shield, KeyRound, Network, Timer, Save } from "lucide-react";

const { Title, Text } = Typography;

const ROLE_MATRIX = [
  { role: "superAdmin", desc: "시스템 전체 제어", can: "ALL" },
  { role: "ops", desc: "운영/관리", can: "Users, Contents, Stats" },
  { role: "cs", desc: "고객 응대", can: "Users(Read), Logs(Read)" },
  { role: "finance", desc: "정산/결제", can: "Billing" },
];

export default function AdminAccessScreen() {
  // Security Config States
  const [use2FA, setUse2FA] = useState(true);
  const [useAllowList, setUseAllowList] = useState(false);
  const [allowIps, setAllowIps] = useState("10.0.0.1/24\n192.168.1.100");
  const [sessionTime, setSessionTime] = useState(60);

  // Temporary Permission State
  const [tempRole, setTempRole] = useState("ops");
  const [tempDuration, setTempDuration] = useState(1);

  return (
    <div className="admin-two-col">
      {/* 1. RBAC Matrix */}
      <Card title={<Space><Shield size={18}/><span>RBAC (Role Matrix)</span></Space>}>
        <Table 
          dataSource={ROLE_MATRIX} 
          rowKey="role"
          pagination={false}
          size="small"
          columns={[
            { title: "Role", dataIndex: "role", render: v => <Tag color="blue">{v}</Tag> },
            { title: "Description", dataIndex: "desc" },
            { title: "Permissions", dataIndex: "can", render: v => <Text type="secondary">{v}</Text> },
          ]}
        />
        <div style={{marginTop: 12, padding: 12, background: '#f9f9f9', borderRadius: 8}}>
          <Text type="warning">ℹ️ 권한 정의는 서버 설정 파일(YAML/DB)을 따르며, 이곳에서는 조회만 가능합니다.</Text>
        </div>
      </Card>

      {/* 2. Security Config */}
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card title={<Space><KeyRound size={18}/><span>관리자 보안 설정</span></Space>}>
          <Space direction="vertical" style={{width:'100%'}} size={16}>
            
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span>2FA 인증 강제 (Google OTP)</span>
              <Switch checked={use2FA} onChange={setUse2FA} />
            </div>
            
            <Divider style={{margin:'4px 0'}} />

            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span>세션 만료 시간 (분)</span>
              <Input 
                type="number" value={sessionTime} onChange={e=>setSessionTime(e.target.value)} 
                style={{width: 100}} suffix="min" 
              />
            </div>

            <Divider style={{margin:'4px 0'}} />

            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span>IP Allowlist 활성화</span>
              <Switch checked={useAllowList} onChange={setUseAllowList} />
            </div>

            {useAllowList && (
              <div>
                <Text type="secondary" style={{fontSize: 12}}>허용 IP 목록 (CIDR 가능)</Text>
                <Input.TextArea 
                  rows={4} 
                  value={allowIps} 
                  onChange={e => setAllowIps(e.target.value)} 
                  style={{marginTop: 8}}
                />
              </div>
            )}

            <Button type="primary" icon={<Save size={16}/>} block onClick={() => alert("보안 설정 저장됨")}>
              설정 저장
            </Button>
          </Space>
        </Card>

        {/* 3. Emergency Access */}
        <Card title={<Space><Timer size={18}/><span>임시 권한 부여 (Emergency)</span></Space>}>
          <Space direction="vertical" style={{width:'100%'}}>
            <Text type="secondary">장애 대응 등을 위해 일시적으로 권한을 상향합니다.</Text>
            <Space>
              <Select value={tempRole} onChange={setTempRole} style={{width: 120}} options={[{value:'ops', label:'Ops'}, {value:'superAdmin', label:'SuperAdmin'}]} />
              <Input type="number" value={tempDuration} onChange={e=>setTempDuration(e.target.value)} suffix="시간" style={{width: 100}} />
              <Button danger>권한 부여</Button>
            </Space>
          </Space>
        </Card>
      </Space>
    </div>
  );
}