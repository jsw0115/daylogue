package com.timepalette.daylogue.model.dto.auth;

import lombok.Getter;
import lombok.Setter;

/**
 * 비밀번호 재설정 요청 응답(메일/SMS 발송)
 * @since 2025.12.27
 */
@Getter
@Setter
public class PasswordResetRequestResponseModel {

    // 요청이 정상 접수되었는지(보안 정책상 이메일 존재 여부와 무관하게 true로 내려도 됨)
    private boolean accepted;

    // 재요청 쿨다운(초). 정책 없으면 0
    private int cooldownSeconds;

    // 사용자 안내 메시지(옵션)
    private String guideMessage;

    private boolean isRequested;

    private String email;

    public PasswordResetRequestResponseModel() {}

    public PasswordResetRequestResponseModel(boolean accepted, int cooldownSeconds, String guideMessage) {
        this.accepted = accepted;
        this.cooldownSeconds = cooldownSeconds;
        this.guideMessage = guideMessage;
    }
}
