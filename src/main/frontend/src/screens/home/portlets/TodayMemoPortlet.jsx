import React, { useEffect, useState } from "react";
import storage from "../../../shared/utils/safeStorage";

const KEY_MEMO = "timebar.memo.today.v1";
const KEY_QUOTE = "timebar.quote.today.v1";

export default function TodayMemoPortlet() {
  const [memo, setMemo] = useState("");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const m = storage.getItem(KEY_MEMO);
    const q = storage.getItem(KEY_QUOTE);
    if (m) setMemo(m);
    if (q) setQuote(q);
  }, []);

  useEffect(() => {
    storage.setItem(KEY_MEMO, memo);
  }, [memo]);

  useEffect(() => {
    storage.setItem(KEY_QUOTE, quote);
  }, [quote]);

  return (
    <div className="today-memo">
      <div className="field">
        <div className="label">오늘 나의 메모</div>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="오늘의 생각/배운 점을 적어보세요."
          rows={6}
        />
      </div>

      <div className="field">
        <div className="label">오늘 나의 좌우명</div>
        <input
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="예) 꾸준함은 재능을 이긴다."
        />
      </div>
    </div>
  );
}
