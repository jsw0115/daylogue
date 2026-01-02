package com.timepalette.daylogue.model.dto.auth;

/**
 * 가입 인증 확인(토큰 검증) 응답
 * @since 2025.12.27
 */
public class SignUpVerifyConfirmResponseModel {

    // 인증 완료 여부
    private boolean verified;

    // 인증된 이메일(옵션: 보안 정책에 따라 생략 가능)
    private String email;

    // 사용자 상태 변화(옵션): ACTIVE/UNVERIFIED 등
    private String accountStatus;

    public SignUpVerifyConfirmResponseModel() {}

    public SignUpVerifyConfirmResponseModel(boolean verified, String email, String accountStatus) {
        this.verified = verified;
        this.email = email;
        this.accountStatus = accountStatus;
    }

    public boolean isVerified() { return verified; }
    public String getEmail() { return email; }
    public String getAccountStatus() { return accountStatus; }

    public void setVerified(boolean verified) { this.verified = verified; }
    public void setEmail(String email) { this.email = email; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }
}
