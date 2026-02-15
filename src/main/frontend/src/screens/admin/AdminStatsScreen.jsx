// FILE: src/main/frontend/src/screens/admin/AdminStatsScreen.jsx
import React, { useMemo, useState } from "react";
import { Card, Col, Row, Statistic, Progress, Typography, Space, Button, DatePicker } from "antd";
import { Download, Activity, BarChart3 } from "lucide-react";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function AdminStatsScreen() {
  const [range, setRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <RangePicker value={range} onChange={setRange} />
          <Button>조회</Button>
        </Space>
        <Button icon={<Download size={16} />}>CSV 다운로드</Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={6}><Card><Statistic title="총 가입자" value={12340} suffix="명" /></Card></Col>
        <Col span={6}><Card><Statistic title="MAU" value={3210} suffix="명" /></Card></Col>
        <Col span={6}><Card><Statistic title="DAU" value={712} suffix="명" /></Card></Col>
        <Col span={6}><Card><Statistic title="매출(이번 달)" value={450} prefix="$" /></Card></Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="모드별 사용 비중">
            <div className="admin-ui__progressRow">
              <span className="admin-ui__progressLabel">J 모드</span>
              <Progress percent={42} strokeColor="#6366f1" />
            </div>
            <div className="admin-ui__progressRow">
              <span className="admin-ui__progressLabel">P 모드</span>
              <Progress percent={31} strokeColor="#10b981" />
            </div>
            <div className="admin-ui__progressRow">
              <span className="admin-ui__progressLabel">B 모드</span>
              <Progress percent={27} strokeColor="#f59e0b" />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="서버 상태">
            <Statistic title="API 응답 시간 (p95)" value={320} suffix="ms" valueStyle={{ color: '#3f8600' }} />
            <Statistic title="에러율" value={0.12} suffix="%" style={{ marginTop: 16 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}