import React, { useEffect, useState } from "react";
import { Input, Space, Typography } from "antd";
import { safeStorage } from "../../../shared/utils/safeStorage";

const { Text } = Typography;

export default function TodayMemoPortlet() {
  const [memo, setMemo] = useState(() => safeStorage.get("tbd.todayMemo", ""));

  useEffect(() => {
    safeStorage.set("tbd.todayMemo", memo ?? "");
  }, [memo]);

  return (
    <Space orientation="vertical" size={8} style={{ width: "100%" }}>
      <Input.TextArea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        autoSize={{ minRows: 6, maxRows: 10 }}
        placeholder="오늘의 기록/메모를 남겨보세요."
      />
      <Text type="secondary" style={{ fontSize: 12 }}>
        입력 내용은 로컬에 자동 저장됩니다.
      </Text>
    </Space>
  );
}
