package com.timepalette.daylogue.model.dto.auth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
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

    @NotBlank
    @Size
    private String phone;

    private String phoneVertifyToken;

    private boolean agreeTerms;

    private boolean agreePrivacy;

    private boolean marketingOptIn;

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

    public @NotBlank @Size String getPhone() {
        return phone;
    }

    public void setPhone(@NotBlank @Size String phone) {
        this.phone = phone;
    }

    public String getPhoneVertifyToken() {
        return phoneVertifyToken;
    }

    public void setPhoneVertifyToken(String phoneVertifyToken) {
        this.phoneVertifyToken = phoneVertifyToken;
    }

    public boolean isAgreeTerms() {
        return agreeTerms;
    }

    public void setAgreeTerms(boolean agreeTerms) {
        this.agreeTerms = agreeTerms;
    }

    public boolean isAgreePrivacy() {
        return agreePrivacy;
    }

    public void setAgreePrivacy(boolean agreePrivacy) {
        this.agreePrivacy = agreePrivacy;
    }

    public boolean isMarketingOptIn() {
        return marketingOptIn;
    }

    public void setMarketingOptIn(boolean marketingOptIn) {
        this.marketingOptIn = marketingOptIn;
    }
}
