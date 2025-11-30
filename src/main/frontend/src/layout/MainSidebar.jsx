import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { Calendar, List, Clock, BarChart2, BookOpen, Settings } from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "HOME",
    items: [{ to: "/", label: "홈" }],
  },
  {
    label: "PLAN",
    items: [
      { to: "/plan/daily", label: "일간" },
      { to: "/plan/weekly", label: "주간" },
      { to: "/plan/monthly", label: "월간" },
      { to: "/plan/yearly", label: "연간" },
    ],
  },
  {
    label: "ACTION",
    items: [{ to: "/tasks", label: "할 일" }],
  },
  {
    label: "RECORD",
    items: [
      { to: "/diary", label: "다이어리" },
      // { to: "/memos", label: "메모" },  // 추후 확장
    ],
  },
  {
    label: "INSIGHT",
    items: [{ to: "/stats", label: "통계" }],
  },
  {
    label: "SETTINGS",
    items: [{ to: "/settings", label: "설정" }],
  },
];

function SidebarNavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        clsx(
          "group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium cursor-pointer mb-1",
          "transition-all duration-150 border",
          isActive
            ? "bg-indigo-50 text-indigo-600 border-indigo-100"
            : "bg-transparent text-slate-700 border-transparent hover:bg-indigo-50/60 hover:border-indigo-100"
        )
      }
    >
      <span
        className={clsx(
          "w-1.5 h-5 rounded-full",
          "transition-colors duration-150",
          "bg-indigo-300 group-[.active]:bg-indigo-500"
        )}
      />
      <span>{label}</span>
    </NavLink>
  );
}

export default function MainSidebar() {
  return (
    <aside className="w-64 border-r border-slate-100 bg-white/90 backdrop-blur-sm px-4 py-5 flex flex-col">
      {/* 로고 영역 */}
      <div className="flex items-center gap-2 px-2 mb-6">
        <div className="h-8 w-8 rounded-xl bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
          D
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-900">Daylogue</span>
          <span className="text-[11px] text-slate-400">
            하루를 색으로 보는 타임라인 다이어리
          </span>
        </div>
      </div>

      {/* 네비게이션 섹션들 */}
      <nav className="flex-1 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            <div className="px-2 mb-1 text-[11px] font-semibold tracking-wide text-slate-400">
              {section.label}
            </div>
            {section.items.map((item) => (
              <SidebarNavItem key={item.to} to={item.to} label={item.label} />
            ))}
          </div>
        ))}
      </nav>

      {/* 하단 작은 퀵 정보 영역 (예: 오늘 사용시간, 버전 등) */}
      <div className="mt-2 px-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>타임라인 기반 집중 관리</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <BarChart2 className="w-3 h-3" />
          <span>루틴·할 일·일기 통합 통계</span>
        </div>
      </div>
    </aside>
  );
}
