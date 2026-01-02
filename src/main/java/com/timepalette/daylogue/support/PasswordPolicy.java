package com.timepalette.daylogue.support;

import com.timepalette.daylogue.exception.AuthException;
import com.timepalette.daylogue.model.enums.common.AuthErrorCode;
import org.springframework.stereotype.Component;

/**
 * 비밀번호 정책 검사
 * @since 2025.12.28
 */
@Component
public class PasswordPolicy {

    /**
     * 비밀번호 최소 정책 검사(예: 10자 이상)
     * @since 2025.12.28
     * @param rawPassword
     * @return void
     */
    public void validateOrThrow(String rawPassword) {

        if (rawPassword == null || rawPassword.length() < 10) {
            throw new AuthException(AuthErrorCode.AUTH_PASSWORD_POLICY, "비밀번호 정책을 만족하지 않습니다.");
        }
        // 필요 시: 흔한 비번 차단, 연속문자/키보드 패턴 등 추가
    }
}
