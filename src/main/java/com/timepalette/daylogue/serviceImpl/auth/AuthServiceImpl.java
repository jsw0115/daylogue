package com.timepalette.daylogue.serviceImpl.auth;

import com.timepalette.daylogue.config.security.AuthUser;
import com.timepalette.daylogue.config.security.JwtTokenProvider;
import com.timepalette.daylogue.exception.AuthException;
import com.timepalette.daylogue.model.dto.auth.*;
import com.timepalette.daylogue.model.entity.auth.EmailVerifyToken;
import com.timepalette.daylogue.model.entity.auth.RefreshToken;
import com.timepalette.daylogue.model.entity.auth.User;
import com.timepalette.daylogue.model.enums.auth.AuthAuditEvent;
import com.timepalette.daylogue.model.enums.auth.UserStatus;
import com.timepalette.daylogue.model.enums.common.AuthErrorCode;
import com.timepalette.daylogue.repository.auth.EmailVerifyTokenRepository;
import com.timepalette.daylogue.repository.auth.PasswordResetTokenRepository;
import com.timepalette.daylogue.repository.auth.RefreshTokenRepository;
import com.timepalette.daylogue.repository.auth.UserRepository;
import com.timepalette.daylogue.service.auth.AuthAuditService;
import com.timepalette.daylogue.service.auth.AuthService;
import com.timepalette.daylogue.service.auth.LoginThrottleService;
import com.timepalette.daylogue.support.*;
import io.jsonwebtoken.Claims;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class AuthServiceImpl implements AuthService {

    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    private final UserRepository userRepo;
    private final RefreshTokenRepository refreshRepo;
    private final EmailVerifyTokenRepository emailVerifyRepo;
    private final PasswordResetTokenRepository pwResetRepo;

    private final NormalizerSupporter emailNormalizer;
    private final TokenHashSupporter tokenHasher;
    private final UlidGenerator ulid;
    private final DateTimeSupporter clock;
    private final PasswordPolicy passwordPolicy;
    private final LoginThrottleService throttleService;
    private final AuthAuditService auditService;
    private final MailSendSupporter mailSender;

    private static final int EMAIL_VERIFY_TTL_MIN = 30;
    private static final int PW_RESET_TTL_MIN = 30;

    public AuthServiceImpl(PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, UserRepository userRepo, RefreshTokenRepository refreshRepo, EmailVerifyTokenRepository emailVerifyRepo, PasswordResetTokenRepository pwResetRepo, NormalizerSupporter emailNormalizer, TokenHashSupporter tokenHasher, UlidGenerator ulid, DateTimeSupporter clock, PasswordPolicy passwordPolicy, LoginThrottleService throttleService, AuthAuditService auditService, MailSendSupporter mailSender) {
        this.passwordEncoder = Objects.requireNonNull(passwordEncoder);
        this.jwtTokenProvider = Objects.requireNonNull(jwtTokenProvider);
        this.userRepo = userRepo;
        this.refreshRepo = refreshRepo;
        this.emailVerifyRepo = emailVerifyRepo;
        this.pwResetRepo = pwResetRepo;
        this.emailNormalizer = emailNormalizer;
        this.tokenHasher = tokenHasher;
        this.ulid = ulid;
        this.clock = clock;
        this.passwordPolicy = passwordPolicy;
        this.throttleService = throttleService;
        this.auditService = auditService;
        this.mailSender = mailSender;
    }

    // 이메일 정규식
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    // 계정 미존재 시, 더미 해시 (BCrypt 형태)
    private static final String DUMMY_BCRYPT_HASH = "$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5BfR8l9k7kYJQYw1dE4Qx2YwGm3nW";

    // 잠금 정책 : 5회 실패 -> 5분 잠금
    private static final int MAX_FAIL = 5;
    private static final Duration LOCK_DURATION = Duration.ofMinutes(5);

    // 토큰 만료 : 가입 인증 15분, 비번 재설정 15분
    private static final Duration SIGNUP_VERIFY_TTL = Duration.ofMinutes(15);
    private static final Duration PW_RESET_TTL = Duration.ofMinutes(15);

    // 재발송/요청 쿨다운 : 60초
    private static final int REQUEST_COOLDOWN_SECONDS = 60;

    /**
     * 회원가입 아이디 중복 체크
     * @since 2025.12.27
     * @param req
     * @return SignUpResponseModel
     */
    @Override
    public SignUpResponseModel checkDuplicationId(SignUpRequestModel req) {

        SignUpResponseModel result = new SignUpResponseModel();

        // 1. 입력 정규화(정책 통일)
        // email : trim + lowercase(로케일 고정) 권장

        // 2. rate limit / 로깅 (서비스/필터 레벨)
        // 동일한 IP 초당/분당 요청 제한
        // 동일한 email에 대한 연속 조회 제한
        // 이상 패턴 감지 시 차단

        // 3. DB 존재 여부 조회 (Repository 필요)

        // 4. 응답
        // 공격 표면이므로 rate limit을 반드시 붙이는 편이 안전

        return result;
    }

    /**
     * 회원가입 처리
     * @since 2025.12.27
     * @param req
     * @return SignUpResponseModel
     */
    @Override
    public SignUpResponseModel signUp(SignUpRequestModel req) {

        SignUpResponseModel result = new SignUpResponseModel();

        // 1. 입력 검증(형식/길이)
        // password 최소길이/복잡도 정책

        // 2. 아이디 중복 체크(서비스 레벨)
        // 중복이면 409(CONFLICT)로 예외 처리 권장

        // 3. 비밀번호 해싱
        // encode 결과는 매번 salt가 달라져 같은 비번이어도 해시가 달라지는 게 정상

        // 4. 사용자 저장
        // 저장 시점에 DB Unique Index 충돌이 날 수 있으니 DuplicateKey/Constraint 예외도 409로 매핑

        // 5. 가입 인증 메일 발송
        // 이메일 인증 정책 : 원문 토큰은 메일 링크로만 전달(서버에 원문 저장 금지)

        // 6. 응답
        // 자동 로그인 정책이면 access/refresh를 여기서 발급할 수도 있음(정책에 맞춰 결정)

        return result;
    }

    /**
     * 가입 인증 메일 발송(재발송 포함)
     * @since 2025.12.27
     * @param req
     * @return Object
     * @apiNote
     * - 가입 여부 노출 방지: 존재하지 않는 이메일이어도 “성공” 응답을 반환하는 정책이 흔함
     */
    @Override
    public SignUpVerifyRequestResponseModel requestSignUpVerify(SignUpVerifyRequestModel req) {

        // 1. 입력 정규화(email)

        // 2. rate limit
        // 같은 email로 짧은 시간 내 재발송 제한(스팸/폭탄 방지)
        // 같은 IP 재발송 제한

        // 3. 사용자 조회
        // 없더라도 성공 응답(가입 여부 노출 방지) 정책 고려

        // 4. 토큰 발급/저장(해시)
        // rawToken 생성(랜덤 32바이트 이상 권장)
        // SHA-256

        // 5. 메일 전송
        // 링크에 rawToken 포함
        // 서버는 confirm에서 rawToken 해시로 비교

        return null;
    }

    /**
     * 가입 인증 확인(메일 링크 토큰 검증)
     * @since 2025.12.27
     * @param req
     * @return Object
     * @apiNote
     * - 원문 토큰 저장 금지(해시 비교)
     * - 사용 처리(used_utc)로 1회성 보장
     */
    @Override
    public SignUpVerifyConfirmResponseModel confirmSignUpVerify(SignUpVerifyConfirmRequestModel req) {

        // 1. 입력 검증

        // 2. 토큰 해시 계산 후 조회
        // email_verify_token.tok_hash로 조회
        // exp_utc 만료 확인
        // used_utc 이미 있으면 재사용 불가

        // 3. users.email_vfy = 1 업데이트(또는 st=ACTIVE로 전환)

        // 4. 토큰 used_utc 업데이트

        return null;
    }

    /**
     * 로그인 처리(토큰 발급)
     * @since 2025.12.27
     * @param req
     * @return LoginResponseModel
     */
    @Override
    public LoginResponseModel login(LoginRequestModel req) {

        LoginResponseModel result = new LoginResponseModel();

        // 1. 입력 정규화

        // 2. 로그인 시도 제한
        // EMAIL, IP 연속 실패 횟수
        // lock_utc(잠금 해제 시각)로 백오프/잠금 구현

        // 3. 사용자 조회
        // "아이디 또는 비밀번호가 올바르지 않습니다"로 통일(계정 열거 방지)

        // 4. 사용자 상태 체크
        // st=SUSPENDED/DELETED면 403 또는 정책에 따른 거부
        // email 인증 필요 정책이면 email_vfy=0일 때 로그인 제한

        // 5. 비밀번호 검증
        // 실패 시, 실패 카운트 증가 & 동일 메시지로 401

        // 6. 성공 처리
        // 실패 카운트 초기화 & last_login_utc 업데이트

        // 7. 토큰 발급
        // AuthUser principal 구성(id, email, nickname, role, enabled)

        // 8. refresh 저장형
        // refresh_token에 tok_hash로 저장(원문 저장 금지)
        // exp_utc 저장
        // 로그아웃/회전/기기별 세션 관리를 위해 device_id/jti를 같이 저장하면 운영이 쉬움

        // 9. 응답
        //

        return result;
    }

    /**
     * 로그아웃 처리 (refreshToken 폐기)
     * @since 2025.12.27
     * @param me
     * @return void
     * @apiNote
     * - refresh 저장형이면 tok_hash 기반으로 revoke 처리(또는 user_id 전체 폐기/기기별 폐기)
     * - accessToken은 무상태라 즉시 폐기 어렵고, 짧은 TTL 전략이 현실적
     */
    @Override
    public void logout(AuthUser me) {

        // refresh token 저장소를 쓰면 해당 사용자 토큰 폐기

        // 1. 인증 주체 확인
        // null이면 SecurityContext 설정/필터 체인을 먼저 점검

        // 2. refresh 저장형
        // refresh_token에서 user_id 기반으로 rev_utc 업데이트 또는 삭제
        // 기기별 로그아웃이면 device_id까지 조건으로 revoke

        // 3. 감사 로그(권장)
        // LOGOUT 이벤트, ip/ua (민감정보 제외)

    }

    /**
     * 토큰 재발급 처리
     * @since 2025.12.27
     * @param req
     * @return RefreshTokenResponseModel
     */
    @Override
    public RefreshTokenResponseModel refresh(RefreshTokenRequestModel req) {

        RefreshTokenResponseModel result = new RefreshTokenResponseModel();
        // 1. refreshToken validate + typ=refresh 확인
        return result;
    }

    /**
     * 비밀번호 재설정 요청(메일/SMS 발송)
     * @since 2025.12.27
     * @param me
     * @param req
     * @return AuthUser
     */
    @Override
    public AuthUser changePassword(AuthUser me, ChangePasswordRequestModel req) {

        // reset token 생성/저장/메일 발송
        // 1. 인증 주체 확인(me)
        // 2. 사용자 조회
        // 3. oldPassword 검증(passwordEncoder.matches)
        // 4. newPassword 정책 검사(길이/금칙어 등)
        // 5. newPassword 해싱 후 저장
        // 6. pw_chg_utc 갱신
        // 7. refresh 토큰 전량 폐기(강제 로그아웃 효과)
        // 8. 감사 로그(PW_CHANGE)

        return null;
    }

    /**
     * 비밀번호 재설정 요청(메일/SMS 발송)
     * @since 2025.12.27
     * @param req
     * @return Object
     * @apiNote
     * - 가입 여부 노출 최소화: 존재하지 않는 이메일이어도 성공 응답으로 통일하는 정책 권장
     * - rate limit(이메일/아이피) 필수 권장
     */
    @Override
    public PasswordResetRequestResponseModel requestPasswordReset(PasswordResetRequestModel req) {

        // 1. email 정규화
        // 2. rate limit
        // 3. 사용자 조회(없어도 성공 응답 정책 고려)
        // 4. password_reset_token 발급/저장(해시)
        // 5. 메일/SMS 발송(원문 토큰은 링크에만 포함)
        // 6. 감사 로그(PW_RESET_REQUEST)

        return null;
    }

    /**
     * 비밀번호 재설정 확정(토큰 검증 후 변경)
     * @since 2025.12.27
     * @param req
     * @return AuthUser
     */
    @Override
    public AuthUser confirmPasswordReset(PasswordResetConfirmRequestModel req) {

        // reset token 검증 + 만료 확인 후 비밀번호 변경
        // 1. resetToken 원문 입력
        // 2. 해시로 조회(password_reset_token.tok_hash)
        // 3. exp_utc / used_utc 검증
        // 4. 사용자 비밀번호 변경(encode)
        // 5. token used_utc 업데이트
        // 6. (권장) refresh 전량 폐기
        // 7. 감사 로그(PW_RESET_CONFIRM)

        return null;
    }

    /**
     * 프로필 업데이트
     * @since 2025.12.27
     * @param req
     * @return ProfileResponseModel
     */
    @Override
    public ProfileResponseModel updateProfile(AuthUser me, ProfileRequestModel req) {

        ProfileResponseModel result = new ProfileResponseModel();

        // 닉네임/타임존/마케팅동의 업데이트
        // 1. 인증 주체(userId)
        // 2. 사용자 조회
        // 3. 업데이트(닉/타임존/마케팅 동의)
        // 4. u_at 갱신
        // 5. 감사 로그(PROFILE_UPDATE)

        return result;
    }

    /**
     * 소셜 로그인(코드 교환 기반)
     * @since 2025.12.27
     * @param req
     * @return SocialLoginResponseModel
     * @apiNote
     * - state 검증 필수(CSRF 방지)
     * - 가능하면 PKCE(code_verifier) 적용 권장
     * - 동일 이메일 병합 정책(연동/차단)을 명확히 해야 함
     */
    @Override
    public SocialLoginResponseModel socialLogin(SocialLoginRequestModel req) {

        SocialLoginResponseModel result = new SocialLoginResponseModel();

        // 1. state 검증
        // oauth_state 테이블 또는 Redis에 저장해둔 state인지 확인
        // used_utc 처리로 1회성 보장

        // 2. provider별 토큰 교환
        // code -> provider access_token 교환

        // 3. provider userinfo 조회
        // provider_uid(sub), email, email_verified 등 획득

        // 4. 내부 계정 매핑
        // social_account(provider, provider_uid)로 기존 연결 확인
        // 없을 경우
        //    email이 기존 로컬 계정과 같을 때 연동할지/차단할지 정책 적용
        //    신규 생성이면 users에 social-only 계정 생성(비밀번호 없이도 가능)

        // 5. 내부 JWT 발급(access/refresh)
        // 일반 로그인과 동일 정책 적용

        // 6. refresh 저장형 + rotation 운영 권장

        return result;
    }


    private void ensureLoginAllowedOrThrow(User user) {
        if (user.getSt() == UserStatus.SUSPENDED || user.getSt() == UserStatus.DELETED) {
            throw new AuthException(AuthErrorCode.AUTH_ACCOUNT_DISABLED, "계정 상태로 인해 로그인할 수 없습니다.");
        }
        // 정책: 이메일 인증 필수라면 활성화
        // if (!user.isEmailVfy()) throw new AuthException(AuthErrorCode.AUTH_EMAIL_NOT_VERIFIED, "이메일 인증이 필요합니다.");
    }

    private AuthUser toAuthUser(User user) {
        return new AuthUser(
                user.getId(),
                user.getEmail(),
                user.getNick(),
                user.getRole().name(),
                user.getPwHash(),
                user.getSt() == UserStatus.ACTIVE
        );
    }

    private void saveRefreshToken(String userId, String rawRefreshToken, String deviceId) {
        Claims claims = jwtTokenProvider.parseClaims(rawRefreshToken);
        LocalDateTime expUtc = toUtcLocalDateTime(claims.getExpiration().getTime());

        RefreshToken rt = new RefreshToken();
        rt.setId(ulid.newUlid());
        rt.setUserId(userId);
        rt.setTokHash(tokenHasher.sha256Hex(rawRefreshToken));
        rt.setExpUtc(expUtc);
        rt.setRevUtc(null);
        rt.setDeviceId(deviceId);
        rt.setJti(UUID.randomUUID().toString());
        rt.setLastUsedUtc(clock.nowUtc());
        refreshRepo.save(rt);
    }

    private void internalIssueEmailVerifyTokenAndSend(User user, String ip, String ua) {
        String rawToken = UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
        String tokHash = tokenHasher.sha256Hex(rawToken);

        EmailVerifyToken token = new EmailVerifyToken();
        token.setId(ulid.newUlid());
        token.setUserId(user.getId());
        token.setTokHash(tokHash);
        token.setExpUtc(clock.nowUtc().plusMinutes(EMAIL_VERIFY_TTL_MIN));
        token.setUsedUtc(null);
        emailVerifyRepo.save(token);

        String link = buildEmailVerifyLink(rawToken);
        mailSender.send(user.getEmail(), "[TimeFlow] 이메일 인증", """
                <p>이메일 인증을 완료하려면 아래 링크를 클릭하세요.</p>
                <p><a href="%s">%s</a></p>
                <p>만료 시간: %d분</p>
                """.formatted(link, link, EMAIL_VERIFY_TTL_MIN));

        auditService.write(user.getId(), AuthAuditEvent.EMAIL_VERIFY_REQUEST, ip, ua, null);
    }

    private String normalizeEmailOrThrow(String email) {
        String normalized = emailNormalizer.normalize(email);
        if (normalized == null || normalized.isBlank()) {
            throw new AuthException(AuthErrorCode.AUTH_LOGIN_FAILED, "이메일이 올바르지 않습니다.");
        }
        // 필요 시: 이메일 정규식 검증 추가
        return normalized;
    }

    private String require(String v, String field) {
        if (v == null || v.isBlank()) {
            throw new AuthException(AuthErrorCode.AUTH_REFRESH_INVALID, field + " 값이 필요합니다.");
        }
        return v;
    }

    private String requireNick(String nick) {
        if (nick == null || nick.isBlank()) {
            throw new AuthException(AuthErrorCode.AUTH_PASSWORD_POLICY, "닉네임이 필요합니다.");
        }
        String t = nick.trim();
        if (t.length() > 80) t = t.substring(0, 80);
        return t;
    }

    private String safe(String v) {
        if (v == null) return null;
        return v.replace("\"", "");
    }

    private LocalDateTime toUtcLocalDateTime(long epochMillis) {
        // Date(exp) -> epochMillis -> UTC LocalDateTime
        return java.time.Instant.ofEpochMilli(epochMillis)
                .atZone(java.time.ZoneOffset.UTC)
                .toLocalDateTime();
    }

    private SignUpVerifyRequestResponseModel successVerifyRequest(String email) {
        SignUpVerifyRequestResponseModel res = new SignUpVerifyRequestResponseModel();
        res.setEmail(email);
        res.setRequested(true);
        return res;
    }

    private PasswordResetRequestResponseModel successPwResetRequest(String email) {
        PasswordResetRequestResponseModel res = new PasswordResetRequestResponseModel();
        res.setEmail(email);
        res.setRequested(true);
        return res;
    }

    private String buildEmailVerifyLink(String rawToken) {
        // 운영에서는 프론트 URL + query로 붙이거나, 백엔드 confirm endpoint로 붙이면 됨
        return "https://app.timeflow.local/verify-email?token=" + rawToken;
    }

    private String buildPasswordResetLink(String rawToken) {
        return "https://app.timeflow.local/reset-password?token=" + rawToken;
    }
}
