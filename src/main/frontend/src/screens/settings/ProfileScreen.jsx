// FILE: src/main/frontend/src/screens/settings/ProfileScreen.jsx
import React, { useState } from "react";
import { SettingsLayout } from "./SettingsLayout";
import { safeStorage } from "../../shared/utils/safeStorage";
import { User, Camera } from "lucide-react";
import Button from "../../components/common/Button";
import TextInput from "../../components/common/TextInput";

const DEFAULT_PROFILE = { name: "홍길동", email: "user@example.com" };

export default function ProfileScreen() {
  const [profile, setProfile] = useState(() => safeStorage.getJSON("profile", { ...DEFAULT_PROFILE, bio: "", avatar: null }));
  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [bio, setBio] = useState(profile.bio || "");

  const saveProfile = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    const next = { ...profile, name: name.trim(), email: email.trim(), bio: bio.trim() };
    safeStorage.setJSON("profile", next);
    setProfile(next);
    alert("프로필이 저장되었습니다.");
  };

  return (
    <SettingsLayout title="프로필 편집" description="사용자 정보와 프로필 사진을 관리합니다.">
      <div className="settings-form">
        <div className="settings-section">
          <div className="flex flex-col items-center mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="relative w-28 h-28 rounded-full bg-white flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-sm group">
              {profile.avatar ? (
                <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-gray-400" />
              )}
              <label className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Camera size={32} className="text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setProfile((prev) => ({ ...prev, avatar: url }));
                    }
                  }}
                />
              </label>
            </div>
            <div className="text-sm text-slate-500 font-medium">프로필 사진 변경</div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">기본 정보</div>
          <div className="settings-row">
            <div className="settings-row__label">이름</div>
            <div className="settings-row__control w-1/2">
              <TextInput value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row__label">이메일</div>
            <div className="settings-row__control w-1/2">
              <TextInput value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row__label">상태 메시지</div>
            <div className="settings-row__control w-1/2">
              <TextInput value={bio} onChange={(e) => setBio(e.target.value)} placeholder="오늘의 기분이나 상태를 입력하세요" fullWidth />
            </div>
          </div>
        </div>

        <div className="settings-actions-right">
          <Button onClick={saveProfile}>변경사항 저장</Button>
        </div>
      </div>
    </SettingsLayout>
  );
}
