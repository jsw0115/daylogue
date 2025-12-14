import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import "./../../styles/screens/homeDashboard.css";
import { PORTLETS_BY_ID, DEFAULT_LAYOUTS, DEFAULT_VISIBLE } from "./portlets/portletRegistry";
import storage from "../../shared/utils/safeStorage";

const ResponsiveGridLayout = WidthProvider(Responsive);

const STORAGE_LAYOUTS = "timebar.dashboard.layouts.v1";
const STORAGE_VISIBLE = "timebar.dashboard.visible.v1";

function safeJsonParse(str, fallback) {
  try {
    const v = JSON.parse(str);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export default function HomeDashboardScreen() {
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);

  // ✅ localStorage가 막혀도 여기서 크래시 나면 안 됨 → storage 래퍼 사용
  const [layouts, setLayouts] = useState(() => {
    const saved = safeJsonParse(storage.get(STORAGE_LAYOUTS), null);
    return saved || DEFAULT_LAYOUTS;
  });

  const [visible, setVisible] = useState(() => {
    const saved = safeJsonParse(storage.get(STORAGE_VISIBLE), null);
    return saved || DEFAULT_VISIBLE;
  });

  const portletIds = useMemo(
    () => Object.keys(visible).filter((id) => visible[id] && PORTLETS_BY_ID[id]),
    [visible]
  );

  useEffect(() => {
    storage.set(STORAGE_LAYOUTS, JSON.stringify(layouts));
  }, [layouts]);

  useEffect(() => {
    storage.set(STORAGE_VISIBLE, JSON.stringify(visible));
  }, [visible]);

  const onLayoutChange = (_, allLayouts) => {
    setLayouts(allLayouts);
  };

  const resetLayout = () => {
    setLayouts(DEFAULT_LAYOUTS);
    setVisible(DEFAULT_VISIBLE);
  };

  const togglePortlet = (id) => {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="home-dashboard">
      <div className="screen-head">
        <div>
          <div className="screen-title">대시보드</div>
          <div className="screen-subtitle">
            진행 상황과 일정/메모를 한눈에 확인하세요.
            {!storage.isPersistentAvailable() && (
              <span className="muted" style={{ marginLeft: 8 }}>
                (현재 환경에서 localStorage가 차단되어 새로고침 시 저장이 유지되지 않을 수 있어요)
              </span>
            )}
          </div>
        </div>

        <div className="screen-actions">
          <button className="btn" onClick={() => navigate("/planner/daily")} type="button">
            오늘 일간 플래너
          </button>
          <button className="btn primary" onClick={() => setEditMode((v) => !v)} type="button">
            편집 모드 {editMode ? "ON" : "OFF"}
          </button>
          <button className="btn" onClick={resetLayout} type="button">
            레이아웃 초기화
          </button>
        </div>
      </div>

      {editMode && (
        <div className="portlet-picker">
          <div className="portlet-picker__title">포틀릿 표시/숨김</div>
          <div className="portlet-picker__grid">
            {Object.keys(PORTLETS_BY_ID).map((id) => (
              <label key={id} className="portlet-picker__item">
                <input
                  type="checkbox"
                  checked={!!visible[id]}
                  onChange={() => togglePortlet(id)}
                />
                <span>{PORTLETS_BY_ID[id].title}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={22}
        margin={[14, 14]}
        containerPadding={[6, 6]}
        isDraggable={editMode}
        isResizable={editMode}
        draggableHandle=".portlet__drag"
        onLayoutChange={onLayoutChange}
        compactType="vertical"
        preventCollision={false}
      >
        {portletIds.map((id) => {
          const def = PORTLETS_BY_ID[id];
          const Comp = def.component;
          return (
            <div key={id} className="portlet">
              <div className="portlet__head">
                <div className="portlet__head-left">
                  {editMode && (
                    <div className="portlet__drag" title="드래그로 이동">
                      ⋮⋮
                    </div>
                  )}
                  <div className="portlet__titles">
                    <div className="portlet__title">{def.title}</div>
                    {def.subtitle && <div className="portlet__subtitle">{def.subtitle}</div>}
                  </div>
                </div>

                <div className="portlet__head-right">
                  {def.route && (
                    <button className="btn xs" onClick={() => navigate(def.route)} type="button">
                      이동
                    </button>
                  )}
                  {editMode && (
                    <button
                      className="btn xs danger"
                      onClick={() => setVisible((p) => ({ ...p, [id]: false }))}
                      type="button"
                    >
                      숨김
                    </button>
                  )}
                </div>
              </div>

              <div className="portlet__body">
                <Comp />
              </div>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
}
