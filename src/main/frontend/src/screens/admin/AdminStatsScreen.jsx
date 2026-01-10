import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Typography,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { Download, BarChart3, Activity, ShieldCheck } from "lucide-react";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function AdminStatsScreen() {
  const [range, setRange] = useState([dayjs().add(-30, "day"), dayjs()]);
  const [platform, setPlatform] = useState("ALL"); // ALL | WEB | MOBILE
  const [mode, setMode] = useState("ALL"); // ALL | J | P | B
  const [segment, setSegment] = useState("ALL"); // ALL | NEW_USERS | SUBSCRIBERS | SYNC_ENABLED

  const stats = useMemo(() => {
    // 데모: 필터가 바뀌어도 숫자를 살짝만 변화시키는 목업
    const mul =
      (platform === "ALL" ? 1 : 0.95) *
      (mode === "ALL" ? 1 : 0.97) *
      (segment === "ALL" ? 1 : 0.93);

    return {
      totalUsers: Math.round(12340 * mul),
      mau: Math.round(3210 * mul),
      dau: Math.round(712 * mul),
      retention30: Math.round(68 * mul),
      syncConflictRate: Math.round(4.8 * (2 - mul) * 10) / 10, // 대충
      reportSlaHours: Math.round(6.5 * (2 - mul) * 10) / 10,
    };
  }, [platform, mode, segment, range]);

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

      <Card style={{ marginBottom: 12 }}>
        <Space wrap align="center">
          <Tag color="processing">FILTER</Tag>

          <div>
            <Text type="secondary">기간</Text>
            <div>
              <RangePicker value={range} onChange={(v) => setRange(v)} />
            </div>
          </div>

          <div>
            <Text type="secondary">플랫폼</Text>
            <div>
              <Select
                value={platform}
                onChange={setPlatform}
                style={{ width: 140 }}
                options={[
                  { value: "ALL", label: "ALL" },
                  { value: "WEB", label: "WEB" },
                  { value: "MOBILE", label: "MOBILE" },
                ]}
              />
            </div>
          </div>

          <div>
            <Text type="secondary">모드</Text>
            <div>
              <Select
                value={mode}
                onChange={setMode}
                style={{ width: 120 }}
                options={[
                  { value: "ALL", label: "ALL" },
                  { value: "J", label: "J" },
                  { value: "P", label: "P" },
                  { value: "B", label: "B" },
                ]}
              />
            </div>
          </div>

          <div>
            <Text type="secondary">세그먼트</Text>
            <div>
              <Select
                value={segment}
                onChange={setSegment}
                style={{ width: 180 }}
                options={[
                  { value: "ALL", label: "ALL" },
                  { value: "NEW_USERS", label: "NEW_USERS" },
                  { value: "SUBSCRIBERS", label: "SUBSCRIBERS" },
                  { value: "SYNC_ENABLED", label: "SYNC_ENABLED" },
                ]}
              />
            </div>
          </div>
        </Space>
      </Card>

      <Row gutter={[12, 12]}>
        <Col xs={24} md={12} lg={6}>
          <Card><Statistic title="총 가입자" value={stats.totalUsers} suffix="명" /></Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card><Statistic title="MAU" value={stats.mau} suffix="명" /></Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card><Statistic title="DAU" value={stats.dau} suffix="명" /></Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card><Statistic title="30일 유지율" value={stats.retention30} suffix="%" /></Card>
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
              실제 서비스: 세션/시간/완료율 기반 집계 옵션 + 코호트 비교
            </Text>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space size={8}>
                <Activity size={18} />
                <span>품질 지표(운영)</span>
              </Space>
            }
          >
            <Row gutter={[12, 12]}>
              <Col xs={24} md={12}>
                <Card bordered={false} className="admin-ui__miniCard">
                  <Statistic title="동기화 충돌률" value={stats.syncConflictRate} suffix="%" />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card bordered={false} className="admin-ui__miniCard">
                  <Statistic title="신고 처리 SLA" value={stats.reportSlaHours} suffix="h" />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card bordered={false} className="admin-ui__miniCard">
                  <Statistic title="API p95" value={320} suffix="ms" />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card bordered={false} className="admin-ui__miniCard">
                  <Statistic title="동기화 실패율" value={1.3} suffix="%" />
                </Card>
              </Col>
            </Row>

            <div style={{ marginTop: 10 }}>
              <Space size={8}>
                <ShieldCheck size={16} />
                <Text type="secondary">
                  실제 운영: 알람 룰(급증 탐지), 릴리즈 버전별 비교, 원인 분석 링크가 필요
                </Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
