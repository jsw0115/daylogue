import React from "react";
import TextInput from "../components/common/TextInput";

export default function SettingsPage() {
  return (
    <div className="px-8 py-6 space-y-6">
      <h1 className="text-base font-semibold text-slate-900">개인 설정</h1>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 프로필 */}
        <div className="lg:col-span-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">프로필</h2>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
              D
            </div>
            <button className="text-xs text-indigo-600 hover:underline">
              프로필 이미지 변경
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="이름" fullWidth placeholder="홍길동" />
            <TextInput label="닉네임" fullWidth placeholder="DATA" />
            <TextInput
              label="이메일"
              fullWidth
              placeholder="user@example.com"
              disabled
            />
            <TextInput
              label="시작 화면"
              fullWidth
              placeholder="오늘의 팔레트 (홈)"
            />
          </div>
        </div>

        {/* 환경 설정 요약 */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm space-y-3 text-xs">
          <h2 className="text-sm font-semibold text-slate-900">환경 설정</h2>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">모드</span>
            <span className="font-medium text-indigo-600">J / P 밸런스</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">기본 공개 범위</span>
            <span className="font-medium text-slate-700">나만 보기</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">알림 리드타임</span>
            <span className="font-medium text-slate-700">10분 전</span>
          </div>
        </div>
      </section>
    </div>
  );
}
