import React, { useMemo } from "react";
import { Checkbox, Space, Tag, Typography } from "antd";

const { Text } = Typography;

export default function TaskSummaryPortlet() {
  const tasks = useMemo(
    () => [
      { id: 1, title: "SQLD 1일 1문제", done: true, durationMin: 30 },
      { id: 2, title: "프로젝트 이슈 정리", done: false, durationMin: 40 },
    ],
    []
  );

  return (
    <Space orientation="vertical" size={10} style={{ width: "100%" }}>
      {tasks.map((t) => (
        <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Checkbox checked={t.done} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{t.title}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              예상 {t.durationMin}분
            </Text>
          </div>
          <Tag>{t.done ? "완료" : "진행"}</Tag>
        </div>
      ))}
      <Text type="secondary" style={{ fontSize: 12 }}>
        실제 연동 시: 오늘 날짜 기준 /api/tasks?date=YYYY-MM-DD
      </Text>
    </Space>
  );
}
