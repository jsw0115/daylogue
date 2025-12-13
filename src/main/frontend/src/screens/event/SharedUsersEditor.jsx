// src/components/event/SharedUsersEditor.jsx
import React, { useEffect, useMemo, useState } from "react";
import { safeStorage } from "../../shared/utils/safeStorage";
import {
  clampRole,
  clampScope,
  isUpgradeRole,
  isUpgradeScope,
  minScope,
} from "../../shared/utils/permissionScopes";

// 서버 붙기 전 임시 검색 (실서비스: /api/users/search?q=... 로 교체)
async function searchUsersApi(q) {
  try {
    const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}&limit=10`, {
      headers: { Authorization: `Bearer ${safeStorage.getJSON("session.accessToken", "")}` },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.users || json?.users || [];
  } catch (e) {
    // fallback: 데모
    return [
      { id: 101, nickname: "user101", email: "user101@example.com" },
      { id: 102, nickname: "user102", email: "user102@example.com" },
    ].filter((u) => `${u.nickname} ${u.email}`.toLowerCase().includes(String(q).toLowerCase()));
  }
}

/**
 * props
 * - ownerUserId (number|string)
 * - myUserId (number|string)
 * - myRole: "owner"|"editor"|"viewer"
 * - myEffectiveEditScope: "none|single|future|all" (editor 상한은 future로 고정)
 * - myEffectiveDeleteScope: "none|single|future|all" (editor 상한은 future로 고정)
 * - sharedUsers: [{ userId, role:"viewer|editor", editScope, deleteScope }]
 * - onChange(nextSharedUsers)
 */
export default function SharedUsersEditor({
  ownerUserId,
  myUserId,
  myRole,
  myEffectiveEditScope,
  myEffectiveDeleteScope,
  sharedUsers,
  onChange,
}) {
  const isOwner = myRole === "owner";
  const isEditor = myRole === "editor";

  // editor는 초대/상향만 가능 + 삭제 불가 + 하향 불가
  // + "자기보다 높은 권한 부여" 차단(요청값을 클램프)
  const grantMaxRole = isOwner ? "editor" : "editor"; // owner 부여 금지, 최대 editor
  const grantMaxEditScope = isOwner ? "all" : myEffectiveEditScope; // editor는 자기 유효 권한 이하
  const grantMaxDeleteScope = isOwner ? "all" : myEffectiveDeleteScope;

  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const existingIds = useMemo(() => new Set(sharedUsers.map((s) => String(s.userId))), [sharedUsers]);

  useEffect(() => {
    let alive = true;
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchUsersApi(q.trim()).then((list) => {
      if (!alive) return;
      // owner/본인 제외, 이미 추가된 사용자 제외
      const filtered = list
        .filter((u) => String(u.id) !== String(ownerUserId))
        .filter((u) => String(u.id) !== String(myUserId))
        .filter((u) => !existingIds.has(String(u.id)));
      setResults(filtered);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [q, ownerUserId, myUserId, existingIds]);

  const addUser = (u) => {
    // 기본값: 신규 editor는 edit=future, delete=single (너가 확정한 안전 기본)
    const baseRole = "editor";
    const nextRole = clampRole(baseRole, grantMaxRole);

    const nextEditScope = clampScope("future", grantMaxEditScope);
    const nextDeleteScope = clampScope("single", grantMaxDeleteScope);

    const next = [
      ...sharedUsers,
      {
        userId: u.id,
        nickname: u.nickname,
        email: u.email,
        role: nextRole,
        editScope: nextRole === "viewer" ? "none" : nextEditScope,
        deleteScope: nextRole === "viewer" ? "none" : nextDeleteScope,
      },
    ];

    onChange(next);
    setQ("");
    setResults([]);
  };

  const updateUser = (userId, patch) => {
    const next = sharedUsers.map((s) => {
      if (String(s.userId) !== String(userId)) return s;

      const prev = s;

      // editor 정책: 하향/삭제 불가, 상향만 가능
      const requestedRole = patch.role ?? prev.role;
      const requestedEditScope = patch.editScope ?? prev.editScope;
      const requestedDeleteScope = patch.deleteScope ?? prev.deleteScope;

      let role = requestedRole;

      // owner는 공유로 지정 금지
      if (role === "owner") role = "editor";

      // viewer면 scope는 none 강제
      // (서버에서도 최종 강제해야 함)
      if (role === "viewer") {
        // editor가 하향하는 건 불가(상향만). owner는 허용 가능.
        if (isEditor && prev.role !== "viewer") {
          role = prev.role;
        } else {
          return { ...prev, role: "viewer", editScope: "none", deleteScope: "none" };
        }
      }

      // editor인 경우: 하향 방지 + 자기보다 높은 권한 부여 방지
      if (isEditor) {
        // role 하향 금지
        if (!isUpgradeRole(prev.role, role)) role = prev.role;

        // role 상한(자기보다 높게 불가)
        role = clampRole(role, grantMaxRole);

        // scope: 하향 금지
        let editScope = requestedEditScope;
        let deleteScope = requestedDeleteScope;

        if (!isUpgradeScope(prev.editScope, editScope)) editScope = prev.editScope;
        if (!isUpgradeScope(prev.deleteScope, deleteScope)) deleteScope = prev.deleteScope;

        // 자기보다 높은 scope 부여 금지(핵심 요구사항)
        editScope = clampScope(editScope, grantMaxEditScope);
        deleteScope = clampScope(deleteScope, grantMaxDeleteScope);

        // editor면 none은 의미 없으니 최소 single로 올려둘 수도 있는데,
        // 너는 범위를 분명히 쓰는 편이 좋아서 그대로 둠.
        if (role === "viewer") {
          editScope = "none";
          deleteScope = "none";
        } else {
          // role editor면, 편집은 최소 single 이상을 권장하지만 강제는 안함
          // deleteScope는 기본 single 권장
        }

        return { ...prev, role, editScope, deleteScope };
      }

      // owner인 경우: 이벤트 정책 상한이 있다면 그 상한으로 클램프 가능
      // (여기서는 myEffective*를 owner에게 all로 줬다고 가정)
      let editScope = requestedEditScope;
      let deleteScope = requestedDeleteScope;

      if (role === "viewer") {
        editScope = "none";
        deleteScope = "none";
      }

      // owner가 설정한 이벤트 상한(permissions.maxEditor...)이 있다면 여기서 minScope로 제한 가능
      // 예시: editScope = minScope(editScope, permissions.maxEditorEditScope)
      editScope = minScope(editScope, "all");
      deleteScope = minScope(deleteScope, "all");

      return { ...prev, role, editScope, deleteScope };
    });

    onChange(next);
  };

  const removeUser = (userId) => {
    // editor는 삭제 불가
    if (isEditor) return;
    const next = sharedUsers.filter((s) => String(s.userId) !== String(userId));
    onChange(next);
  };

  return (
    <div className="shareEditor">
      <div className="shareEditor__head">
        <div>
          <div className="shareEditor__title">공유 사용자</div>
          <div className="text-muted font-small">
            owner는 작성자로 고정. editor는 초대/상향만 가능(삭제/하향 불가). editor는 자기보다 높은 권한 부여 불가.
          </div>
        </div>
      </div>

      <div className="shareEditor__search">
        <input
          className="field-input"
          placeholder="사용자 검색(닉네임/이메일)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {q.trim() ? (
          <div className="shareEditor__results">
            {loading ? (
              <div className="text-muted font-small">검색 중...</div>
            ) : results.length ? (
              results.map((u) => (
                <button
                  type="button"
                  key={u.id}
                  className="shareEditor__resultItem"
                  onClick={() => addUser(u)}
                >
                  <div className="shareEditor__resultName">{u.nickname}</div>
                  <div className="text-muted font-small">{u.email}</div>
                </button>
              ))
            ) : (
              <div className="text-muted font-small">검색 결과가 없습니다.</div>
            )}
          </div>
        ) : null}
      </div>

      <div className="shareEditor__list">
        <div className="shareEditor__row shareEditor__row--head">
          <div>사용자</div>
          <div>Role</div>
          <div>Edit</div>
          <div>Delete</div>
          <div />
        </div>

        {sharedUsers.length ? (
          sharedUsers.map((s) => {
            const canEditThisRow = isOwner || isEditor;
            const disableRole = !canEditThisRow || (isEditor && s.role === "editor"); // editor는 editor->viewer 하향 불가 (상향만이라 실질 변경 여지가 적음)
            const disableEditScope = !canEditThisRow || s.role === "viewer";
            const disableDeleteScope = !canEditThisRow || s.role === "viewer";

            return (
              <div key={s.userId} className="shareEditor__row">
                <div className="shareEditor__user">
                  <div className="shareEditor__userName">{s.nickname || `user#${s.userId}`}</div>
                  <div className="text-muted font-small">{s.email || ""}</div>
                </div>

                <select
                  className="field-input"
                  value={s.role}
                  disabled={!isOwner && !isEditor}
                  onChange={(e) => updateUser(s.userId, { role: e.target.value })}
                >
                  <option value="viewer">viewer</option>
                  <option value="editor">editor</option>
                </select>

                <select
                  className="field-input"
                  value={s.editScope}
                  disabled={disableEditScope}
                  onChange={(e) => updateUser(s.userId, { editScope: e.target.value })}
                >
                  <option value="none">none</option>
                  <option value="single">single</option>
                  <option value="future">future</option>
                  <option value="all">all</option>
                </select>

                <select
                  className="field-input"
                  value={s.deleteScope}
                  disabled={disableDeleteScope}
                  onChange={(e) => updateUser(s.userId, { deleteScope: e.target.value })}
                >
                  <option value="none">none</option>
                  <option value="single">single</option>
                  <option value="future">future</option>
                  <option value="all">all</option>
                </select>

                <div className="shareEditor__actions">
                  <button
                    type="button"
                    className="btn btn--sm btn--ghost"
                    disabled={isEditor}
                    onClick={() => removeUser(s.userId)}
                    title={isEditor ? "editor는 삭제 불가" : "삭제"}
                  >
                    제거
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-muted font-small">공유된 사용자가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
