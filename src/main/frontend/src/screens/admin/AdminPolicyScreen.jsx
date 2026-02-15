// FILE: src/main/frontend/src/screens/admin/AdminPolicyScreen.jsx
import React, { useState } from "react";
import { Button, Card, Divider, InputNumber, Select, Space, Switch, Typography } from "antd";
import { Settings, Save, AlertTriangle } from "lucide-react";

const { Text } = Typography;

export default function AdminPolicyScreen() {
  // Policy States
  const [pvaMode, setPvaMode] = useState("strict"); // strict | loose
  const [maxCapping, setMaxCapping] = useState(100);
  const [allowCarryOver, setAllowCarryOver] = useState(true);
  const [syncConflict, setSyncConflict] = useState("manual");
  
  const handleSave = () => {
    alert("정책이 저장되었습니다. 서버 캐시가 갱신됩니다.");
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card 
        title={<Space><Settings size={18}/><span>서비스 운영 정책</span></Space>}
        extra={<Button type="primary" icon={<Save size={16}/>} onClick={handleSave}>적용</Button>}
      >
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
          
          {/* 1. PvA Logic */}
          <div>
            <h4 style={{marginBottom: 12, fontWeight: 700}}>📊 PvA (Plan vs Actual) 산정 기준</h4>
            <Space direction="vertical" style={{width:'100%'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:600}}>달성률 캡핑 (Max Rate)</div>
                  <Text type="secondary" style={{fontSize:12}}>100%를 초과하는 달성률을 표기할지 여부</Text>
                </div>
                <Select value={maxCapping} onChange={setMaxCapping} style={{width: 140}} options={[{value:100, label:'100% 제한'}, {value:999, label:'제한 없음'}]} />
              </div>
              
              <Divider style={{margin:'12px 0'}}/>

              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:600}}>미달성 일정 이월 (Carry Over)</div>
                  <Text type="secondary" style={{fontSize:12}}>자정이 지나면 미완료 일정을 다음날로 자동 이동</Text>
                </div>
                <Switch checked={allowCarryOver} onChange={setAllowCarryOver} />
              </div>
            </Space>
          </div>

          {/* 2. Sync Logic */}
          <div>
            <h4 style={{marginBottom: 12, fontWeight: 700}}>🔄 데이터 동기화 충돌 정책</h4>
            <div style={{background:'#fffbe6', padding: 12, borderRadius: 8, marginBottom: 12, border: '1px solid #ffe58f'}}>
              <Space><AlertTriangle size={16} color="#d48806"/><Text type="warning">정책 변경 시 클라이언트 재동기화가 발생할 수 있습니다.</Text></Space>
            </div>
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{fontWeight:600}}>충돌 해결 우선순위</div>
                <Text type="secondary" style={{fontSize:12}}>서버와 클라이언트 데이터가 다를 경우 기준</Text>
              </div>
              <Select 
                value={syncConflict} onChange={setSyncConflict} style={{width: 200}}
                options={[
                  {value:'server', label:'서버 데이터 우선'},
                  {value:'client', label:'클라이언트(최신) 우선'},
                  {value:'manual', label:'사용자에게 묻기'}
                ]} 
              />
            </div>
          </div>

          {/* 3. Global Thresholds */}
          <div>
            <h4 style={{marginBottom: 12, fontWeight: 700}}>🛑 어뷰징 방지 임계값</h4>
            <div style={{display:'flex', alignItems:'center', gap: 16}}>
              <Text>도배 방지 (초당 요청):</Text>
              <InputNumber defaultValue={5} />
              <Text>일일 최대 게시글:</Text>
              <InputNumber defaultValue={20} />
            </div>
          </div>

        </Space>
      </Card>
    </div>
  );
}