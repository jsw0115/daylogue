// src/main/frontend/src/components/planner/PlannerViewTabs.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TabBar from "../common/TabBar";
import { ROUTES } from "../../shared/constants/routes";

const PLANNER_TABS = [
  { key: "daily", label: "일간", to: ROUTES.DAILY },
  { key: "weekly", label: "주간", to: ROUTES.WEEKLY },
  { key: "monthly", label: "월간", to: ROUTES.MONTHLY },
  { key: "yearly", label: "연간", to: ROUTES.YEARLY },
];

function PlannerViewTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeKey = React.useMemo(() => {
    const path = location.pathname;
    if (path.startsWith(ROUTES.WEEKLY)) return "weekly";
    if (path.startsWith(ROUTES.MONTHLY)) return "monthly";
    if (path.startsWith(ROUTES.YEARLY)) return "yearly";
    return "daily";
  }, [location.pathname]);

  return (
    <div className="planner-tabs">
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

export default PlannerViewTabs;
