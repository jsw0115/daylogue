package com.timepalette.daylogue.model.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class PasswordResetRequestModel {

    @Email
    @NotBlank
    private String email;

    /* 생성자 */

    public PasswordResetRequestModel() {}

    /* Getter & Setter */

    public @Email @NotBlank String getEmail() {
        return email;
    }

    public void setEmail(@Email @NotBlank String email) {
        this.email = email;
    }
}
