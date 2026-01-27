package com.timepalette.daylogue.controller.auth;

import com.timepalette.daylogue.controller.BaseApiController;
import com.timepalette.daylogue.model.dto.auth.*;
import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.service.auth.AuthService;
import com.timepalette.daylogue.support.UserIdResolver;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Method;
import java.util.*;

/**
 * 로그인, 회원가입 등 로직에서 사용
 * @since 2025.12.26
 */
@Tag(name = "Auth", description = "로그인 및 회원 정보를 가져오고 저장하는 API")
@Validated
@RestController
@RequestMapping("/api/auth")
public class AuthApiController extends BaseApiController {

    private final Logger logger = LoggerFactory.getLogger(this.getClass()) ;
    private final AuthService authService;

    public AuthApiController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * 회원가입
     * @apiNote
     * @param param
     * @return ResponseResultModel
     * @apiNote
     * - 이메일/아이디 중복 시 409(CONFLICT) 권장
     * - 비밀번호는 평문 저장 금지(BCrypt 등 해시 저장)
     * - 가입 직후 자동 로그인 여부는 정책(토큰 발급/미발급)으로 결정
     */
    @RequestMapping(value = {"/signup", "/SignUp"}, method = RequestMethod.POST)
    public ResponseEntity<ResponseResultModel> SignUp (@RequestBody SignUpRequestModel param) {
        ResponseResultModel result = new ResponseResultModel();
        logger.info("AuthApiController, SignUp");
        try {

            logger.info("param, getEmail : " + param.getEmail());
            logger.info("param, getNickname : " + param.getNickname());
            logger.info("param, getPassword : " + param.getPassword());

            // 서비스에서 실제 가입 처리
            // 반환 타입은 프로젝트 구현에 따라 다를 수 있음(예: user dto, map, custom response)
            SignUpResponseModel data = authService.signUp(param);

            // ResponseResultModel 구조가 확실치 않아 최소 필드만 세팅(필요 시 너 프로젝트 필드명으로 맞춰)
            result.setSuccess(true);
            result.setData(data);

            // 가입 성공은 201
            return ResponseEntity.status(HttpStatus.CREATED).body(result);

        } catch (DuplicateKeyException e) {

//            logger.error("SignUp, DataIntegrityViolationException, {}", e);
            // 중복 이메일 등
            result.setSuccess(false);
            result.setMessage("DUPLICATE");
            result.setErrorCode("USR-409-DUP");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(result);

        } catch (IllegalArgumentException e) {

            logger.error("SignUp, IllegalArgumentException, {}", e);
            result.setSuccess(false);
            result.setMessage("VALIDATION_ERROR");
            result.setErrorCode("VAL-001");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    /**
     * 로그인
     * @apiNote
     * @param param
     * @return ResponseResultModel
     * @apiNote
     * - 성공 시 Authorization: Bearer {accessToken} 헤더를 내려줄 수 있음(프론트 정책에 따라)
     * - 실패 시 401(UNAUTHORIZED): 이메일/비밀번호 불일치
     * - 계정 정지/삭제 등은 403(FORBIDDEN)로 분리하는 것을 권장
     */
    @RequestMapping(value = {"/login", "/Login"}, method = RequestMethod.POST)
    public ResponseEntity<ResponseResultModel> login (@RequestBody LoginRequestModel param) {

        ResponseResultModel result = new ResponseResultModel();
        logger.info("AuthApiController, login");

        try {
            LoginResponseModel data = authService.login(param);

            result.setSuccess(true);
            result.setData(data);

            // data에서 accessToken을 최대한 추출해서 Authorization 헤더에 실어줌
            String accessToken = tryExtractAccessToken(data);

            ResponseEntity.BodyBuilder builder = ResponseEntity.ok();
            if (accessToken != null && !accessToken.isBlank()) {
                builder.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
            }

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + data.getAccessToken())
                    .body(result);

        } catch (BadCredentialsException e) {

            logger.error("login, BadCredentialsException");
            result.setSuccess(false);
            result.setMessage("UNAUTHORIZED");
            result.setErrorCode("AUTH-401");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);

        } catch (AccessDeniedException e) {

            logger.error("login, AccessDeniedException");
            result.setSuccess(false);
            result.setMessage("FORBIDDEN");
            result.setErrorCode("AUTH-403");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);

        } catch (IllegalArgumentException e) {

            logger.error("login, IllegalArgumentException {} ", e);
            result.setSuccess(false);
            result.setMessage("VALIDATION_ERROR");
            result. setErrorCode("VAL-001");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    /**
     * 로그아웃
     * @apiNote
     * @param param
     * @return ResponseResultModel
     */
    @RequestMapping(value = "/Logout", method = RequestMethod.POST)
    public ResponseEntity<ResponseResultModel> logout (@RequestBody LoginRequestModel param) {

        ResponseResultModel result = new ResponseResultModel();
        logger.info("AuthApiController, logout");
        try {
//            Object data = authService.logout(param); // 서비스 시그니처에 맞춰 구현 필요
            result. setSuccess(true);
//            result. setData(data);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result. setSuccess(false);
            result. setMessage("LOGOUT_FAILED");
            result. setErrorCode("AUTH-500");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    /**
     * 토큰 재발급
     * @apiNote
     * @param param
     * @return ResponseResultModel
     */
    @RequestMapping(value = "/Refresh", method = RequestMethod.POST)
    public ResponseEntity<ResponseResultModel> refresh (@RequestBody LoginRequestModel param) {

        ResponseResultModel result = new ResponseResultModel();
        logger.info("AuthApiController, refresh");

        try {
//            Object data = authService.refresh(param); // 서비스 시그니처에 맞춰 구현 필요
            result. setSuccess(true);
//            result. setData(data);

//            String accessToken = tryExtractAccessToken(data);
            ResponseEntity.BodyBuilder builder = ResponseEntity.ok();
//            if (accessToken != null && !accessToken.isBlank()) {
//                builder.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
//            }
            return builder.body(result);

        } catch (BadCredentialsException e) {
            result. setSuccess(false);
            result. setMessage("UNAUTHORIZED");
            result. setErrorCode("AUTH-401");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);

        } catch (Exception e) {
            result. setSuccess(false);
            result. setMessage("REFRESH_FAILED");
            result. setErrorCode("AUTH-500");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    /**
     *  사용자 정보를 가져오는 메서드
     * @since   2026.01.24
     * */
    @RequestMapping(value = "/UserData", method = RequestMethod.GET)
    public ResponseEntity<ResponseResultModel> userData(Authentication auth) {

        logger.info("AuthApiController, userData");
        ResponseResultModel result = new ResponseResultModel();
        try {

            // 사용자 정보 가져옴
            String userId = UserIdResolver.getUserIdByAuth(auth);

            // 사용자 아이디를 토대로 사용자 이메일 및 정보들을 가져옴.
            UserAuthDataResponseModel data =  authService.getUserData(userId);

            result.setData(data);
            result.setSuccess(true);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            result. setSuccess(false);
            result. setMessage("REFRESH_FAILED");
            result. setErrorCode("AUTH-500");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    /**
     * */
    private String tryExtractAccessToken(Object data) {
        if (data == null) return null;

        // 1) Map 대응
        if (data instanceof Map<?, ?> m) {
            Object v = m.get("accessToken");
            if (v instanceof String s && !s.isBlank()) return s;
            // 중첩 구조(예: {data:{accessToken:...}})면 한 번 더
            Object inner = m.get("data");
            if (inner instanceof Map<?, ?> m2) {
                Object v2 = m2.get("accessToken");
                if (v2 instanceof String s2 && !s2.isBlank()) return s2;
            }
        }

        // 2) getAccessToken() 메서드 대응
        try {
            Method getter = data.getClass().getMethod("getAccessToken");
            Object v = getter.invoke(data);
            if (v instanceof String s && !s.isBlank()) return s;
        } catch (Exception ignored) {}

        return null;
    }
}
