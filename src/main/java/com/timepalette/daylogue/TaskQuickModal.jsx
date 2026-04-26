import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import RepeatSelector from "../../styles/screens/RepeatSelector";
import TaskMemberSelector from "../../styles/screens/TaskMemberSelector";

function useInitialSnapshot(open, initial) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    ref.current = initial;
  }, [open, initial]);

  return ref;
}

export default function TaskQuickModal({
  open,
  onClose,
  onSave,
  initialValue, // { name, members, repeatConfig } (선택)
  title = "새 할 일 추가",
}) {
  const isBrowser = typeof document !== "undefined";

  const initial = useMemo(() => {
    return {
      name: initialValue?.name ?? "",
      members: initialValue?.members ?? [],
      repeatConfig: initialValue?.repeatConfig ?? { isRepeat: false, repeatType: "DAILY", repeatDays: [] },
    };
  }, [initialValue]);

  const initialRef = useInitialSnapshot(open, initial);

  const [name, setName] = useState(initial.name);
  const [members, setMembers] = useState(initial.members);
  const [repeatConfig, setRepeatConfig] = useState(initial.repeatConfig);

  const nameRef = useRef(null);

  // 모달이 열릴 때 초기값 세팅 및 포커스
  useEffect(() => {
    if (!open) return;
    setName(initial.name);
    setMembers(initial.members);
    setRepeatConfig(initial.repeatConfig);

    const t = setTimeout(() => nameRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open, initial]);

  const trimmedName = name.trim();

  // 변경 사항이 있는지 확인
  const dirty = useMemo(() => {
    const snap = initialRef.current || initial;
    return (
      (snap.name ?? "") !== name ||
      JSON.stringify(snap.members) !== JSON.stringify(members) ||
      JSON.stringify(snap.repeatConfig) !== JSON.stringify(repeatConfig)
    );
  }, [name, members, repeatConfig, initial, initialRef]);

  const canSave = trimmedName.length > 0 && dirty;

  // ESC 키로 닫기
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
      members,
      repeatConfig,
    };

    onSave?.(payload);
  };

  if (!open || !isBrowser) return null;

  return createPortal(
    <>
      <style>{`
        .tqm-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.35);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 9999;
        }
        .tqm-dialog {
          width: min(560px, 92vw);
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 20px 60px rgba(0,0,0,.20);
          overflow: hidden;
        }
        .tqm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(0,0,0,.06);
        }
        .tqm-title {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.2px;
        }
        .tqm-close {
          width: 32px; height: 32px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,.08);
          background: #fff;
          cursor: pointer;
        }
        .tqm-close:hover { background: rgba(0,0,0,.03); }
        .tqm-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .tqm-fieldLabel {
          display: block;
          font-size: 12px;
          color: rgba(0,0,0,.65);
          margin-bottom: 6px;
          letter-spacing: -0.2px;
        }
        .tqm-control {
          width: 100%; height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,.10);
          padding: 0 12px;
          font-size: 13px;
          outline: none;
          background: #fff;
        }
        .tqm-control:focus {
          border-color: rgba(99,102,241,.55);
          box-shadow: 0 0 0 4px rgba(99,102,241,.14);
        }
        .tqm-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding: 12px 16px;
          border-top: 1px solid rgba(0,0,0,.06);
          background: rgba(0,0,0,.01);
        }
        .tqm-btn {
          height: 34px; padding: 0 12px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,.10);
          background: #fff;
          cursor: pointer;
          font-size: 12.5px;
        }
        .tqm-btn:hover { background: rgba(0,0,0,.03); }
        .tqm-btnPrimary {
          border-color: rgba(99,102,241,.35);
          background: rgba(99,102,241,.12);
        }
        .tqm-btnPrimary:hover { background: rgba(99,102,241,.16); }
        .tqm-btn:disabled { opacity: .45; cursor: not-allowed; }
      `}</style>

      <div className="tqm-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
        <div className="tqm-dialog" role="dialog" aria-modal="true" aria-label={title}>
          <div className="tqm-header">
            <div className="tqm-title">{title}</div>
            <button type="button" className="tqm-close" onClick={onClose} aria-label="닫기">×</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="tqm-body">
              <div>
                <label className="tqm-fieldLabel">할 일 이름</label>
                <input
                  ref={nameRef}
                  className="tqm-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예) 기획서 작성하기"
                  maxLength={60}
                />
              </div>

              {/* 1. 멤버 선택 컴포넌트 추가 */}
              <div>
                <TaskMemberSelector selectedMembers={members} onChange={setMembers} />
              </div>

              {/* 2. 반복 설정 컴포넌트 추가 */}
              <div>
                <RepeatSelector repeatConfig={repeatConfig} onChange={setRepeatConfig} />
              </div>
            </div>

            <div className="tqm-footer">
              <button type="button" className="tqm-btn" onClick={onClose}>취소</button>
              <button type="submit" className="tqm-btn tqm-btnPrimary" disabled={!canSave}>저장</button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
}