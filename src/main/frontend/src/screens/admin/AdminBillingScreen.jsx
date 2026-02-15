// FILE: src/main/frontend/src/screens/admin/AdminBillingScreen.jsx
import React, { useMemo, useState } from "react";
import { Button, Card, Input, Select, Space, Table, Tag, Typography, Modal } from "antd";
import { CreditCard, RefreshCw, Search, XCircle } from "lucide-react";

const { Text } = Typography;

const SEED = [
  { id: "S-2001", userId: "U-1010", plan: "PRO_MONTHLY", status: "ACTIVE", nextBill: "2026-02-05", channel: "Apple" },
  { id: "S-2002", userId: "U-1007", plan: "BASIC", status: "CANCELED", nextBill: "-", channel: "Stripe" },
  { id: "S-2003", userId: "U-1022", plan: "PRO_YEARLY", status: "PAST_DUE", nextBill: "2026-01-01", channel: "Google" },
];

function statusTag(s) {
  if (s === "ACTIVE") return <Tag color="success">ACTIVE</Tag>;
  if (s === "PAST_DUE") return <Tag color="error">PAST_DUE</Tag>;
  return <Tag>CANCELED</Tag>;
}

export default function AdminBillingScreen() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");

  const data = useMemo(() => {
    return SEED.filter(r => {
      if (status !== "ALL" && r.status !== status) return false;
      if (q && !r.userId.includes(q)) return false;
      return true;
    });
  }, [q, status]);

  const columns = [
    { title: "Sub ID", dataIndex: "id", width: 100 },
    { title: "User", dataIndex: "userId", width: 100 },
    { title: "Plan", dataIndex: "plan" },
    { title: "Status", dataIndex: "status", render: v => statusTag(v), width: 100 },
    { title: "Channel", dataIndex: "channel", width: 90 },
    { title: "Next Bill", dataIndex: "nextBill" },
    { 
      title: "Action", 
      render: (_, r) => r.status === 'ACTIVE' && (
        <Button size="small" danger onClick={()=>alert(`구독 ${r.id} 취소 처리`)}>취소</Button>
      )
    }
  ];

  return (
    <div className="admin-two-col">
      <Card title={<Space><CreditCard size={18}/><span>결제/구독 검색</span></Space>}>
        <Space direction="vertical" style={{width:'100%'}} size={16}>
          <div>
            <Text type="secondary">구독 상태</Text>
            <Select value={status} onChange={setStatus} style={{width:'100%'}} options={[{value:'ALL', label:'전체'}, {value:'ACTIVE', label:'활성'}, {value:'CANCELED', label:'취소됨'}]} />
          </div>
          <div>
            <Text type="secondary">User ID 검색</Text>
            <Input value={q} onChange={e=>setQ(e.target.value)} prefix={<Search size={14}/>} placeholder="U-XXXX" />
          </div>
          <Space>
            <Button icon={<RefreshCw size={14}/>} onClick={()=>{setQ(""); setStatus("ALL")}}>초기화</Button>
            <Button type="primary">조회</Button>
          </Space>
        </Space>
      </Card>

      <Card title="구독 내역" className="admin-card-fullHeight">
        <Table dataSource={data} columns={columns} rowKey="id" pagination={{pageSize: 8}} />
      </Card>
    </div>
  );
}