
// FILE: src/main/frontend/src/screens/admin/AdminStatsScreen.jsx
import React from "react";
import { Card, Col, Progress, Row, Statistic, Typography, Button, Space } from "antd";
import { Download, BarChart3 } from "lucide-react";

const { Title, Text } = Typography;

export default function AdminStatsScreen() {
  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <Title level={3} style={{ margin: 0 }}>통계 리포트</Title>
          <Text type="secondary">목업 데이터 · 실제 구현: /api/admin/stats (기간/모드/플랫폼/세그먼트)</Text>
        </div>

        <Space>
          <Button
            type="primary"
            icon={<Download size={16} />}
            onClick={() => alert("데모: CSV 내보내기(추후 API)")}
          >
            CSV 내보내기
          </Button>
        </Space>
      </div>

      <Row gutter={[12, 12]}>
        <Col xs={24} md={12} lg={6}>
          <Card><Statistic title="총 가입자" value={12340} suffix="명" /></Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card><Statistic title="MAU" value={3210} suffix="명" /></Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card><Statistic title="DAU" value={712} suffix="명" /></Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card><Statistic title="30일 유지율" value={68} suffix="%" /></Card>
        </Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space size={8}>
                <BarChart3 size={18} />
                <span>모드별(J/P/B) 사용 비중(최근 30일)</span>
              </Space>
            }
          >
            <div className="admin-ui__progressRow">
              <div className="admin-ui__progressLabel">J 모드</div>
              <Progress percent={42} />
            </div>
            <div className="admin-ui__progressRow">
              <div className="admin-ui__progressLabel">P 모드</div>
              <Progress percent={31} />
            </div>
            <div className="admin-ui__progressRow">
              <div className="admin-ui__progressLabel">B 모드</div>
              <Progress percent={27} />
            </div>

            <Text type="secondary">
              실제 서비스에서는 세션 수/시간/완료율 기준으로 집계 옵션 제공
            </Text>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="타임바/포커스 사용량(요약)">
            <Row gutter={[12, 12]}>
              <Col xs={24} md={12}>
                <Card bordered={false} className="admin-ui__miniCard">
                  <Statistic title="일간 평균 타임블록" value={18} suffix="개" />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card bordered={false} className="admin-ui__miniCard">
                  <Statistic title="일간 평균 포커스" value={3.1} suffix="h" />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card bordered={false} className="admin-ui__miniCard">
                  <Statistic title="평균 Todo 완료율" value={64} suffix="%" />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card bordered={false} className="admin-ui__miniCard">
                  <Statistic title="루틴 달성율" value={58} suffix="%" />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
