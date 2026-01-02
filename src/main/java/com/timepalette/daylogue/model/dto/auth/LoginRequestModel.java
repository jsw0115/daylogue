package com.timepalette.daylogue.model.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequestModel {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    public LoginRequestModel() {}

    public String getEmail() { return email; }
    public String getPassword() { return password; }

    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}
