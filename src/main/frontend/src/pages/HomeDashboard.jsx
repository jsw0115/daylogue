import React from "react";
import { Calendar, List, Clock, BarChart2, BookOpen } from "lucide-react";

function SummaryCard({ icon, label, value, helper }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
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

export default function HomeDashboard() {
  return (
    <div className="px-8 py-6 space-y-6">
      {/* 오늘 한 줄 다짐 */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">오늘의 팔레트</h1>
          <span className="text-xs text-slate-400">
            PLAN · TASK · ROUTINE · DIARY 를 한 번에 보는 홈 대시보드
          </span>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm flex items-center gap-3">
          <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
            오늘 한 줄 다짐
          </span>
          <input
            className="flex-1 border-none bg-transparent text-sm outline-none placeholder:text-slate-300"
            placeholder="예) 오늘 나는, 중요한 것부터 차분히 처리하고 밤에는 일찍 자고 싶어요."
          />
        </div>
      </section>

      {/* 상단 요약 카드 4개 */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          icon={<Calendar className="w-5 h-5" />}
          label="오늘 일정"
          value="3개"
          helper="중요 일정 1개"
        />
        <SummaryCard
          icon={<List className="w-5 h-5" />}
          label="완료한 할 일"
          value="18 / 30"
          helper="계획 대비 60%"
        />
        <SummaryCard
          icon={<Clock className="w-5 h-5" />}
          label="집중 시간(Actual)"
          value="2시간 30분"
          helper="집중 블록 2개"
        />
        <SummaryCard
          icon={<BarChart2 className="w-5 h-5" />}
          label="루틴 달성률"
          value="72%"
          helper="4개 중 3개 완료"
        />
      </section>

      {/* 메인 레이아웃 */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 왼쪽 2칸: 타임바 미니 + 포커스/오늘 플래너 */}
        <div className="space-y-4 xl:col-span-2">
          {/* 타임바 미니 */}
          <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <header className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  타임바 한눈에 보기
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  오늘 하루 실제로 보낸 시간을 색 블록으로 확인해요.
                </p>
              </div>
              <button className="text-xs font-medium text-indigo-600 hover:underline">
                일간 플래너로 이동
              </button>
            </header>
            {/* 추후 실제 타임바 컴포넌트로 교체 */}
            <div className="h-20 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-[11px] text-slate-400">
              타임라인 다이어리(Timebar) 요약 뷰 자리
            </div>
          </section>

          {/* 오늘의 포커스 + 오늘 플래너 요약 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <header className="mb-2">
                <h2 className="text-sm font-semibold text-slate-900">
                  오늘의 포커스 3
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  오늘 꼭 챙기고 싶은 핵심 작업만 간단히 적어두세요.
                </p>
              </header>
              <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
                <li>SQLD 2장 강의 완강</li>
                <li>30분 러닝 또는 홈트</li>
                <li>25분 깊은 집중 한 세트</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <header className="mb-2 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    오늘 플래너 요약
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-400">
                    일정 · 할 일 · 루틴 · 회고의 요약입니다.
                  </p>
                </div>
              </header>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">일정</span>
                  <span className="font-medium">회의 2, 운동 1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">할 일</span>
                  <span className="font-medium">우선순위 A 3개 남음</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">루틴</span>
                  <span className="font-medium">아침 루틴 완료, 저녁 루틴 남음</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">회고</span>
                  <span className="font-medium text-emerald-600">
                    꾸준함이 쌓이고 있어요
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 오른쪽 1칸: 알림 인박스 + D-Day + 회고 티저 */}
        <div className="space-y-4">
          <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <header className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                알림 인박스
              </h2>
              <button className="text-[11px] text-indigo-600 hover:underline">
                모두 보기
              </button>
            </header>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between">
                <span className="text-slate-600">
                  15:00 SQLD 스터디 일정이 곧 시작됩니다.
                </span>
                <span className="text-slate-400">+10분</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-600">
                  오늘 루틴 1개가 아직 남아 있어요.
                </span>
                <span className="text-slate-400">루틴</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-600">
                  일기 작성 알림: 오늘 하루를 짧게 정리해볼까요?
                </span>
                <span className="text-slate-400">다이어리</span>
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <header className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">D-Day</h2>
              <button className="text-[11px] text-indigo-600 hover:underline">
                관리
              </button>
            </header>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between">
                <span className="text-slate-600">SQLD 시험</span>
                <span className="font-semibold text-rose-500">D-12</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-600">프로젝트 마감</span>
                <span className="font-semibold text-orange-500">D-30</span>
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <header className="mb-2 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  오늘 회고 미리보기
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  일간 플래너의 회고 영역으로 바로 이동할 수 있어요.
                </p>
              </div>
              <BookOpen className="w-4 h-4 text-slate-400" />
            </header>
            <p className="text-xs text-slate-600 leading-relaxed">
              예) 오늘은 업무가 많았지만 할 일의 60%를 마무리했고, 루틴도 대부분
              지켜서 만족스럽다. 저녁에 조금 더 일찍 쉬는 연습이 필요할 것 같다.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
