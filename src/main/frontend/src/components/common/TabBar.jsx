// src/main/frontend/src/components/common/TabBar.jsx
import React from "react";
import "../../styles/components.css";

function TabBar({ tabs, activeKey, onChange }) {
  return (
    <div className="tabbar">
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        return (
          <button key={tab.key}
            className={
              active ? "tabbar__item tabbar__item--active" : "tabbar__item"
            }
            onClick={() => onChange && onChange(tab.key)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default TabBar;

