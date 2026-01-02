package com.timepalette.daylogue.controller.auth;

import com.timepalette.daylogue.model.dto.auth.LoginRequestModel;
import com.timepalette.daylogue.model.dto.auth.SignUpRequestModel;
import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.service.auth.AuthService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * 로그인, 회원가입 등 로직에서 사용
 * @since 2025.12.26
 */
@Validated
@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

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
    @RequestMapping(value = "/SignUp", method = RequestMethod.POST)
    public ResponseEntity<ResponseResultModel> SignUp (@RequestBody SignUpRequestModel param) {

        ResponseResultModel result = new ResponseResultModel();
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
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
    @RequestMapping(value = "/Login", method = RequestMethod.POST)
    public ResponseEntity<ResponseResultModel> login (@RequestBody LoginRequestModel param) {

        ResponseResultModel result = new ResponseResultModel();
        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + "")
                .body(result);
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
        return ResponseEntity.ok(result);
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
        return ResponseEntity.ok(result);
    }
}
