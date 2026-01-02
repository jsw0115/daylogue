package com.timepalette.daylogue.exception;

import com.timepalette.daylogue.model.enums.common.AuthErrorCode;

public class AuthBizException extends RuntimeException {

    private final AuthErrorCode errorCode;

    public AuthBizException(AuthErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public AuthErrorCode getErrorCode() {
        return errorCode;
    }
}
