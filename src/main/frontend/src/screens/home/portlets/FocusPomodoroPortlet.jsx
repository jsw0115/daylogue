import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Space, Typography } from "antd";
import { Play, BarChart3 } from "lucide-react";

const { Text } = Typography;

export default function FocusPomodoroPortlet() {
  const navigate = useNavigate();

  return (
    <Space orientation="vertical" size={10} style={{ width: "100%" }}>
      <Text type="secondary">
        포모도로(25/5)로 빠르게 집중을 시작할 수 있어요.
      </Text>

      <Space wrap>
        <Button
          type="primary"
          icon={<Play size={16} />}
          onClick={() => navigate("/focus")}
        >
          포모도로 시작
        </Button>
        <Button
          icon={<BarChart3 size={16} />}
          onClick={() => navigate("/insight/stat")}
        >
          통계 보기
        </Button>
      </Space>
    </Space>
  );
}
