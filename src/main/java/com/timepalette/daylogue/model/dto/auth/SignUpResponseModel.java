package com.timepalette.daylogue.model.dto.auth;

public class SignUpResponseModel {

    private String userId;
    private String email;
    private String nickname;
    private String role;

    /* 생성자 */

    public SignUpResponseModel() {}

    public SignUpResponseModel(String userId, String email, String nickname, String role) {
        this.userId = userId;
        this.email = email;
        this.nickname = nickname;
        this.role = role;
    }

    /* Getter & Setter */

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
