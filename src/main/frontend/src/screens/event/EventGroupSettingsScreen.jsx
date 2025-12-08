// src/main/frontend/src/screens/event/EventGroupSettingsScreen.jsx

import React, { useState } from "react";

const initialGroups = [
  { id: "work", name: "업무", color: "#4f46e5" },
  { id: "study", name: "공부", color: "#22c55e" },
  { id: "health", name: "건강", color: "#ef4444" },
  { id: "personal", name: "개인", color: "#f97316" },
];

const EventGroupSettingsScreen = () => {
  const [groups, setGroups] = useState(initialGroups);
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    const id = `group_${Date.now()}`;
    setGroups((prev) => [...prev, { id, name: newName.trim(), color: "#6b7280" }]);
    setNewName("");
  };

  const handleNameChange = (id, value) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, name: value } : g)),
    );
  };

  return (
    <div className="screen event-group-settings-screen">
      <div className="screen-header">
        <div>
          <h1 className="screen-header__title">일정 그룹 설정</h1>
          <p className="text-muted font-small">
            일정 등록 시 사용할 그룹(업무/공부/건강/개인 등)을 관리합니다.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="form-row form-row--inline">
          <div>
            <label className="form-label">새 그룹 이름</label>
            <input
              type="text"
              className="form-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="예) 프로젝트, 루틴, 가족 일정"
            />
          </div>
          <div className="form-actions">
            <button className="btn btn--primary" type="button" onClick={handleAdd}>
              그룹 추가
            </button>
          </div>
        </div>

        <hr className="mt-3 mb-3" />

        <table className="plan-actual-table">
          <thead>
            <tr>
              <th>색상</th>
              <th>그룹 이름</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.id}>
                <td>
                  <span
                    className="group-color-dot"
                    style={{ backgroundColor: g.color }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-input"
                    value={g.name}
                    onChange={(e) => handleNameChange(g.id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-muted font-small mt-3">
          실제 저장/수정/삭제는 추후 API 연동 시 구현합니다. 현재는 UI 와 구조 설계를 위한
          임시 상태입니다.
        </p>
      </div>
    </div>
  );
};

export default EventGroupSettingsScreen;
