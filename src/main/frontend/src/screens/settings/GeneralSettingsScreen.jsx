// FILE: src/main/frontend/src/screens/settings/GeneralSettingsScreen.jsx
import React, { useState } from "react";
import { SettingsLayout } from "./SettingsLayout";
// import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import { useAppMode, APP_MODES } from "../../shared/context/AppModeContext";
import { Checkbox } from "../../components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

function GeneralSettingsScreen() {
  const { mode } = useAppMode();

  const modeLabel =
    mode === APP_MODES.J
      ? "J (계획형)"
      : mode === APP_MODES.P
      ? "P (기록형)"
      : "B (밸런스)";

  // 1. 옵션 데이터 정의
  // 타임존 
  const timezoneOptions = [
    { value: "Asia/Seoul", label: "서울 (GMT+9)" },
    { value: "UTC", label: "UTC (GMT+0)" },
    { value: "America/New_York", label: "뉴욕 (GMT-5)" },
  ];

  // 시간 관리 모드 
  const planModeOptions = [
    { value: "J", label: "J (계획형 · Plan 중심)" },
    { value: "P", label: "P (기록형 · Actual 중심)" },
    { value: "B", label: "B (밸런스 · Plan + Actual)" },
  ];

  // 기본 시작 화면 
  const genStartOptions = [
    { value: "home", label: "홈 대시보드" },
    { value: "plan_daily", label: "일간 플래너" },
    { value: "stat", label: "통합 통계" },
  ];

  // 기본 공개 범위
  const sharedRangeOptions = [
    { value: "private", label: "나만 보기" },
    { value: "busy", label: "바쁨만 공유" },
    { value: "attendees", label: "참석자에게만" },
    { value: "public", label: "모두에게 공개" },
  ];

  // 날짜 / 시간 포맷 
  const dateOptions = [
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
    { value: "YYYY.MM.DD", label: "YYYY.MM.DD" },
    { value: "MM/DD", label: "MM/DD" },
  ];

  const timeOptions = [
    { value: "24", label: "24시간제" },
    { value: "12", label: "12시간제" },
  ];

  // 언어
  const langOptions = [
    { value: "ko", label: "한국어" },
    { value: "en", label: "English" },
  ];

  // 2. 상태 관리 (선택된 값)
  const [timezone, setTimezone] = useState("Asia/Seoul");
  const [planmode, setPlanMode] = useState("J");
  const [genStart, setGenStart] = useState("home");
  const [sharedRange, setSharedRange] = useState("private");
  const [date, setDate] = useState("YYYY-MM-DD");
  const [time, setTime] = useState("24");
  const [lang, setLang] = useState("ko");

  return (
    <SettingsLayout
      title="환경 설정"
      description="시간관리 모드, 시작 화면, 언어 및 지역 설정을 관리합니다."
    >
          <div className="settings-form">
            <div className="settings-section">
              <div className="settings-section-title">기본 환경 (현재: {modeLabel})</div>
              
              <div className="settings-row">
                <div className="settings-row__label">시간관리 모드</div>
                <div className="settings-row__control">
                  {/* 3. shadcn/ui Select 컴포넌트 구조 */}
                  <Select onValueChange={setPlanMode} defaultValue={planmode}>                    
                    {/* 트리거: 클릭했을 때 보이는 버튼 영역 */}
                    <SelectTrigger className="w-full bg-background border-primary">
                      <SelectValue placeholder="플랜의 기본 모드를 선택하세요" />
                    </SelectTrigger>

                    {/* 컨텐츠: 클릭 시 열리는 드롭다운 목록 */}
                    <SelectContent>
                      {planModeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>

                  </Select>
                </div>
              </div>

              <div className="settings-row">
                <div className="settings-row__label">기본 시작 화면</div>
                <div className="settings-row__control">
                  {/* 3. shadcn/ui Select 컴포넌트 구조 */}
                  <Select onValueChange={setGenStart} defaultValue={genStart}>
                    
                    {/* 트리거: 클릭했을 때 보이는 버튼 영역 */}
                    <SelectTrigger className="w-full bg-background border-primary">
                      <SelectValue placeholder="기본 시작 화면을 선택하세요" />
                    </SelectTrigger>

                    {/* 컨텐츠: 클릭 시 열리는 드롭다운 목록 */}
                    <SelectContent>
                      {genStartOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>

                  </Select>
                </div>
              </div>

              <div className="settings-row">
                <div className="settings-row__label">기본 공개 범위</div>
                <div className="settings-row__control">
                  {/* 3. shadcn/ui Select 컴포넌트 구조 */}
                  <Select onValueChange={setSharedRange} defaultValue={sharedRange}>
                    
                    {/* 트리거: 클릭했을 때 보이는 버튼 영역 */}
                    <SelectTrigger className="w-full bg-background border-primary">
                      <SelectValue placeholder="기본 공개 범위를 선택하세요" />
                    </SelectTrigger>

                    {/* 컨텐츠: 클릭 시 열리는 드롭다운 목록 */}
                    <SelectContent>
                      {sharedRangeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>

                  </Select>
                </div>
              </div>

              <div className="settings-row">
                <div className="settings-row__label">날짜 포맷</div>
                <div className="settings-row__control">
                  {/* 3. shadcn/ui Select 컴포넌트 구조 */}
                  <Select onValueChange={setDate} defaultValue={date}>
                    
                    {/* 트리거: 클릭했을 때 보이는 버튼 영역 */}
                    <SelectTrigger className="w-full bg-background border-primary">
                      <SelectValue placeholder="화면에 나올 날짜의 기본 포맷을 선택하세요" />
                    </SelectTrigger>

                    {/* 컨텐츠: 클릭 시 열리는 드롭다운 목록 */}
                    <SelectContent>
                      {dateOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>

                  </Select>
                </div>
              </div>

              <div className="settings-row">
                <div className="settings-row__label">시간 포맷</div>
                <div className="settings-row__control">
                  {/* 3. shadcn/ui Select 컴포넌트 구조 */}
                  <Select onValueChange={setTime} defaultValue={time}>
                    
                    {/* 트리거: 클릭했을 때 보이는 버튼 영역 */}
                    <SelectTrigger className="w-full bg-background border-primary">
                      <SelectValue placeholder="화면에 나올 시간의 기본 포맷을 선택하세요" />
                    </SelectTrigger>

                    {/* 컨텐츠: 클릭 시 열리는 드롭다운 목록 */}
                    <SelectContent>
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>

                  </Select>
                </div>
              </div>
            </div>

            <hr className="settings-divider" />

            <div className="settings-section">
              <h4 className="settings-section-title">지역 및 언어</h4>
              <div className="settings-row">
                <div className="settings-row__label">언어 (Language)</div>
                <div className="settings-row__control">
                  {/* 3. shadcn/ui Select 컴포넌트 구조 */}
                  <Select onValueChange={setLang} defaultValue={lang}>
                    
                    {/* 트리거: 클릭했을 때 보이는 버튼 영역 */}
                    <SelectTrigger className="w-full bg-background border-primary">
                      <SelectValue placeholder="언어를 선택하세요" />
                    </SelectTrigger>

                    {/* 컨텐츠: 클릭 시 열리는 드롭다운 목록 */}
                    <SelectContent>
                      {langOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>

                  </Select>
                </div>
              </div>
              <div className="settings-row">
                <div className="settings-row__label">타임존</div>
                <div className="settings-row__control">
                  {/* 3. shadcn/ui Select 컴포넌트 구조 */}
                  <Select onValueChange={setTimezone} defaultValue={timezone}>
                    
                    {/* 트리거: 클릭했을 때 보이는 버튼 영역 */}
                    <SelectTrigger className="w-full bg-background border-primary">
                      <SelectValue placeholder="시간대를 선택하세요" />
                    </SelectTrigger>

                    {/* 컨텐츠: 클릭 시 열리는 드롭다운 목록 */}
                    <SelectContent>
                      {timezoneOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>

                  </Select>
                </div>
              </div>
            </div>

            <div className="settings-actions-right mt-8">
              <Button type="button" variant="primary">
                환경 설정 저장
              </Button>
            </div>
          </div>
    </SettingsLayout>
  );
}

export default GeneralSettingsScreen;
