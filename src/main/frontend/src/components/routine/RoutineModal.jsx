// src/main/frontend/src/components/routine/RoutineModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import Modal from "../common/Modal";

export default function RoutineModal({
  open,
  initialData,
  onClose,
  onSubmit,
}) {
  const isEdit = !!initialData?.id;

  const defaults = useMemo(() => {
    return {
      id: initialData?.id,
      name: initialData?.name ?? "",
      type: initialData?.type ?? "daily", // daily | weekly | monthly
      time: initialData?.time ?? "07:00",
    };
  }, [initialData]);

  const [form, setForm] = useState(defaults);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(defaults);
      setError("");
    }
  }, [open, defaults]);

  const submit = () => {
    setError("");
    if (!form.name.trim()) {
      setError("루틴 이름은 필수입니다.");
      return;
    }
    onSubmit?.({ ...form, name: form.name.trim() });
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "루틴 수정" : "새 루틴 추가"}
      onClose={onClose}
      footer={
        <div className="tb-actions">
          <button className="tb-btn" type="button" onClick={onClose}>취소</button>
          <button className="tb-btn primary" type="button" onClick={submit}>
            {isEdit ? "수정" : "저장"}
          </button>
        </div>
      }
    >
      <div className="tb-form">
        {error ? <div style={{ color: "#b42318", fontSize: 13 }}>{error}</div> : null}

        <div className="tb-field">
          <label>루틴 이름</label>
          <input
            value={form.name}
            placeholder="예) 아침 스트레칭"
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
        </div>

        <div className="tb-field">
          <label>유형</label>
          <select
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
          >
            <option value="daily">매일</option>
            <option value="weekly">주간</option>
            <option value="monthly">월간</option>
          </select>
        </div>

        <div className="tb-field">
          <label>대표 시간</label>
          <input
            value={form.time}
            onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
          />
        </div>
      </div>
    </Modal>
  );
}
