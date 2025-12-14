// src/screens/home/portlets/TodayMemoPortlet.jsx
import React, { useEffect, useState } from "react";
import safeStorage from "../../../shared/utils/safeStorage";

export default function TodayMemoPortlet() {
  const [memo, setMemo] = useState(() => safeStorage.get("tbd.todayMemo", ""));

  useEffect(() => {
    // ✅ useEffect는 "함수" 또는 "아무것도"만 return 해야 함.
    // ❌ return false; 같은 패턴은 StrictMode에서 언마운트 시 cleanup 호출하면서 터짐.
    // 여기서는 cleanup이 딱히 없으니 return 자체를 하지 않음.
    return undefined;
  }, []);

  useEffect(() => {
    safeStorage.set("tbd.todayMemo", memo ?? "");
  }, [memo]);

  return (
    <div className="portlet">
      <div className="portlet-subtitle">오늘의 메모</div>
      <textarea
        className="portlet-textarea"
        rows={6}
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="오늘의 기록/메모를 남겨보세요."
      />
    </div>
  );
}
