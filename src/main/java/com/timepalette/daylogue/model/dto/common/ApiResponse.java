package com.timepalette.daylogue.model.dto.common;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse {

    private final boolean success;
    private final Object data;
    private final String message;
    private final String errorCode;
    private final Instant serverTime;

    private ApiResponse(boolean success, Object data, String message, String errorCode) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.errorCode = errorCode;
        this.serverTime = Instant.now();
    }

    public static ApiResponse ok(Object data) {
        return new ApiResponse(true, data, null, null);
    }

    public static ApiResponse fail(String message, String errorCode) {
        return new ApiResponse(false, null, message, errorCode);
    }
}
