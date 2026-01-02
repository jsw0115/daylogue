package com.timepalette.daylogue.model.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PasswordResetConfirmRequestModel {

    @NotBlank
    private String resetToken;

    @NotBlank
    @Size(min = 8, max = 72)
    private String newPassword;

    /* 생성자 */
    public PasswordResetConfirmRequestModel() {}

    /* Getter & Setter */

    public @NotBlank String getResetToken() {
        return resetToken;
    }

    public void setResetToken(@NotBlank String resetToken) {
        this.resetToken = resetToken;
    }

    public @NotBlank @Size(min = 8, max = 72) String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(@NotBlank @Size(min = 8, max = 72) String newPassword) {
        this.newPassword = newPassword;
    }
}
