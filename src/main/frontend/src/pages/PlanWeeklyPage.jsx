import React from "react";

export default function PlanWeeklyPage() {
  return (
    <div className="px-8 py-6 space-y-4">
      <h1 className="text-base font-semibold text-slate-900">주간 플래너</h1>
      <p className="text-xs text-slate-500">
        이번 주의 일정 · 할 일 · 루틴을 한 눈에 보는 화면입니다.
        <br />
        나중에 주간 캘린더 그리드 / 주간 목표 / 주간 회고 영역을 여기서 구현할 예정이에요.
      </p>

      <div className="mt-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm text-xs text-slate-500">
        주간 플래너 레이아웃(월~일 그리드 + 주간 목표/회고)을 여기에서 점점 채워 넣으면
        됩니다.
      </div>
    </div>
  );
}
