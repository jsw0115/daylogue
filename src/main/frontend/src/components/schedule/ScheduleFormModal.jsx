// src/components/schedule/ScheduleFormModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import Modal from "../common/Modal";
import { safeStorage } from "../../shared/utils/safeStorage";
import ShareUserPicker from "../common/ShareUserPicker";

function toDateKey(d) {
  const dt = d instanceof Date ? d : new Date(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function loadCategories() {
  const shared = safeStorage.getJSON("categories.shared", []);
  const personal = safeStorage.getJSON("categories.personal", []);
  return [
    ...(Array.isArray(shared) ? shared : []),
    ...(Array.isArray(personal) ? personal : []),
  ];
}

function loadEvents(dateKey) {
  const list = safeStorage.getJSON(`planner.events.${dateKey}`, []);
  return Array.isArray(list) ? list : [];
}
function saveEvents(dateKey, list) {
  safeStorage.setJSON(`planner.events.${dateKey}`, list);
}

export default function ScheduleFormModal({
  open,
  onClose,
  date = new Date(),
  initialEvent = null,
  mode = "detail", // quick | detail
  onSaved,
}) {
  const dateKey = useMemo(() => toDateKey(date), [date]);
  const categories = useMemo(() => loadCategories(), []);

  const [title, setTitle] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [memo, setMemo] = useState("");
  const [sharedUserIds, setSharedUserIds] = useState([]);

  // open/initialEvent/dateKey 변경 시 폼 동기화 (수정 안정화)
  useEffect(() => {
    if (!open) return;

    setTitle(initialEvent?.title || "");
    setStart(initialEvent?.start || "09:00");
    setEnd(initialEvent?.end || "10:00");
    setCategoryId(initialEvent?.categoryId || categories[0]?.id || "");
    setMemo(initialEvent?.memo || "");
    setSharedUserIds(Array.isArray(initialEvent?.sharedUserIds) ? initialEvent.sharedUserIds : []);
  }, [open, initialEvent, dateKey, categories]);

  const close = () => onClose?.();

  const save = () => {
    const t = title.trim();
    if (!t) return;

    const list = loadEvents(dateKey);
    const next = [...list];

    const payload = {
      title: t,
      start,
      end,
      categoryId,
      memo: mode === "quick" ? "" : memo,
      sharedUserIds,
      updatedAt: Date.now(),
    };

    if (initialEvent?.id) {
      const idx = next.findIndex((e) => e.id === initialEvent.id);
      const updated = { ...initialEvent, ...payload };
      if (idx >= 0) next[idx] = updated;
      else next.unshift(updated);
    } else {
      next.unshift({
        id: `ev-${Date.now()}`,
        createdAt: Date.now(),
        ...payload,
      });
    }

    saveEvents(dateKey, next);
    onSaved?.();
    close();
  };

  return (
    <Modal
      open={open}
      title={initialEvent ? "일정 수정" : "일정 등록"}
      onClose={close}
      width={mode === "quick" ? 560 : 760}
      footer={
        <div className="tb-modal__actions">
          <button type="button" className="btn btn--sm btn--ghost" onClick={close}>
            취소
          </button>
          <button type="button" className="btn btn--sm btn--primary" onClick={save}>
            저장
          </button>
        </div>
      }
    >
      <div className="tb-form">
        <label className="tb-label">제목</label>
        <input
          className="field-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예) 프로젝트 회의"
        />

        <div className="tb-grid2">
          <div>
            <label className="tb-label">시작</label>
            <input className="field-input" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <label className="tb-label">종료</label>
            <input className="field-input" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>

        <label className="tb-label">카테고리</label>
        <select className="field-input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label className="tb-label">공유 대상 사용자</label>
        <ShareUserPicker value={sharedUserIds} onChange={setSharedUserIds} />

        {mode !== "quick" ? (
          <>
            <label className="tb-label">메모</label>
            <textarea className="field-input" rows={5} value={memo} onChange={(e) => setMemo(e.target.value)} />
          </>
        ) : null}
      </div>
    </Modal>
  );
}
