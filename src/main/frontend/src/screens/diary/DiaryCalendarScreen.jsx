import React, { useMemo, useState } from "react";
import PageContainer from "../../layout/PageContainer";
import Button from "../../components/common/Button";
import DatePicker from "../../components/common/DatePicker";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// 선택한 달 기준 6×7 캘린더 그리드 생성
function buildMonthMatrix(baseDate) {
  const year = baseDate.getFullYear();
  const monthIndex = baseDate.getMonth(); // 0~11
  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = firstDay.getDay(); // 0=일
  const startDate = new Date(year, monthIndex, 1 - startOffset);

  const cells = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateKey = d.toISOString().slice(0, 10);
    cells.push({
      dateKey,
      day: d.getDate(),
      isCurrentMonth: d.getMonth() === monthIndex,
      weekday: d.getDay(),
    });
  }
  return cells;
}

// 데모용 샘플 데이터
const SAMPLE_DIARY = {
  "2025-12-01": {
    mood: "😊",
    title: "월요일, 계획대로 잘 흘러간 하루",
  },
  "2025-12-03": {
    mood: "😵",
    title: "회의와 일정이 너무 많았던 날",
  },
  "2025-12-06": {
    mood: "✨",
    title: "타임바 다이어리 설계 정리 완료!",
  },
};

function DiaryCalendarScreen() {
  const todayKey = new Date().toISOString().slice(0, 10);
  const [monthValue, setMonthValue] = useState(todayKey.slice(0, 7) + "-01");
  const [selectedDate, setSelectedDate] = useState(todayKey);

  const baseDate = useMemo(
    () => new Date(monthValue + "T00:00:00"),
    [monthValue]
  );

  const monthCells = useMemo(
    () => buildMonthMatrix(baseDate),
    [baseDate]
  );

  const selectedEntry = SAMPLE_DIARY[selectedDate];

  const subtitle =
    "일기 작성 여부를 캘린더와 목록으로 보고, 일간 다이어리 화면으로 이동합니다.";

  return (
    <PageContainer
      screenId="DIARY-001"
      title="일간 다이어리 캘린더"
      subtitle={subtitle}
    >
      <div className="screen diary-calendar-screen">
        <div className="diary-calendar-header">
          <DatePicker
            label="월 선택"
            value={monthValue}
            onChange={(value) => {
              // YYYY-MM-DD 기준으로 들어오므로 1일로 고정
              const base = value ? `${value.slice(0, 7)}-01` : monthValue;
              setMonthValue(base);
            }}
          />
          <div className="diary-calendar-header__actions">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                const now = new Date();
                const key = now.toISOString().slice(0, 10);
                setMonthValue(key.slice(0, 7) + "-01");
                setSelectedDate(key);
              }}
            >
              오늘로 이동
            </Button>
          </div>
        </div>

        <div className="diary-calendar-layout">
          {/* 좌측: 캘린더 */}
          <section className="diary-calendar-panel">
            <header className="diary-calendar-panel__header">
              <h3>이번 달 일기 캘린더</h3>
              <p className="diary-calendar-panel__description">
                ● 표시된 날짜는 일기가 작성된 날입니다.
              </p>
            </header>

            <div className="diary-calendar-grid">
              <div className="diary-calendar-grid__weekday-row">
                {WEEKDAYS.map((w) => (
                  <div
                    key={w}
                    className="diary-calendar-grid__weekday-cell"
                  >
                    {w}
                  </div>
                ))}
              </div>
              <div className="diary-calendar-grid__body">
                {monthCells.map((cell) => {
                  const hasDiary = !!SAMPLE_DIARY[cell.dateKey];
                  const isSelected = cell.dateKey === selectedDate;
                  const cellClassNames = [
                    "diary-calendar-grid__day-cell",
                    !cell.isCurrentMonth &&
                      "diary-calendar-grid__day-cell--outside",
                    hasDiary && "diary-calendar-grid__day-cell--has-diary",
                    isSelected && "diary-calendar-grid__day-cell--selected",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <button
                      key={cell.dateKey}
                      type="button"
                      className={cellClassNames}
                      onClick={() => setSelectedDate(cell.dateKey)}
                    >
                      <span className="diary-calendar-grid__day-number">
                        {cell.day}
                      </span>
                      {hasDiary && (
                        <span className="diary-calendar-grid__dot" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 우측: 선택한 날짜 일기 목록 */}
          <section className="diary-calendar-detail-panel">
            <header className="diary-calendar-detail__header">
              <h3>선택한 날짜</h3>
              <p className="diary-calendar-detail__date">
                {selectedDate}의 기록
              </p>
            </header>

            {selectedEntry ? (
              <article className="diary-calendar-entry-card">
                <div className="diary-calendar-entry-card__meta">
                  <span className="diary-calendar-entry-card__mood">
                    {selectedEntry.mood}
                  </span>
                  <span className="diary-calendar-entry-card__label">
                    작성 완료
                  </span>
                </div>
                <h4 className="diary-calendar-entry-card__title">
                  {selectedEntry.title}
                </h4>
                <p className="diary-calendar-entry-card__hint">
                  자세한 회고는{" "}
                  <strong>DIARY-002 일간 다이어리 / 회고</strong> 화면에서
                  확인할 수 있습니다.
                </p>
                <div className="diary-calendar-entry-card__actions">
                  <Button type="button" size="sm" variant="primary">
                    이 날짜 다이어리 열기
                  </Button>
                  <Button type="button" size="sm" variant="ghost">
                    오늘 플래너로 이동
                  </Button>
                </div>
              </article>
            ) : (
              <div className="diary-calendar-empty">
                <p>아직 이 날에는 작성된 일기가 없습니다.</p>
                <Button type="button" size="sm" variant="primary">
                  이 날짜에 새 일기 쓰기
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </PageContainer>
  );
}

export default DiaryCalendarScreen;
