import React from "react";

export default function PlanMonthlyPage() {
  return (
    <div className="px-8 py-6 space-y-4">
      <h1 className="text-base font-semibold text-slate-900">월간 플래너</h1>
      <p className="text-xs text-slate-500">
        월간 캘린더 + 월간 목표/회고 + 주요 D-Day 를 보는 화면입니다.
      </p>

      <div className="mt-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm text-xs text-slate-500">
        실제 달력 컴포넌트(캘린더 라이브러리 or 커스텀)를 여기 중앙에 배치하고,
        우측 또는 하단에 월간 목표/회고/통계 카드를 추가하면 됩니다.
      </div>
    </div>
  );
}
