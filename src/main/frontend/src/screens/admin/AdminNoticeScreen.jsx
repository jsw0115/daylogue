// FILE : src/main/frontend/src/screens/admin/AdminNoticeScreen.jsx
import React, { useState } from "react";
import { Button, Card, Table, Tag, Space, Form, Input, Select, DatePicker } from "antd";
import { Plus } from "lucide-react";

const DATA = [
  { id: 1, type: "공지", title: "서비스 점검 안내", status: "예약", date: "2026-02-20" },
  { id: 2, type: "이벤트", title: "신규 가입 이벤트", status: "진행중", date: "2026-02-01 ~ 02-28" },
];

export default function AdminNoticeScreen() {
  const [form] = Form.useForm();
  
  const columns = [
    { title: "타입", dataIndex: "type", render: t => <Tag>{t}</Tag> },
    { title: "제목", dataIndex: "title" },
    { title: "상태", dataIndex: "status", render: s => <Tag color={s === '진행중' ? 'green' : 'blue'}>{s}</Tag> },
    { title: "기간", dataIndex: "date" },
    { title: "관리", render: () => <Button size="small">수정</Button> },
  ];

  return (
    <div className="admin-two-col">
      <Card title="공지 등록/수정">
        <Form layout="vertical" form={form}>
          <Form.Item label="타입" name="type"><Select options={[{value:'공지'}, {value:'이벤트'}, {value:'배너'}]} /></Form.Item>
          <Form.Item label="제목" name="title"><Input /></Form.Item>
          <Form.Item label="기간" name="date"><DatePicker.RangePicker style={{width:'100%'}} /></Form.Item>
          <Form.Item label="내용" name="content"><Input.TextArea rows={4} /></Form.Item>
          <Button type="primary" icon={<Plus size={16} />}>등록</Button>
        </Form>
      </Card>
      <Card title="공지 목록">
        <Table columns={columns} dataSource={DATA} rowKey="id" pagination={false} />
      </Card>
    </div>
  );
}