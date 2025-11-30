// src/screens/HomeScreen.jsx

import React from "react";
import { CalendarDays, CheckSquare, Clock3 } from "lucide-react";

function SummaryCard({ icon, label, value, helper }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className="text-lg font-semibold text-slate-900">{value}</span>
        {helper && (
          <span className="text-[11px] text-slate-400">{helper}</span>
        )}
      </div>
    </div>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <header className="mb-3">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
        )}
      </header>
      {children}
    </section>
  );
}

export default function HomeScreen() {
  return (
    <div className="flex flex-col gap-6 px-8 py-6">
      {/* 페이지 타이틀 */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">오늘의 팔레트</h1>
        <p className="mt-1 text-sm text-slate-500">
          오늘 하루의 타임바, 일정, 할 일, 루틴을 한 번에 확인하는 홈 화면입니다.
        </p>
      </div>

      {/* 상단 요약 카드 3개 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          icon={<CalendarDays className="w-5 h-5" />}
          label="오늘의 일정"
          value="3개"
          helper="중요 일정 1개 포함"
        />
        <SummaryCard
          icon={<CheckSquare className="w-5 h-5" />}
          label="완료한 할 일"
          value="18 / 30"
          helper="오늘 계획 대비 60%"
        />
        <SummaryCard
          icon={<Clock3 className="w-5 h-5" />}
          label="집중한 시간"
          value="2시간 30분"
          helper="집중 루틴 2세트"
        />
      </section>

      {/* 메인 영역: 2단 그리드 */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 왼쪽 2칸: 타임바 + 오늘의 포커스 */}
        <div className="space-y-4 xl:col-span-2">
          <Card
            title="타임바 한눈에 보기"
            subtitle="계획 vs 실제를 비교하면서 오늘의 흐름을 확인해요."
          >
            {/* 나중에 실제 타임바 컴포넌트로 교체 */}
            <div className="h-24 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
              타임바 컴포넌트 자리
            </div>
          </Card>

          <Card
            title="오늘의 포커스"
            subtitle="오늘 꼭 챙기고 싶은 우선순위 3가지를 적어보세요."
          >
            <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
              <li>SQLD 2장 강의 완강</li>
              <li>30분 러닝 또는 홈트</li>
              <li>25분 깊은 집중 한 세트</li>
            </ul>
          </Card>
        </div>

        {/* 오른쪽 1칸: 진행 상황 + 일기/회고 */}
        <div className="space-y-4">
          <Card
            title="진행 상황"
            subtitle="오늘의 루틴과 할 일 달성률을 한 번에 확인해요."
          >
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>완료한 할 일</span>
                <span className="font-semibold">18 / 30</span>
              </div>
              <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
                <span className="block w-[60%] rounded-full bg-indigo-400" />
              </div>
              <div className="flex items-center justify-between">
                <span>루틴 달성률</span>
                <span className="font-semibold text-indigo-500">72%</span>
              </div>
            </div>
          </Card>

          <Card
            title="일기 / 회고"
            subtitle="오늘 하루를 짧게 돌아보고 기록해보세요."
          >
            <p className="text-sm text-slate-700 leading-relaxed">
              예) 오늘은 업무가 많았지만, 루틴을 대부분 지켜서 꽤 뿌듯했다.
              저녁에 잠깐이라도 산책을 했으면 더 좋았을 것 같다.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
