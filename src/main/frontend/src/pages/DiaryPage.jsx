import React from "react";

export default function DiaryPage() {
  return (
    <div className="px-8 py-6 space-y-4">
      <h1 className="text-base font-semibold text-slate-900">다이어리</h1>
      <p className="text-xs text-slate-500">
        일기 캘린더 + 일기 목록 + 감정/키워드 필터를 제공하는 화면입니다.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* 캘린더 자리 */}
        <div className="lg:col-span-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm text-xs text-slate-500">
          여기에는 월간 캘린더를 배치해서, 기록이 있는 날에 점/아이콘을 표시하면
          돼요.
        </div>

        {/* 선택된 날 일기 리스트 자리 */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm text-xs text-slate-500">
          오른쪽에는 선택한 날짜의 일기 리스트/상세를 보여주는 영역을 만들면 됩니다.
        </div>
      </div>
    </div>
  );
}
