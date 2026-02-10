// FILE: src/main/frontend/src/screens/settings/ProfileSettingsScreen.jsx
import React, { useState } from "react";
import { SettingsLayout } from "./SettingsLayout";
import { safeStorage } from "../../shared/utils/safeStorage";
import { User, Camera } from "lucide-react";
import Button from "../../components/common/Button";
import TextInput from "../../components/common/TextInput";

const DEFAULT_PROFILE = { name: "홍길동", email: "user@example.com" };

export default function ProfileSettingsScreen() {
  const [profile, setProfile] = useState(() => safeStorage.getJSON("profile", { ...DEFAULT_PROFILE, bio: "", avatar: null }));
  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [bio, setBio] = useState(profile.bio || "");

  const saveProfile = () => {
    const next = { ...profile, name: name.trim(), email: email.trim(), bio: bio.trim() };
    safeStorage.setJSON("profile", next);
    setProfile(next);
    alert("프로필이 저장되었습니다.");
  };

  return (
    <SettingsLayout title="프로필 편집" description="사용자 정보와 프로필 사진을 관리합니다.">
      <div className="settings-card">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-4 overflow-hidden border border-gray-200 group">
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
          <div className="text-sm text-muted">프로필 사진을 클릭하여 변경하세요</div>
        </div>

        <div className="settings-form">
          <TextInput
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            label="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            label="상태 메시지"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="오늘의 기분이나 상태를 입력하세요"
          />

          <div className="settings-form__actions">
            <Button onClick={saveProfile}>저장하기</Button>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}