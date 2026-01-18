package com.timepalette.daylogue.service.auth;

import com.timepalette.daylogue.config.security.AuthUser;
import com.timepalette.daylogue.model.dto.auth.*;
import com.timepalette.daylogue.model.entity.auth.User;

public interface AuthService {

    /**
     * 회원가입 아이디 중복 체크
     * @since 2025.12.27
     * @param req
     * @return SignUpResponseModel
     */
    public SignUpResponseModel checkDuplicationId(SignUpRequestModel req);

    /**
     * 회원가입 처리
     * @since 2025.12.27
     * @param req
     * @return SignUpResponseModel
     */
    public SignUpResponseModel signUp(SignUpRequestModel req);

    /**
     * 가입 인증 메일 발송(재발송 포함)
     * @since 2025.12.27
     * @param req
     * @return Object
     * @apiNote
     * - 가입 여부 노출 방지: 존재하지 않는 이메일이어도 “성공” 응답을 반환하는 정책이 흔함
     */
    public SignUpVerifyRequestResponseModel requestSignUpVerify(SignUpVerifyRequestModel req);

    /**
     * 가입 인증 확인(메일 링크 토큰 검증)
     * @since 2025.12.27
     * @param req
     * @return Object
     * @apiNote
     * - 원문 토큰 저장 금지(해시 비교)
     * - 사용 처리(used_utc)로 1회성 보장
     */
    public SignUpVerifyConfirmResponseModel confirmSignUpVerify(SignUpVerifyConfirmRequestModel req);

    /**
     * 로그인 처리(토큰 발급)
     * @since 2025.12.27
     * @param req
     * @return public LoginResponseModel signUp(LoginRequestModel req);
     */
    public LoginResponseModel login(LoginRequestModel req);

    /**
     * 로그아웃 처리 (refreshToken 폐기)
     * @since 2025.12.27
     * @param me
     * @return void
     */
    public void logout(AuthUser me);

    /**
     * 토큰 재발급 처리
     * @since 2025.12.27
     * @param req
     * @return RefreshTokenResponseModel
     */
    public RefreshTokenResponseModel refresh(RefreshTokenRequestModel  req);

    /**
     * 비밀번호 재설정 요청(메일/SMS 발송)
     * @since 2025.12.27
     * @param me
     * @param req
     * @return AuthUser
     */
    public AuthUser changePassword(AuthUser me, ChangePasswordRequestModel req);

    /**
     * 비밀번호 재설정 요청(메일/SMS 발송)
     * @since 2025.12.27
     * @param req
     * @return Object
     * @apiNote
     * - 가입 여부 노출 최소화: 존재하지 않는 이메일이어도 성공 응답으로 통일하는 정책 권장
     * - rate limit(이메일/아이피) 필수 권장
     */
    public PasswordResetRequestResponseModel requestPasswordReset(PasswordResetRequestModel req);

    /**
     * 비밀번호 재설정 확정(토큰 검증 후 변경)
     * @since 2025.12.27
     * @param req
     * @return AuthUser
     */
    public AuthUser confirmPasswordReset(PasswordResetConfirmRequestModel req);

    /**
     * 프로필 업데이트
     * @since 2025.12.27
     * @param req
     * @return ProfileResponseModel
     */
    public ProfileResponseModel updateProfile(AuthUser me, ProfileRequestModel req);

    /**
     * 소셜 로그인(코드 교환 기반)
     * @since 2025.12.27
     * @param req
     * @return SocialLoginResponseModel
     * @apiNote
     * - state 검증 필수, 가능하면 PKCE 적용
     */
    public SocialLoginResponseModel socialLogin(SocialLoginRequestModel req);

    public User getLoginUserByEmail(String loginId);
}
