package com.timepalette.daylogue.support;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

/**
 * UTC 시간 제공자
 * @since 2025.12.28
 */
@Component
public class DateTimeSupporter {

    /**
     * UTC 기준 현재 시각 반환
     * @since 2025.12.28
     * @return LocalDateTime
     */
    public LocalDateTime nowUtc() {

        return LocalDateTime.now(ZoneOffset.UTC);
    }
}
