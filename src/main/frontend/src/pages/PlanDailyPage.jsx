import React from "react";
import { ChevronLeft, ChevronRight, Clock, List } from "lucide-react";
import Calendar from 'react-calendar';

function TimebarPlaceholder() {
  const blocks = [
    { label: "수면", from: "00:00", to: "07:00", color: "bg-slate-200" },
    { label: "출근·업무", from: "09:00", to: "18:00", color: "bg-indigo-200" },
    { label: "공부", from: "20:00", to: "22:00", color: "bg-emerald-200" },
  ];

  return (
    <div className="h-[420px] rounded-lg border border-slate-100 bg-slate-50 p-3 flex flex-col text-[11px]">
      <div className="flex justify-between text-slate-400 mb-1">
        <span>Plan vs Actual</span>
        <span>00:00 ~ 24:00</span>
      </div>
      <div className="flex-1 relative">
        {/* 축 */}
        <div className="absolute left-6 top-0 bottom-0 border-l border-slate-200" />
        {/* 시간 라벨 */}
        {Array.from({ length: 7 }).map((_, idx) => {
          const hour = idx * 4;
          const label = `${hour.toString().padStart(2, "0")}:00`;
          const top = (idx / 6) * 100;
          return (
            <div
              key={label}
              className="absolute left-0 -translate-y-1/2 text-[10px] text-slate-400"
              style={{ top: `${top}%` }}
            >
              {label}
            </div>
          );
        })}
        {/* 블록 (Plan / Actual 예시) */}
        {blocks.map((b, idx) => (
          <div
            key={idx}
            className={`absolute left-6 right-2 rounded-md ${b.color} border border-white shadow-sm`}
            style={{
              top: `${10 + idx * 18}%`,
              height: "14%",
            }}
          >
            <div className="flex justify-between px-2 py-1">
              <span className="font-medium text-slate-700">{b.label}</span>
              <span className="text-slate-500">
                {b.from} ~ {b.to}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
        <span>점선: Plan · 색 블록: Actual</span>
        <span>추후 실제 데이터로 대체</span>
      </div>
    </div>
  );
}

export default function PlanDailyPage() {
  return (
    <div className="px-8 py-6 space-y-6">
      {/* 상단 날짜 + 토글 영역 */}
      <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* 날짜 네비게이션 */}
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-slate-200 bg-white p-1 hover:bg-slate-50">
            <ChevronLeft className="w-4 h-4 text-slate-500" />
          </button>
          <div className="flex flex-col">
            <div className="text-xs text-slate-400">오늘의 타임라인 다이어리</div>
            <div className="text-base font-semibold text-slate-900">
              2025.03.21 (금)
            </div>
          </div>
          <button className="rounded-lg border border-slate-200 bg-white p-1 hover:bg-slate-50">
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Plan / Actual 토글 */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1 text-xs">
            <button className="px-2 py-1 rounded-md bg-indigo-500 text-white font-medium">
              Plan + Actual
            </button>
            <button className="px-2 py-1 rounded-md text-slate-600">
              Plan
            </button>
            <button className="px-2 py-1 rounded-md text-slate-600">
              Actual
            </button>
          </div>
          <button className="hidden md:inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
            <Clock className="w-3.5 h-3.5" />
            지금부터 Actual 기록 시작
          </button>
        </div>
      </section>

      {/* 메인 3분할 레이아웃 */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 좌: 타임바 */}
        <div className="xl:col-span-1">
          <TimebarPlaceholder />
        </div>

        {/* 중간: 일정 + Task */}
        <div className="space-y-4 xl:col-span-1">
          {/* 오늘 일정 */}
          <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <header className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" formatDay={(locale, date) => moment(date).format("DD")} />
                <h2 className="text-sm font-semibold text-slate-900">
                  오늘 일정
                </h2>
              </div>
              <button className="text-[11px] text-indigo-600 hover:underline">
                일정 추가
              </button>
            </header>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between">
                <span className="text-slate-700">10:00 · 팀 미팅</span>
                <span className="text-slate-400">업무</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-700">19:30 · 러닝</span>
                <span className="text-slate-400">건강</span>
              </li>
            </ul>
          </section>

          {/* 오늘 할 일 */}
          <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <header className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-indigo-500" />
                <h2 className="text-sm font-semibold text-slate-900">
                  오늘 할 일
                </h2>
              </div>
              <button className="text-[11px] text-indigo-600 hover:underline">
                + 할 일 추가
              </button>
            </header>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-slate-300" />
                  <span>SQLD 2장 복습</span>
                </div>
                <span className="text-emerald-500 font-medium">공부</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-slate-300" />
                  <span>프로젝트 이슈 정리</span>
                </div>
                <span className="text-slate-400">업무</span>
              </li>
            </ul>
          </section>
        </div>

        {/* 우: 루틴 + 회고 */}
        <div className="space-y-4 xl:col-span-1">
          {/* 루틴 */}
          <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <header className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <h2 className="text-sm font-semibold text-slate-900">
                  오늘 루틴
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">3/4 완료</span>
            </header>
            <ul className="space-y-2 text-xs">
              {["아침 스트레칭", "점심 산책", "저녁 독서", "수면 전 디지털 디톡스"].map(
                (r, idx) => (
                  <li key={r} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-slate-300" />
                      <span className={idx < 2 ? "line-through text-slate-400" : ""}>
                        {r}
                      </span>
                    </div>
                    <span className="text-slate-400">매일</span>
                  </li>
                )
              )}
            </ul>
          </section>

          {/* 회고 */}
          <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <header className="mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                오늘 회고
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                잘한 점 · 아쉬운 점 · 내일을 위해를 간단히 적어보세요.
              </p>
            </header>
            <div className="space-y-2 text-xs">
              <textarea
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:bg-white focus:border-indigo-300"
                rows={5}
                placeholder="예) 오늘은 계획의 70% 정도를 지켰고, 특히 공부 루틴을 잘 해냈다. 다만 밤에 휴대폰 사용 시간이 조금 길었다..."
              />
              <button className="w-full rounded-lg bg-indigo-500 py-1.5 text-xs font-medium text-white hover:bg-indigo-600">
                회고 저장
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
