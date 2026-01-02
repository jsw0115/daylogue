package com.timepalette.daylogue.model.dto.auth;

import com.timepalette.daylogue.model.enums.auth.SocialProvider;

/**
 * 소셜 로그인 요청(Authorization Code 교환 방식)
 * @since 2025.12.27
 */
public class SocialLoginRequestModel {

    private SocialProvider provider;
    private String code;
    private String state;
    private String redirectUri;

    // PKCE 사용 시(선택)
    private String codeVerifier;

    public SocialProvider getProvider() { return provider; }
    public String getCode() { return code; }
    public String getState() { return state; }
    public String getRedirectUri() { return redirectUri; }
    public String getCodeVerifier() { return codeVerifier; }

    public void setProvider(SocialProvider provider) { this.provider = provider; }
    public void setCode(String code) { this.code = code; }
    public void setState(String state) { this.state = state; }
    public void setRedirectUri(String redirectUri) { this.redirectUri = redirectUri; }
    public void setCodeVerifier(String codeVerifier) { this.codeVerifier = codeVerifier; }
}
