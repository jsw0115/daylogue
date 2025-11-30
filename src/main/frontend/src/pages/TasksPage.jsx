import React from "react";

const CATEGORY_CHIPS = ["전체", "공부", "업무", "건강", "가족", "기타"];

export default function TasksPage() {
  return (
    <div className="px-8 py-6 space-y-4">
      <section className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-slate-900">할 일</h1>
        <button className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-600">
          + 새 할 일
        </button>
      </section>

      {/* 필터 칩 */}
      <section className="flex flex-wrap gap-2">
        {CATEGORY_CHIPS.map((c, idx) => (
          <button
            key={c}
            className={
              idx === 0
                ? "rounded-full bg-indigo-500 px-3 py-1 text-[11px] font-medium text-white"
                : "rounded-full bg-white px-3 py-1 text-[11px] text-slate-600 border border-slate-200 hover:bg-slate-50"
            }
          >
            {c}
          </button>
        ))}
      </section>

      {/* 리스트 */}
      <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400">
              <th className="py-2 text-left w-8"></th>
              <th className="py-2 text-left">할 일</th>
              <th className="py-2 text-left w-24">카테고리</th>
              <th className="py-2 text-left w-24">기한</th>
              <th className="py-2 text-left w-20">상태</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-50 hover:bg-slate-50/60">
              <td className="py-2">
                <input type="checkbox" className="rounded border-slate-300" />
              </td>
              <td className="py-2 text-slate-800">
                SQLD 강의 2장 복습 노트 정리
              </td>
              <td className="py-2">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-600">
                  공부
                </span>
              </td>
              <td className="py-2 text-slate-500">오늘</td>
              <td className="py-2">
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-600">
                  진행 중
                </span>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/60">
              <td className="py-2">
                <input type="checkbox" className="rounded border-slate-300" />
              </td>
              <td className="py-2 text-slate-800">프로젝트 이슈 정리 후 공유</td>
              <td className="py-2">
                <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] text-sky-600">
                  업무
                </span>
              </td>
              <td className="py-2 text-slate-500">내일</td>
              <td className="py-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                  예정
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
