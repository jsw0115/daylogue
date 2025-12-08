// FILE: src/main/frontend/src/screens/plan/PlannerTabs.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TabBar from "../../components/common/TabBar";
import { ROUTES } from "../../shared/constants/routes";

/**
 * PLAN-001~004 공통 상단 탭
 * - GLB-002: 플래너 뷰 전환 탭 (일간/주간/월간/연간)
 */
const PLANNER_TABS = [
  { key: "daily", label: "일간 플래너", to: ROUTES.PLAN_DAILY },
  { key: "weekly", label: "주간 플래너", to: ROUTES.PLAN_WEEKLY },
  { key: "monthly", label: "월간 플래너", to: ROUTES.PLAN_MONTHLY },
  { key: "yearly", label: "연간 개요", to: ROUTES.PLAN_YEARLY },
];

function PlannerTabs({ className = "" }) {
  const location = useLocation();
  const navigate = useNavigate();

  const activeKey = React.useMemo(() => {
    const path = location.pathname;
    if (path.startsWith(ROUTES.PLAN_WEEKLY)) return "weekly";
    if (path.startsWith(ROUTES.PLAN_MONTHLY)) return "monthly";
    if (path.startsWith(ROUTES.PLAN_YEARLY)) return "yearly";
    return "daily";
  }, [location.pathname]);

  return (
    <div className={`planner-tabs ${className}`}>
      <TabBar
        tabs={PLANNER_TABS}
        activeKey={activeKey}
        onChange={(key) => {
          const target = PLANNER_TABS.find((t) => t.key === key);
          if (target) navigate(target.to);
        }}
      />
    </div>
  );
}

export default PlannerTabs;
