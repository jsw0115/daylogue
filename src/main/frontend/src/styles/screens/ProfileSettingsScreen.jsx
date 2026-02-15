import React, { useState } from "react";
import { SettingsLayout } from "../../layout/SettingsLayout";
import { safeStorage } from "../../shared/utils/safeStorage";
import { User, Camera, Lock, Trash2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import Button from "../../components/common/Button";
import TextInput from "../../components/common/TextInput";
import "../../styles/screens/settings.css"; // CSS 연결 확인

const DEFAULT_PROFILE = { name: "홍길동", email: "user@example.com" };

export default function ProfileSettingsScreen() {
  const [profile, setProfile] = useState(() => 
    safeStorage.getJSON("profile", { ...DEFAULT_PROFILE, bio: "", avatar: null })
  );
  
  const [name, setName] = useState(profile.name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [isPwOpen, setIsPwOpen] = useState(false);

  const handleSave = () => {
    const next = { ...profile, name: name.trim(), bio: bio.trim() };
    safeStorage.setJSON("profile", next);
    setProfile(next);
    alert("프로필이 저장되었습니다.");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, avatar: url }));
    }
  };

  return (
    <SettingsLayout 
      title="프로필 편집" 
      description="사용자 정보와 프로필 사진을 관리합니다."
    >
      <div className="settings-card">
        
        {/* 1. Profile Avatar Section */}
        <div className="profile-avatar-area">
          <label className="profile-avatar-wrapper">
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt="avatar" 
                className="profile-avatar-img"
                // CSS 로딩 실패 대비 안전장치 (Inline Style)
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div className="profile-avatar-placeholder">
                <User size={64} strokeWidth={1.5} />
              </div>
            )}
            
            {/* 호버 오버레이 */}
            <div className="profile-avatar-overlay">
              <Camera size={28} />
              <span className="settings-avatar-text">변경</span>
            </div>

            {/* 파일 선택 버튼 숨김 처리 */}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarChange} 
              className="settings-hidden-input"
              // CSS 로딩 실패 대비 안전장치 (Inline Style)
              style={{ display: 'none' }}
            />
          </label>
          <div className="profile-avatar-help">프로필 사진을 클릭하여 변경하세요</div>
        </div>

        {/* 2. Basic Info Form */}
        <div className="settings-form">
          <div className="settings-section-title">기본 정보</div>
          
          <TextInput
            label="이름 (닉네임)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="표시될 이름을 입력하세요"
          />

          <TextInput
            label="이메일"
            value={profile.email}
            disabled={true} 
          />

          <TextInput
            label="상태 메시지"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="오늘의 기분이나 상태를 입력하세요"
          />

          <div className="form-actions">
            <Button onClick={handleSave} variant="primary">변경사항 저장</Button>
          </div>
        </div>

        <div className="settings-divider" />

        {/* 3. Password Toggle */}
        <div>
          <div className="settings-section-title">보안</div>
          <button 
            className="profile-pw-toggle" 
            onClick={() => setIsPwOpen(!isPwOpen)}
          >
            <div style={{display:'flex', alignItems:'center', gap:10, fontWeight: 600, color: 'var(--tf-text)'}}>
              <Lock size={18} className="text-gray-500"/> 비밀번호 변경
            </div>
            {isPwOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {isPwOpen && (
            <div className="profile-pw-form">
              <div className="settings-form">
                <TextInput type="password" label="현재 비밀번호" placeholder="현재 비밀번호 입력" />
                <TextInput type="password" label="새 비밀번호" placeholder="8자 이상 입력" />
                <TextInput type="password" label="새 비밀번호 확인" placeholder="한 번 더 입력" />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <Button size="sm">비밀번호 변경</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Danger Zone */}
        <div className="profile-danger-zone">
          <div className="danger-title">
            <AlertTriangle size={20} /> 계정 삭제
          </div>
          <p className="danger-desc">
            계정을 삭제하면 모든 데이터(일정, 기록, 통계)가 영구적으로 삭제되며 복구할 수 없습니다.
          </p>
          <Button 
            variant="danger" 
            onClick={() => alert("계정 삭제 API 호출")}
            icon={<Trash2 size={16} />}
          >
            계정 영구 삭제
          </Button>
        </div>

      </div>
    </SettingsLayout>
  );
} 