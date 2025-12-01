// FILE: src/main/frontend/src/shared/components/ModeSwitch.jsx
import React from "react";
import { APP_MODES, useAppMode } from "../context/AppModeContext";

const MODE_LABELS = {
  [APP_MODES.J]: "J 모드",
  [APP_MODES.P]: "P 모드",
  [APP_MODES.B]: "밸런스",
};

/**
 * 헤더/상단에서 J / P / B 모드를 전환하는 스위치
 * - context(AppModeContext)에 전역 모드 저장
 * - 버튼 클릭 시 mode 업데이트
 */
export default function ModeSwitch() {
  const { mode, setMode } = useAppMode();

  return (
    <div className="mode-switch" aria-label="플래너 모드 전환">
      {Object.values(APP_MODES).map((value) => (
        <button
          key={value}
          type="button"
          className={
            "mode-switch__item" +
            (mode === value ? " mode-switch__item--active" : "")
          }
          onClick={() => setMode(value)}
        >
          {MODE_LABELS[value]}
        </button>
      ))}
    </div>
  );
}
