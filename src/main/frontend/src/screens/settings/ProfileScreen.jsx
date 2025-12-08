// FILE: src/main/frontend/src/components/routine/RoutineTrackerGrid.jsx
import React from "react";
import Checkbox from "../../components/common/Checkbox";

/**
 * ROUT-003: 루틴 히스토리 / 달성률 그리드용 간단한 컴포넌트
 *
 * props:
 *  - routines: [
 *      { id, name, categoryName, color, streak, days: ['월','화',...] }
 *    ]
 *  - weekDays: ['월','화','수','목','금','토','일']
 */
const DEFAULT_WEEK_DAYS = ["월", "화", "수", "목", "금", "토", "일"];

function RoutineTrackerGrid({ routines = [], weekDays = DEFAULT_WEEK_DAYS }) {
  const hasData = routines.length > 0;

  return (
    <div className="routine-grid">
      <header className="routine-grid__header">
        <h3 className="routine-grid__title">루틴 달성 현황</h3>
        <p className="routine-grid__subtitle">
          요일별 체크 상태와 연속 스트릭을 한눈에 확인할 수 있습니다.
        </p>
      </header>

      <div className="routine-grid__table-wrapper">
        <table className="routine-grid__table">
          <thead>
            <tr>
              <th>루틴</th>
              {weekDays.map((d) => (
                <th key={d}>{d}</th>
              ))}
              <th>연속 스트릭</th>
            </tr>
          </thead>
          <tbody>
            {hasData ? (
              routines.map((r) => (
                <tr key={r.id}>
                  <td className="routine-grid__routine-cell">
                    <span
                      className="routine-grid__color-dot"
                      style={{ backgroundColor: r.color || "#6366f1" }}
                    />
                    <div>
                      <div className="routine-grid__routine-name">
                        {r.name}
                      </div>
                      {r.categoryName && (
                        <div className="routine-grid__routine-category">
                          {r.categoryName}
                        </div>
                      )}
                    </div>
                  </td>
                  {weekDays.map((d) => (
                    <td key={d} className="routine-grid__check-cell">
                      <Checkbox
                        checked={r.days?.includes(d)}
                        onChange={() => {}}
                      />
                    </td>
                  ))}
                  <td className="routine-grid__streak-cell">
                    {r.streak ?? 0}일
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="routine-grid__empty"
                  colSpan={weekDays.length + 2}
                >
                  아직 등록된 루틴이 없습니다. 상단에서 루틴을 추가해 보세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RoutineTrackerGrid;
