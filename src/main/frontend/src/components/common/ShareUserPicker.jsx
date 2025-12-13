// src/components/common/ShareUserPicker.jsx
import React, { useMemo } from "react";
import "../../styles/components/shareUserPicker.css";
import { useShareUsers } from "../../shared/hooks/useShareUsers";

export default function ShareUserPicker({ value = [], onChange }) {
  const { users, byId } = useShareUsers();

  const selected = useMemo(
    () => value.map((id) => byId.get(id)).filter(Boolean),
    [value, byId],
  );

  const toggle = (id) => {
    const has = value.includes(id);
    const next = has ? value.filter((x) => x !== id) : [...value, id];
    onChange?.(next);
  };

  return (
    <div className="share-picker">
      <div className="share-picker__selected">
        {selected.length ? (
          selected.map((u) => (
            <span key={u.id} className="share-chip">
              {u.name}
              <span className="share-chip__email">{u.email ? ` · ${u.email}` : ""}</span>
            </span>
          ))
        ) : (
          <div className="text-muted font-small">공유 대상 없음</div>
        )}
      </div>

      <div className="share-picker__list">
        {users.length ? (
          users.map((u) => (
            <button
              key={u.id}
              type="button"
              className={"share-row " + (value.includes(u.id) ? "is-active" : "")}
              onClick={() => toggle(u.id)}
            >
              <div className="share-row__name">{u.name}</div>
              <div className="share-row__email">{u.email || ""}</div>
            </button>
          ))
        ) : (
          <div className="text-muted font-small">
            설정에서 공유할 사용자 목록을 먼저 추가하세요.
          </div>
        )}
      </div>
    </div>
  );
}
