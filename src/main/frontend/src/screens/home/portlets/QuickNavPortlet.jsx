import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Space } from "antd";
import { CalendarDays, CalendarRange, Calendar, CheckSquare, Focus, Database } from "lucide-react";

export default function QuickNavPortlet() {
  const navigate = useNavigate();
  const go = (to) => () => navigate(to);

  return (
    <Space wrap>
      <Button size="small" icon={<CalendarDays size={16} />} onClick={go("/planner/daily")}>
        일간
      </Button>
      <Button size="small" icon={<CalendarRange size={16} />} onClick={go("/planner/weekly")}>
        주간
      </Button>
      <Button size="small" icon={<Calendar size={16} />} onClick={go("/planner/monthly")}>
        월간
      </Button>
      <Button size="small" icon={<CheckSquare size={16} />} onClick={go("/action/task")}>
        할 일
      </Button>
      <Button size="small" icon={<Focus size={16} />} onClick={go("/focus")}>
        포커스
      </Button>
      <Button size="small" icon={<Database size={16} />} onClick={go("/data")}>
        데이터
      </Button>
    </Space>
  );
}
