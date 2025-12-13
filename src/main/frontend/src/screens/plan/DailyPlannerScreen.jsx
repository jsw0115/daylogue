import React, { useMemo, useState } from "react";
import "../../styles/screens/dailyPlanner.css";
import { safeStorage } from "../../shared/utils/safeStorage";

export default function DailyPlannerScreen() {
  const today = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  const [text, setText] = useState(() => safeStorage.getItem("daily.memo." + today, ""));

  const save = () => safeStorage.setItem("daily.memo." + today, text);

  return (
    <div className="screen dailyPlanner">
      <div className="dailyPlanner__head">
        <div>
          <h1 className="screen-header__title">일간 플래너</h1>
          <div className="text-muted font-small">{today}</div>
        </div>

        <div className="dailyPlanner__actions">
          <button className="btn btn--sm btn--primary" type="button">일정 추가</button>
          <button className="btn btn--sm" type="button">루틴 추가</button>
          <button className="btn btn--sm" type="button">오늘</button>
        </div>
      </div>

      <div className="dailyPlanner__grid">
        <div className="card">
          <div className="card__title">Daily Todo</div>
          <div className="text-muted font-small">TODO: /api/tasks?date=...</div>
        </div>

        <div className="card">
          <div className="card__title">Daily Memo</div>
          <textarea
            className="field__input"
            rows={10}
            value={text}
            placeholder="오늘 하루를 기록하세요..."
            onChange={(e) => setText(e.target.value)}
            onBlur={save}
          />
          <div className="text-muted font-small" style={{ marginTop: 8 }}>
            입력 내용은 임시 저장소에 저장됩니다(나중에 API로 교체).
          </div>
        </div>

        <div className="card">
          <div className="card__title">Routine</div>
          <div className="text-muted font-small">TODO: /api/routines/today</div>
        </div>
      </div>
    </div>
  );
}
