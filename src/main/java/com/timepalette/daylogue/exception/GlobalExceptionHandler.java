package com.timepalette.daylogue.exception;

import com.timepalette.daylogue.model.dto.common.ApiResponse;
import com.timepalette.daylogue.model.enums.common.ErrorCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.BindException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse> handleApi(ApiException e) {
        return ResponseEntity
                .status(e.getStatus())
                .body(ApiResponse.fail(e.getMessage(), e.getErrorCode().name()));
    }

    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    public ResponseEntity<ApiResponse> handleValidation(Exception e) {
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.fail("VALIDATION_ERROR", ErrorCode.VALIDATION_ERROR.name()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleUnknown(Exception e) {
        return ResponseEntity
                .internalServerError()
                .body(ApiResponse.fail("INTERNAL_ERROR", ErrorCode.INTERNAL_ERROR.name()));
    }
}
