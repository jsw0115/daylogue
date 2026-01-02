package com.timepalette.daylogue.model.dto.auth;

import jakarta.validation.constraints.NotBlank;

public class RefreshTokenRequestModel {

    @NotBlank
    private String refreshToken;

    /* 생성자 */
    public RefreshTokenRequestModel () {}

    /* Getter */

    public RefreshTokenRequestModel(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
