package com.timepalette.daylogue.model.dto.auth;

/**
 * 소셜 로그인 응답(일반 로그인과 동일 형태 권장)
 * @since 2025.12.27
 */
public class SocialLoginResponseModel {

    private String userId;
    private String email;
    private String nickname;
    private String role;

    private String accessToken;
    private String refreshToken;

    public String getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getNickname() { return nickname; }
    public String getRole() { return role; }
    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }

    public void setUserId(String userId) { this.userId = userId; }
    public void setEmail(String email) { this.email = email; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public void setRole(String role) { this.role = role; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
}
