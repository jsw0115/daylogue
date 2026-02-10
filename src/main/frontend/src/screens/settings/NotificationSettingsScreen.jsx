// FILE: src/main/frontend/src/screens/settings/NotificationSettingsScreen.jsx
import React from "react";
import { SettingsLayout } from "./SettingsLayout";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

function NotificationSettingsScreen() {
  return (
    <SettingsLayout
      title="알림 설정"
      description="푸시/이메일/앱 내 알림과 조용한 시간을 관리합니다."
    >
          <div className="settings-form">
            <div className="settings-section">
              <div className="settings-section-title">알림 종류</div>
              <div className="settings-row">
                <div className="settings-row__label">푸시 알림</div>
                <Checkbox />
              </div>
              <div className="settings-row">
                <div className="settings-row__label">이메일 알림</div>
                <Checkbox />
              </div>
              <div className="settings-row">
                <div className="settings-row__label">앱 내 알림 (배지/인박스)</div>
                <Checkbox />
              </div>
              <div className="settings-row">
                <div className="settings-row__label">알림음</div>
                <div className="settings-row__control">
                  <Select defaultValue="default">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="알림음 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">기본음 (Ding)</SelectItem>
                      <SelectItem value="chirp">새소리</SelectItem>
                      <SelectItem value="none">무음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <hr className="settings-divider" />

            <div className="settings-section">
              <h4 className="settings-section-title">추천 알림 프리셋</h4>
              <p className="settings-help-text">
                J 모드: 전날 저녁 계획 알림 / P 모드: 하루 마감 회고 알림 등을
                자동으로 설정합니다.
              </p>

              <div className="settings-row">
                <div className="settings-row__label">전날 저녁 오늘 할 일 계획 알림</div>
                <Checkbox />
              </div>
              <div className="settings-row">
                <div className="settings-row__label">자기 전 하루 회고 알림</div>
                <Checkbox />
              </div>
            </div>

            <hr className="settings-divider" />

            <div className="settings-section">
              <h4 className="settings-section-title">조용한 시간 (Do Not Disturb)</h4>
              <p className="settings-help-text">
                지정한 시간 동안은 포커스/위급 알림만 받을 수 있습니다.
              </p>

              <div className="settings-grid-2">
                <label className="field settings-dnd-field">
                  <span className="field__label">시작</span>
                  <Input
                    type="time"
                    defaultValue="22:00"
                  />
                </label>
                <label className="field settings-dnd-field">
                  <span className="field__label">종료</span>
                  <Input
                    type="time"
                    defaultValue="07:00"
                  />
                </label>
              </div>

              <div className="settings-row mt-4">
                <div className="settings-row__label">
                  예외 알림 키워드
                  <div className="text-muted text-xs font-normal mt-1">이 키워드가 포함된 알림은 방해금지 모드에서도 울립니다.</div>
                </div>
                <div className="settings-row__control w-1/2">
                  <Input placeholder="예) 긴급, 가족, 비상" className="w-full" />
                </div>
              </div>
            </div>

            <div className="settings-actions-right mt-8">
              <Button type="button" variant="default">
                설정 저장
              </Button>
            </div>
          </div>
    </SettingsLayout>
  );
}

export default NotificationSettingsScreen;
