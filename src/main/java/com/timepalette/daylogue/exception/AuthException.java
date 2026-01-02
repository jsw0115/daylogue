package com.timepalette.daylogue.exception;

import com.timepalette.daylogue.model.enums.common.AuthErrorCode;
import com.timepalette.daylogue.model.enums.common.ErrorCode;
import org.springframework.http.HttpStatus;

public class AuthException extends RuntimeException {
//    public AuthException(HttpStatus status, ErrorCode errorCode, String message) {
//        super(status, errorCode, message);
//    }

    private final AuthErrorCode errorCode;

    public AuthException(AuthErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public AuthErrorCode getErrorCode () {
        return errorCode;
    }
}
