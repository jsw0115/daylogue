package com.timepalette.daylogue.model.dto.auth;

/**
 * 가입 인증 확인 요청(메일 링크 토큰 검증)
 * @since 2025.12.27
 */
public class SignUpVerifyConfirmRequestModel {

    private String token; // 원문 토큰(서버는 해시로 검증/저장 권장)

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
