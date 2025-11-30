import React from "react";

export default function PlanYearlyPage() {
  return (
    <div className="px-8 py-6 space-y-4">
      <h1 className="text-base font-semibold text-slate-900">연간 개요</h1>
      <p className="text-xs text-slate-500">
        연간 목표 3~5개, 큰 이벤트 리스트, &quot;색으로 보는 1년&quot; 히트맵을
        보여주는 화면입니다.
      </p>

      <div className="mt-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm text-xs text-slate-500">
        여기에는 12×31 히트맵(연간 타임라인)을 놓고, 아래쪽에 연간 목표/이벤트
        타임라인을 카드 형태로 붙일 수 있어요.
      </div>
    </div>
  );
}
