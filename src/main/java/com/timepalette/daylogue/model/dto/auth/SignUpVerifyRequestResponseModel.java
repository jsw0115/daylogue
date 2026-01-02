package com.timepalette.daylogue.model.dto.auth;

import lombok.Getter;
import lombok.Setter;

/**
 * 가입 인증 메일 발송 응답
 * @since 2025.12.27
 */
@Getter
@Setter
public class SignUpVerifyRequestResponseModel {

    // 요청이 정상 접수되었는지(보안 정책상 가입 여부와 무관하게 true로 내려도 됨)
    private boolean accepted;
    // 재요청 쿨다운(초). 정책 없으면 0
    private int cooldownSeconds;

    // 사용자에게 보여줄 안내 메시지(옵션)
    private String guideMessage;

    private boolean isRequested;

    private String email;

    public SignUpVerifyRequestResponseModel() {}

    public SignUpVerifyRequestResponseModel(boolean accepted, int cooldownSeconds, String guideMessage) {
        this.accepted = accepted;
        this.cooldownSeconds = cooldownSeconds;
        this.guideMessage = guideMessage;
    }
}
