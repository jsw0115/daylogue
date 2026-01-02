package com.timepalette.daylogue.model.dto.auth;

public class ProfileResponseModel {

    private String userId;
    private String email;
    private String nickname;
    private String role;
    private String timeZone;
    private Boolean marketingConsent;

    /* 생성자 */

    public ProfileResponseModel() {}

    public ProfileResponseModel(String userId, String email, String nickname, String role, String timeZone, Boolean marketingConsent) {
        this.userId = userId;
        this.email = email;
        this.nickname = nickname;
        this.role = role;
        this.timeZone = timeZone;
        this.marketingConsent = marketingConsent;
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

    public String getTimeZone() {
        return timeZone;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
    }

    public Boolean getMarketingConsent() {
        return marketingConsent;
    }

    public void setMarketingConsent(Boolean marketingConsent) {
        this.marketingConsent = marketingConsent;
    }
}
