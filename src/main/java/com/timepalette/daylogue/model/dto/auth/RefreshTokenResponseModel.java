package com.timepalette.daylogue.model.dto.auth;

public class RefreshTokenResponseModel {

    private String accessToken;

    /* 생성자 */

    public RefreshTokenResponseModel() {}

    public RefreshTokenResponseModel(String accessToken) {
        this.accessToken = accessToken;
    }

    /* Getter & Setter */

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
}
