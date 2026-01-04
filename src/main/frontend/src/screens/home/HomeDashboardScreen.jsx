import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import {
  Alert,
  Button,
  Checkbox,
  Drawer,
  Input,
  Popconfirm,
  Segmented,
  Space,
  Tooltip,
} from "antd";

import {
  LayoutDashboard,
  Settings2,
  RotateCcw,
  GripVertical,
  ArrowRight,
  EyeOff,
  Search,
} from "lucide-react";

import "../../styles/screens/homeDashboard.css";
import { PORTLETS_BY_ID, DEFAULT_LAYOUTS, DEFAULT_VISIBLE } from "./portlets/portletRegistry";
import { safeStorage } from "../../shared/utils/safeStorage";

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

  const [mode, setMode] = useState("view"); // view | edit
  const editMode = mode === "edit";

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");

  const [layouts, setLayouts] = useState(() => {
    const saved = safeJsonParse(safeStorage.get(STORAGE_LAYOUTS), null);
    return saved || DEFAULT_LAYOUTS;
  });

  const [visible, setVisible] = useState(() => {
    const saved = safeJsonParse(safeStorage.get(STORAGE_VISIBLE), null);
    return saved || DEFAULT_VISIBLE;
  });

  const portletIds = useMemo(
    () => Object.keys(visible).filter((id) => visible[id] && PORTLETS_BY_ID[id]),
    [visible]
  );

  useEffect(() => {
    safeStorage.set(STORAGE_LAYOUTS, JSON.stringify(layouts));
  }, [layouts]);

  useEffect(() => {
    safeStorage.set(STORAGE_VISIBLE, JSON.stringify(visible));
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

  const allPortletList = useMemo(() => {
    const list = Object.keys(PORTLETS_BY_ID).map((id) => PORTLETS_BY_ID[id]);
    const q = pickerQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => {
      const t = (p.title || "").toLowerCase();
      const s = (p.subtitle || "").toLowerCase();
      return p.id.toLowerCase().includes(q) || t.includes(q) || s.includes(q);
    });
  }, [pickerQuery]);

  const storageBlocked = safeStorage.isPersistentAvailable?.() === false;

  return (
    <div className="home-dashboard">
      {/* Top Header */}
      <div className="hd-head">
        <div className="hd-title">
          <div className="hd-titleRow">
            <LayoutDashboard className="hd-titleIcon" />
            <div className="hd-titleText">대시보드</div>
          </div>
          <div className="hd-subtitle">
            진행 상황과 일정/메모를 한눈에 확인하세요.
          </div>
        </div>

        <div className="hd-actions">
          <Space wrap>
            <Button onClick={() => navigate("/planner/daily")} type="default">
              오늘 일간 플래너
            </Button>

            <Segmented
              value={mode}
              onChange={setMode}
              options={[
                { label: "보기", value: "view" },
                { label: "편집", value: "edit" },
              ]}
            />

            <Button
              icon={<Settings2 size={16} />}
              onClick={() => setPickerOpen(true)}
              type="default"
            >
              포틀릿 관리
            </Button>

            <Popconfirm
              title="레이아웃을 초기화할까요?"
              description="배치/숨김 설정이 기본값으로 돌아갑니다."
              okText="초기화"
              cancelText="취소"
              onConfirm={resetLayout}
            >
              <Button icon={<RotateCcw size={16} />} type="default">
                초기화
              </Button>
            </Popconfirm>
          </Space>
        </div>
      </div>

      {storageBlocked ? (
        <Alert
          className="hd-alert"
          type="warning"
          showIcon
          title="현재 환경에서 localStorage가 차단되어, 새로고침 시 대시보드 배치/표시 설정이 유지되지 않을 수 있습니다."
        />
      ) : null}

      {/* Portlet picker Drawer */}
      <Drawer
        title="포틀릿 표시/숨김"
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        size={420}
        destroyOnClose
      >
        <div className="hd-picker">
          <Input
            value={pickerQuery}
            onChange={(e) => setPickerQuery(e.target.value)}
            placeholder="검색(제목/설명/ID)"
            allowClear
            prefix={<Search size={16} />}
          />

          <div className="hd-pickerGrid">
            {allPortletList.map((p) => (
              <label key={p.id} className="hd-pickerItem">
                <Checkbox checked={!!visible[p.id]} onChange={() => togglePortlet(p.id)} />
                <div className="hd-pickerText">
                  <div className="hd-pickerTitle">{p.title}</div>
                  {p.subtitle ? <div className="hd-pickerSub">{p.subtitle}</div> : null}
                </div>
              </label>
            ))}
          </div>

          <div className="hd-pickerHint">
            편집 모드에서 포틀릿을 드래그/리사이즈할 수 있습니다.
          </div>
        </div>
      </Drawer>

      {/* Grid */}
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={24}
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
                  {editMode ? (
                    <Tooltip title="드래그로 이동">
                      <div className="portlet__drag">
                        <GripVertical size={16} />
                      </div>
                    </Tooltip>
                  ) : null}

                  <div className="portlet__titles">
                    <div className="portlet__title">{def.title}</div>
                    {def.subtitle ? (
                      <div className="portlet__subtitle">{def.subtitle}</div>
                    ) : null}
                  </div>
                </div>

                <div className="portlet__head-right">
                  <Space size={6}>
                    {def.route ? (
                      <Button
                        size="small"
                        type="default"
                        icon={<ArrowRight size={16} />}
                        onClick={() => navigate(def.route)}
                      >
                        이동
                      </Button>
                    ) : null}

                    {editMode ? (
                      <Button
                        size="small"
                        danger
                        icon={<EyeOff size={16} />}
                        onClick={() => setVisible((p) => ({ ...p, [id]: false }))}
                      >
                        숨김
                      </Button>
                    ) : null}
                  </Space>
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
