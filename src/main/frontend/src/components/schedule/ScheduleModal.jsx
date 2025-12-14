import React from "react";
import ScheduleFormModal from "../schedule/ScheduleFormModal";

// 예전 코드가 ScheduleModal(open, mode, dateKey...) 형태였다면 여기서 맞춰줄 수 있음.
// 일단 빌드 깨짐 방지용으로 최소 래핑만 제공.
export default function ScheduleModal(props) {
  const { open, onClose, mode, dateKey, initialData, onSubmit } = props;

  // dateKey -> Date 변환
  const date = (() => {
    if (!dateKey) return new Date();
    const [y, m, d] = String(dateKey).split("-").map((v) => Number(v));
    if (!y || !m || !d) return new Date();
    return new Date(y, m - 1, d);
  })();

  return (
    <ScheduleFormModal
      open={open}
      onClose={onClose}
      date={date}
      mode={mode === "simple" ? "quick" : "detail"}
      initialEvent={initialData}
      onSaved={() => {
        // 기존 코드 onSubmit 패턴을 흉내내고 싶으면 여기서 호출하면 됨.
        onSubmit?.(initialData);
      }}
    />
  );
}
