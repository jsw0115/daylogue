import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, Bell, Settings, ChevronRight, Clock, BarChart2 } from "lucide-react";

// 라우트별 타이틀
const ROUTE_TITLES = {
  "/": "오늘의 팔레트",
  "/plan/daily": "일간 플래너",
  "/plan/weekly": "주간 플래너",
  "/plan/monthly": "월간 플래너",
  "/plan/yearly": "연간 개요",
  "/tasks": "할 일",
  "/diary": "다이어리",
  "/stats": "통계 대시보드",
  "/settings": "개인 설정",
};

// dayjs 대신 순수 JS로 날짜 포맷
function formatToday() {
  const now = new Date();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const w = weekdays[now.getDay()];
  return `${yyyy}.${mm}.${dd} (${w})`;
}

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = ROUTE_TITLES[location.pathname] ?? "Daylogue";
  const today = formatToday();

  return (
    <header className="h-14 border-b border-slate-100 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6">
      {/* 좌측: 페이지 타이틀 + 오늘 날짜 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-slate-900">{title}</span>
        </div>
        <span className="text-xs text-slate-400">{today}</span>
      </div>

      {/* 우측: 액션 영역 */}
      <div className="flex items-center gap-3">
        {/* 오늘로 이동 (일간 플래너) */}
        <button
          type="button"
          onClick={() => navigate("/plan/daily")}
          className="hidden md:inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>오늘로 이동</span>
        </button>

        {/* 개인 설정 이동 */}
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>개인 설정</span>
        </button>

        {/* 알림 아이콘 */}
        <button
          type="button"
          className="relative rounded-full p-1.5 hover:bg-slate-100"
        >
          <Bell className="w-4 h-4 text-slate-500" />
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-rose-500 text-[9px] text-white flex items-center justify-center">
            3
          </span>
        </button>

        {/* 유저 미니 카드 */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50"
        >
          <div className="h-7 w-7 rounded-full bg-indigo-500 text-[11px] text-white flex items-center justify-center">
            D
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-xs font-medium text-slate-800">DATA</span>
            <span className="text-[10px] text-slate-400">관리자</span>
          </div>
          <ChevronRight className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
