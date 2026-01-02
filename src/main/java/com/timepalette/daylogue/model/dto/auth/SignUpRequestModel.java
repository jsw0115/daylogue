package com.timepalette.daylogue.model.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SignUpRequestModel {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 8, max = 72)
    private String password;

    @NotBlank
    @Size(min = 2, max = 30)
    private String nickname;

    public SignUpRequestModel() {}

    public @Email @NotBlank String getEmail() {
        return email;
    }

    public void setEmail(@Email @NotBlank String email) {
        this.email = email;
    }

    public @NotBlank @Size(min = 8, max = 72) String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank @Size(min = 8, max = 72) String password) {
        this.password = password;
    }

    public @NotBlank @Size(min = 2, max = 30) String getNickname() {
        return nickname;
    }

    public void setNickname(@NotBlank @Size(min = 2, max = 30) String nickname) {
        this.nickname = nickname;
    }
}
