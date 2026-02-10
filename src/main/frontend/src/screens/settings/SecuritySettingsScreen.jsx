// FILE: src/main/frontend/src/screens/settings/SecuritySettingsScreen.jsx
import React from "react";
import { SettingsLayout } from "./SettingsLayout";
import TextInput from "../../components/common/TextInput";
import Button from "../../components/common/Button";
import Checkbox from "../../components/common/Checkbox";
import Select from "../../components/common/Select";

function SecuritySettingsScreen() {
  return (
    <SettingsLayout
      title="보안 / 로그인 설정"
      description="비밀번호와 소셜 로그인, 2단계 인증 및 기기를 관리합니다."
    >
      <div className="settings-form">
        {/* 비밀번호 변경 */}
        <div className="settings-section">
          <div className="settings-section-title">비밀번호 변경</div>
            <div className="settings-row">
              <div className="settings-row__label">현재 비밀번호</div>
              <div className="settings-row__control w-1/2"><TextInput type="password" fullWidth /></div>
            </div>
            <div className="settings-row">
              <div className="settings-row__label">새 비밀번호</div>
              <div className="settings-row__control w-1/2"><TextInput type="password" fullWidth /></div>
            </div>
            <div className="settings-row">
              <div className="settings-row__label">새 비밀번호 확인</div>
              <div className="settings-row__control w-1/2"><TextInput type="password" fullWidth /></div>
            </div>

            <div className="settings-actions-right mt-4">
              <Button type="button" variant="primary">
                비밀번호 변경
              </Button>
            </div>
        </div>

        <hr className="settings-divider" />

        {/* 추가 보안 */}
        <div className="settings-section">
          <div className="settings-section-title">추가 보안</div>
          <div className="settings-row">
            <div className="settings-row__label">
              2단계 인증 (2FA)
              <div className="text-muted text-xs font-normal mt-1">로그인 시 이메일이나 SMS로 인증 코드를 한 번 더 확인합니다.</div>
            </div>
            <Checkbox />
          </div>
          <div className="settings-row">
            <div className="settings-row__label">자동 로그아웃</div>
            <div className="settings-row__control">
              <Select
                options={[{value: "never", label: "사용 안 함"}, {value: "30", label: "30분 후"}, {value: "60", label: "1시간 후"}]}
                defaultValue="never"
              />
            </div>
          </div>
        </div>

        <hr className="settings-divider" />

        {/* 소셜 로그인 연동 */}
        <div className="settings-section">
          <div className="settings-section-title">소셜 로그인 연동</div>

          <div className="settings-social-list">
            <div className="settings-list-item">
              <div className="settings-menu-item__content">
                <span className="font-bold">Google</span>
                <span className="text-muted text-sm">
                  아직 연결되지 않음
                </span>
              </div>
              <Button type="button" size="sm" variant="ghost">
                연결하기
              </Button>
            </div>
            <div className="settings-list-item">
              <div className="settings-menu-item__content">
                <span className="font-bold">Apple</span>
                <span className="text-muted text-sm">
                  아직 연결되지 않음
                </span>
              </div>
              <Button type="button" size="sm" variant="ghost">
                연결하기
              </Button>
            </div>
            <div className="settings-list-item">
              <div className="settings-menu-item__content">
                <span className="font-bold">Kakao</span>
                <span className="text-muted text-sm">
                  demo@kakao.com 연결됨
                </span>
              </div>
              <Button type="button" size="sm" variant="ghost">
                연결 해제
              </Button>
            </div>
          </div>
        </div>

        <hr className="settings-divider" />

        {/* 로그인 기기 관리 */}
        <div className="settings-section">
          <div className="settings-section-title">로그인 기기 관리</div>

          <div className="settings-device-list">
            <div className="settings-list-item">
              <div className="settings-menu-item__content">
                <div className="font-bold">
                  Chrome · Windows PC
                </div>
                <div className="text-muted text-sm">
                  마지막 접속: 2025-12-06 19:20
                </div>
              </div>
              <Button type="button" size="sm" variant="ghost">
                이 기기
              </Button>
            </div>
            <div className="settings-list-item">
              <div className="settings-menu-item__content">
                <div className="font-bold">
                  Safari · iPhone
                </div>
                <div className="text-muted text-sm">
                  마지막 접속: 2025-12-05 23:10
                </div>
              </div>
              <Button type="button" size="sm" variant="ghost">
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}

export default SecuritySettingsScreen;
