package com.timepalette.daylogue.model.dto.auth;

/**
 * 가입 인증 메일 발송 요청
 * @since 2025.12.27
 */
public class SignUpVerifyRequestModel {

    private String email;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
