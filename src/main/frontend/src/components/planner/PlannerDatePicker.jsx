import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PlannerDatePicker from "../../components/planner/PlannerDatePicker";

/**
 * PLAN 상단에서 사용하는 날짜 선택기
 * - 캘린더 아이콘 버튼 + 작은 모달 내부에 <input type="date">
 * - 현재 URL (/planner/daily, /planner/weekly, /planner/monthly, /planner/yearly)에 따라
 *   해당 뷰로 선택한 날짜를 쿼리스트링으로 넘김
 */
const PlannerDatePicker = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const handleConfirm = () => {
    const basePath = (() => {
      if (location.pathname.includes("/planner/daily")) return "/planner/daily";
      if (location.pathname.includes("/planner/weekly")) return "/planner/weekly";
      if (location.pathname.includes("/planner/monthly"))
        return "/planner/monthly";
      if (location.pathname.includes("/planner/yearly")) return "/planner/yearly";
      // 기본값은 daily
      return "/planner/daily";
    })();

    navigate(`${basePath}?date=${date}`);
    setOpen(false);
  };

  return (
    <div className="screen daily-planner-screen">
      <div className="screen-header">
        <div>
          <h1 className="screen-header__title">일간 플래너</h1>
        </div>

        <div className="screen-header__actions">

        </div>

        <>
        <button
            type="button"
            className="btn btn--ghost btn--sm planner-datepicker-button"
            onClick={() => setOpen(true)}
            title="날짜 선택"
        >
            <span className="material-icons-outlined" style={{ fontSize: 18 }}>
            calendar_month
            </span>
        </button>

        {open && (
            <div
            className="planner-datepicker-backdrop"
            onClick={() => setOpen(false)}
            >
                <div
                    className="planner-datepicker-modal"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h4 className="planner-datepicker-title">날짜 선택</h4>
                    <input
                    type="date"
                    className="form-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    />
                        <div className="planner-datepicker-actions">
                        <button
                            type="button"
                            className="btn btn--ghost btn--sm"
                            onClick={() => setOpen(false)}
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            className="btn btn--primary btn--sm"
                            onClick={handleConfirm}
                        >
                            이동
                        </button>
                        
                        {/* 기존 <, > 버튼 옆에 캘린더 아이콘 추가 */}
                        {/* ... 기존 날짜 이동 버튼들 ... */}
                        <PlannerDatePicker />
                    </div>
                </div>
            </div>
        )}
        </>
        </div>
    </div>
  );
};

export default PlannerDatePicker;
