// FILE: src/main/frontend/src/screens/settings/ShareUsersSettingsScreen.jsx
import React, { useState } from "react";
import { SettingsLayout } from "./SettingsLayout";
import { useShareUsers } from "../../shared/hooks/useShareUsers";
import Button from "../../components/common/Button";
import TextInput from "../../components/common/TextInput";

export default function ShareUsersSettingsScreen() {
  const { users, addUser, removeUser } = useShareUsers();
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    
    const email = newEmail.trim();
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("올바른 이메일 형식이 아닙니다.");
        return;
      }
    }

    addUser({ id: `u-${Date.now()}`, name: newName.trim(), email });
    setNewName("");
    setNewEmail("");
  };

  return (
    <SettingsLayout title="공유 사용자 관리" description="일정을 공유할 사용자 목록을 관리합니다.">
        <div className="settings-section-title">사용자 추가</div>
        <div className="settings-input-row">
          <div className="flex-1">
            <div className="field">
              <label className="field__label">이름</label>
              <input className="field__control"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="예) 김철수"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="field">
              <label className="field__label">이메일 (선택)</label>
              <input className="field__control"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
          </div>
          <Button onClick={handleAdd} variant="secondary">추가</Button>
        </div>

        <hr className="settings-divider" />

        <div className="settings-section-title">등록된 사용자 ({users.length})</div>
        <div className="settings-shareList">
          {users.length > 0 ? (
            users.map((u) => (
              <div key={u.id} className="settings-list-item">
                <div className="settings-list-item__content">
                  <div className="font-semibold text-sm">{u.name}</div>
                  <div className="text-xs text-muted">{u.email}</div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => removeUser(u.id)}>삭제</Button>
              </div>
            ))
          ) : (
            <div className="text-muted text-sm py-4 text-center">등록된 사용자가 없습니다.</div>
          )}
        </div>
    </SettingsLayout>
  );
}