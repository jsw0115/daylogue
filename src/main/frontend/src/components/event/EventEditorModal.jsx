// src/components/event/EventEditorModal.jsx
import React, { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

import Modal from "../common/Modal";
import SharedUsersEditor from "./SharedUsersEditor";
import { safeStorage } from "../../shared/utils/safeStorage";
import "../../styles/components/shareEditor.css";

moment.locale("ko");

function toUTCISOString(localDate, timeZone) {
  // MVP: 프론트에서 timezone 변환까지 완벽 처리하려면 date-fns-tz 등 필요.
  // 지금 단계에선 "서버가 timeZone 기준으로 UTC 저장"을 권장.
  // 즉, 여기서는 로컬 Date를 ISO로 넘기고, 서버가 timeZone으로 해석 후 UTC로 저장.
  return localDate.toISOString();
}

export default function EventEditorModal({
  open,
  onClose,
  initialEvent = null, // null이면 create
  onSubmit, // async (payload) => void
}) {
  const sessionUser = safeStorage.getJSON("session.user", { id: 1, roles: [] });

  const [title, setTitle] = useState(initialEvent?.title || "");
  const [allDay, setAllDay] = useState(!!initialEvent?.allDay);
  const [timeZone, setTimeZone] = useState(initialEvent?.timeZone || "Asia/Seoul");

  const [startAt, setStartAt] = useState(
    initialEvent?.startAt ? new Date(initialEvent.startAt) : new Date()
  );
  const [endAt, setEndAt] = useState(
    initialEvent?.endAt ? new Date(initialEvent.endAt) : moment().add(1, "hour").toDate()
  );

  const ownerUserId = initialEvent?.ownerUserId ?? sessionUser.id;

  const sharedUsers0 = initialEvent?.sharedUsers || [];
  const [sharedUsers, setSharedUsers] = useState(sharedUsers0);

  // 내 역할/유효 스코프 계산 (MVP 프론트 계산)
  const myMembership = useMemo(() => {
    if (String(sessionUser.id) === String(ownerUserId)) {
      return { role: "owner", effectiveEditScope: "all", effectiveDeleteScope: "all" };
    }
    const found = sharedUsers.find((s) => String(s.userId) === String(sessionUser.id));
    if (!found) return { role: "viewer", effectiveEditScope: "none", effectiveDeleteScope: "none" };

    // editor max는 future로 고정(너가 확정)
    const maxEditorEditScope = "future";
    const maxEditorDeleteScope = "future";

    const role = found.role || "viewer";
    const effectiveEditScope = role === "viewer" ? "none" : (found.editScope || "single");
    const effectiveDeleteScope = role === "viewer" ? "none" : (found.deleteScope || "single");

    // 상한 적용
    const clamp = (v, maxV) => {
      const order = ["none", "single", "future", "all"];
      const r = order.indexOf(v);
      const m = order.indexOf(maxV);
      return order[Math.min(Math.max(r, 0), m)];
    };

    return {
      role,
      effectiveEditScope: clamp(effectiveEditScope, maxEditorEditScope),
      effectiveDeleteScope: clamp(effectiveDeleteScope, maxEditorDeleteScope),
    };
  }, [sessionUser.id, ownerUserId, sharedUsers]);

  const save = async () => {
    const t = title.trim();
    if (!t) return;

    // endAt >= startAt 보정
    let e = endAt;
    if (moment(e).isSameOrBefore(startAt)) {
      e = moment(startAt).add(30, "minute").toDate();
      setEndAt(e);
    }

    const payload = {
      id: initialEvent?.id,
      ownerUserId,
      title: t,
      allDay,
      timeZone,
      startAt: toUTCISOString(startAt, timeZone),
      endAt: toUTCISOString(e, timeZone),
      sharedUsers,
    };

    await onSubmit?.(payload);
    onClose?.();
  };

  return (
    <Modal
      open={open}
      title={initialEvent ? "일정 수정" : "일정 등록"}
      onClose={onClose}
      width={860}
      footer={
        <div className="tb-modal__actions">
          <button type="button" className="btn btn--sm btn--ghost" onClick={onClose}>
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
        <input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label className="tb-label">시작</label>
            <DatePicker
              selected={startAt}
              onChange={(d) => d && setStartAt(d)}
              showTimeSelect
              timeIntervals={10}
              dateFormat="yyyy-MM-dd HH:mm"
              className="field-input"
            />
          </div>
          <div>
            <label className="tb-label">종료</label>
            <DatePicker
              selected={endAt}
              onChange={(d) => d && setEndAt(d)}
              showTimeSelect
              timeIntervals={10}
              dateFormat="yyyy-MM-dd HH:mm"
              className="field-input"
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div>
            <label className="tb-label">timeZone</label>
            <input className="field-input" value={timeZone} onChange={(e) => setTimeZone(e.target.value)} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
              <span className="text-muted font-small">종일</span>
            </label>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <SharedUsersEditor
            ownerUserId={ownerUserId}
            myUserId={sessionUser.id}
            myRole={myMembership.role}
            myEffectiveEditScope={myMembership.effectiveEditScope}
            myEffectiveDeleteScope={myMembership.effectiveDeleteScope}
            sharedUsers={sharedUsers}
            onChange={setSharedUsers}
          />
        </div>
      </div>
    </Modal>
  );
}
