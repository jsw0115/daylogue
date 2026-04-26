import React from "react";
import { Checkbox } from "../ui/checkbox";

export default function RepeatSelector({ repeatConfig, onChange }) {
  const { isRepeat, repeatType, repeatDays = [] } = repeatConfig;

  const daysOfWeek = [
    { id: "MON", label: "월" },
    { id: "TUE", label: "화" },
    { id: "WED", label: "수" },
    { id: "THU", label: "목" },
    { id: "FRI", label: "금" },
    { id: "SAT", label: "토" },
    { id: "SUN", label: "일" },
  ];

  const handleDayToggle = (dayId) => {
    const updatedDays = repeatDays.includes(dayId)
      ? repeatDays.filter((d) => d !== dayId)
      : [...repeatDays, dayId];
    onChange({ ...repeatConfig, repeatDays: updatedDays });
  };

  return (
    <div className="repeat-ui-container">
      <div className="flex items-center gap-2 mb-3">
        <Checkbox 
          id="repeat-toggle"
          checked={isRepeat}
          onCheckedChange={(checked) => onChange({ ...repeatConfig, isRepeat: checked })}
        />
        <label htmlFor="repeat-toggle" className="font-semibold text-sm">이 작업 반복하기</label>
      </div>

      {isRepeat && (
        <div className="flex flex-col gap-3 mt-2">
          <select 
            className="field__control"
            value={repeatType}
            onChange={(e) => onChange({ ...repeatConfig, repeatType: e.target.value })}
          >
            <option value="DAILY">매일</option>
            <option value="WEEKLY">매주 특정 요일</option>
            <option value="MONTHLY">매월</option>
          </select>

          {repeatType === "WEEKLY" && (
            <div className="flex gap-2 mt-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  className={`task-chip ${repeatDays.includes(day.id) ? "task-chip--active" : ""}`}
                  onClick={() => handleDayToggle(day.id)}
                >
                  {day.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}