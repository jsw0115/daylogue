import React from "react";
import { Progress, Space, Typography } from "antd";

const { Text } = Typography;

export default function PlanVsActualPortlet() {
  // MVP mock (나중에 /api/stats/dashboard 로 교체)
  const rows = [
    { label: "오늘", plan: 6, actual: 4 },
    { label: "이번 주", plan: 30, actual: 22 },
    { label: "이번 달", plan: 120, actual: 98 },
  ].map((r) => ({
    ...r,
    pct: r.plan > 0 ? Math.round((r.actual / r.plan) * 100) : 0,
  }));

  return (
    <Space orientation="vertical" size={10} style={{ width: "100%" }}>
      {rows.map((r) => (
        <div key={r.label}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <Text strong>{r.label}</Text>
            <Text type="secondary">
              {r.actual}/{r.plan}
            </Text>
          </div>
          <Progress percent={r.pct} />
        </div>
      ))}
      <Text type="secondary" style={{ fontSize: 12 }}>
        실제 연동 시: 계획/실행 정의(타임블록/태스크/루틴) 기준을 옵션으로 분리 권장
      </Text>
    </Space>
  );
}
