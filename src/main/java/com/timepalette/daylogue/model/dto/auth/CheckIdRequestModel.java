package com.timepalette.daylogue.model.dto.auth;

/**
 * 아이디(이메일/username) 사용 가능 체크 요청
 * @since 2025.12.27
 */
public class CheckIdRequestModel {

    /**
     * email 또는 username 중 하나만 쓰는 것을 권장(정책으로 통일)
     */
    private String email;
    private String username;

    public String getEmail() { return email; }
    public String getUsername() { return username; }

    public void setEmail(String email) { this.email = email; }
    public void setUsername(String username) { this.username = username; }
}
