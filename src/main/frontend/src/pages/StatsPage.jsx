import React from "react";

function KpiCard({ label, value, helper }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
      {helper && (
        <div className="mt-0.5 text-[11px] text-slate-400">{helper}</div>
      )}
    </div>
  );
}

export default function StatsPage() {
  return (
    <div className="px-8 py-6 space-y-4">
      <h1 className="text-base font-semibold text-slate-900">
        통계 대시보드
      </h1>
      <p className="text-xs text-slate-500">
        할 일 · 루틴 · 다이어리 · 타임바 사용 시간을 한 곳에서 보는 화면입니다.
      </p>

      {/* KPI 카드 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <KpiCard label="이번 주 완료한 할 일" value="24개" helper="지난 주 대비 +6개" />
        <KpiCard label="루틴 평균 달성률" value="68%" helper="목표 70%" />
        <KpiCard label="일기 작성일 수(이번 달)" value="12일" helper="연속 4일 기록 중" />
      </section>

      {/* 그래프 자리 */}
      <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm mt-4 text-xs text-slate-500">
        여기에는 막대/라인 그래프(Plan vs Actual, 카테고리별 시간 사용 등)를
        차트 라이브러리로 그리면 됩니다.
      </section>
    </div>
  );
}
