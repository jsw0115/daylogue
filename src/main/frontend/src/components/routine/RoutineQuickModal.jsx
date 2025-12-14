// FILE: (프로젝트에서 "새 루틴 추가" 모달 컴포넌트 파일을 이 코드로 전체 교체)
// 예시 파일명: src/components/routine/RoutineQuickModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const TYPE_OPTIONS = [
  { value: "daily", label: "매일" },
  { value: "weekly", label: "주간" },
];

function useInitialSnapshot(open, initial) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    ref.current = initial;
  }, [open, initial]);

  return ref;
}

export default function RoutineQuickModal({
  open,
  onClose,
  onSave, // (payload) => void  // 기존 코드에서 저장 핸들러 이름이 다르면, 여기만 맞춰줘
  initialValue, // { name, type, time } (선택)
  title = "새 루틴 추가",
}) {
  const isBrowser = typeof document !== "undefined";

  const initial = useMemo(() => {
    return {
      name: initialValue?.name ?? "",
      type: initialValue?.type ?? "daily",
      time: initialValue?.time ?? "07:00",
    };
  }, [initialValue]);

  const initialRef = useInitialSnapshot(open, initial);

  const [name, setName] = useState(initial.name);
  const [type, setType] = useState(initial.type);
  const [time, setTime] = useState(initial.time);

  const nameRef = useRef(null);

  // open 될 때 값 세팅 + 포커스
  useEffect(() => {
    if (!open) return;
    setName(initial.name);
    setType(initial.type);
    setTime(initial.time);

    // 다음 틱에 포커스
    const t = setTimeout(() => nameRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open, initial]);

  const trimmedName = name.trim();

  const dirty = useMemo(() => {
    const snap = initialRef.current || initial;
    return (
      (snap.name ?? "") !== name ||
      (snap.type ?? "daily") !== type ||
      (snap.time ?? "07:00") !== time
    );
  }, [name, type, time, initial, initialRef]);

  const canSave = trimmedName.length > 0 && dirty;

  // ESC 닫기
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSave) return;

    const payload = {
      name: trimmedName,
      type,
      time,
    };

    onSave?.(payload);
  };

  if (!open || !isBrowser) return null;

  return createPortal(
    <>
      <style>{`
        .rqm-overlay{
          position:fixed; inset:0;
          background: rgba(0,0,0,.35);
          display:flex;
          align-items:center;
          justify-content:center;
          padding: 24px;
          z-index: 9999;
        }

        .rqm-dialog{
          width: min(560px, 92vw);
          background:#fff;
          border-radius: 14px;
          box-shadow: 0 20px 60px rgba(0,0,0,.20);
          overflow:hidden;
        }

        .rqm-header{
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(0,0,0,.06);
        }

        .rqm-title{
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.2px;
        }

        .rqm-close{
          width: 32px; height: 32px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,.08);
          background: #fff;
          cursor: pointer;
        }
        .rqm-close:hover{ background: rgba(0,0,0,.03); }

        .rqm-body{
          padding: 16px;
        }

        .rqm-grid{
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .rqm-row2{
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 520px){
          .rqm-row2{ grid-template-columns: 1fr; }
        }

        .rqm-fieldLabel{
          display:block;
          font-size: 12px;
          color: rgba(0,0,0,.65);
          margin-bottom: 6px;
          letter-spacing: -0.2px;
        }

        .rqm-control{
          width: 100%;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,.10);
          padding: 0 12px;
          font-size: 13px;
          outline: none;
          background: #fff;
        }
        .rqm-control:focus{
          border-color: rgba(99,102,241,.55);
          box-shadow: 0 0 0 4px rgba(99,102,241,.14);
        }

        .rqm-hint{
          font-size: 12px;
          color: rgba(0,0,0,.45);
          margin-top: 10px;
        }

        .rqm-footer{
          display:flex;
          justify-content:flex-end;
          gap: 8px;
          padding: 12px 16px;
          border-top: 1px solid rgba(0,0,0,.06);
          background: rgba(0,0,0,.01);
        }

        /* 버튼이 프로젝트 전역 .btn 스타일을 쓰는 경우가 많아서,
           없을 때도 최소한 보기 괜찮게 로컬 스타일 제공 */
        .rqm-btn{
          height: 34px;
          padding: 0 12px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,.10);
          background: #fff;
          cursor: pointer;
          font-size: 12.5px;
        }
        .rqm-btn:hover{ background: rgba(0,0,0,.03); }

        .rqm-btnPrimary{
          border-color: rgba(99,102,241,.35);
          background: rgba(99,102,241,.12);
        }
        .rqm-btnPrimary:hover{ background: rgba(99,102,241,.16); }

        .rqm-btn:disabled{
          opacity: .45;
          cursor: not-allowed;
        }
      `}</style>

      <div
        className="rqm-overlay"
        role="presentation"
        onMouseDown={(e) => {
          // overlay 클릭으로 닫기 (dialog 내부 클릭은 제외)
          if (e.target === e.currentTarget) onClose?.();
        }}
      >
        <div
          className="rqm-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="rqm-header">
            <div className="rqm-title">{title}</div>
            <button type="button" className="rqm-close" onClick={onClose} aria-label="닫기">
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="rqm-body">
              <div className="rqm-grid">
                <div>
                  <label className="rqm-fieldLabel">루틴 이름</label>
                  <input
                    ref={nameRef}
                    className="rqm-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예) 아침 스트레칭"
                    maxLength={60}
                  />
                </div>

                <div className="rqm-row2">
                  <div>
                    <label className="rqm-fieldLabel">유형</label>
                    <select
                      className="rqm-control"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      {TYPE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="rqm-fieldLabel">대표 시간</label>
                    <input
                      className="rqm-control"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rqm-hint">
                  저장 버튼은 값이 변경되었을 때만 활성화됩니다.
                </div>
              </div>
            </div>

            <div className="rqm-footer">
              <button type="button" className="rqm-btn" onClick={onClose}>
                취소
              </button>
              <button type="submit" className="rqm-btn rqm-btnPrimary" disabled={!canSave}>
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
}
