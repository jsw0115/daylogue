package com.timepalette.daylogue.model.enums.common;

public enum ErrorCode {
    // AUTH
    AUTH_INVALID_CREDENTIALS,
    AUTH_USER_DISABLED,
    AUTH_EMAIL_DUPLICATE,
    AUTH_RESET_TOKEN_INVALID,
    AUTH_RESET_TOKEN_EXPIRED,
    AUTH_REFRESH_TOKEN_INVALID,
    // Common
    VALIDATION_ERROR,
    NOT_FOUND,
    CONFLICT,
    INTERNAL_ERROR
}
