package com.timepalette.daylogue.model.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChangePasswordRequestModel {

    @NotBlank
    private String userId;

    @NotBlank
    private String oldPassword;

    @NotBlank
    @Size(min = 8, max = 72)
    private String newPassword;

    /* 생성자 */

    public ChangePasswordRequestModel() {}

    public ChangePasswordRequestModel(String userId, String oldPassword, String newPassword) {
        this.userId = userId;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

    /* Getter & Setter */

    public @NotBlank String getUserId() {
        return userId;
    }

    public void setUserId(@NotBlank String userId) {
        this.userId = userId;
    }

    public @NotBlank String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(@NotBlank String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public @NotBlank @Size(min = 8, max = 72) String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(@NotBlank @Size(min = 8, max = 72) String newPassword) {
        this.newPassword = newPassword;
    }
}
