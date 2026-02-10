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
    addUser({ id: `u-${Date.now()}`, name: newName.trim(), email: newEmail.trim() });
    setNewName("");
    setNewEmail("");
  };

  return (
    <SettingsLayout title="공유 사용자 관리" description="일정을 공유할 사용자 목록을 관리합니다.">
      <div className="settings-card">
        <header className="settings-card__header">
          <h3 className="settings-card__title">사용자 추가</h3>
        </header>
        <div className="flex gap-2 items-end mb-6">
          <div className="flex-1">
            <TextInput
              label="이름"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="예) 김철수"
            />
          </div>
          <div className="flex-1">
            <TextInput
              label="이메일 (선택)"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <Button onClick={handleAdd} variant="secondary">추가</Button>
        </div>

        <div className="settings-divider" />

        <header className="settings-card__header mt-6">
          <h3 className="settings-card__title">등록된 사용자 ({users.length})</h3>
        </header>
        <div className="settings-shareList mt-4">
          {users.length > 0 ? (
            users.map((u) => (
              <div key={u.id} className="settings-shareRow flex items-center justify-between p-3 border rounded-lg bg-white">
                <div>
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
      </div>
    </SettingsLayout>
  );
}