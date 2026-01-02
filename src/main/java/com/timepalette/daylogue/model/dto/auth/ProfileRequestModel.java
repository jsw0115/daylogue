package com.timepalette.daylogue.model.dto.auth;

public class ProfileRequestModel {

    // 닉네임은 선택 변경
    private String nickname;

    // 예: Asia/Seoul
    private String timeZone;

    private Boolean marketingConsent;

    /* 생성자 */
    public ProfileRequestModel () {}

    /* Getter & Setter */

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
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
