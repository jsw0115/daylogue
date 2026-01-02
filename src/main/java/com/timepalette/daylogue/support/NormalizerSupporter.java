package com.timepalette.daylogue.support;

import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * 이메일 정규화 유틸
 * @since 2025.12.28
 */
@Component
public class NormalizerSupporter {

    /**
     * 이메일 정규화(trim + lowercase(Locale.ROOT))
     * @since 2025.12.28
     * @param email
     * @return String
     */
    public String normalize(String email) {

        if (email == null) {
            return null;
        }

        return email.trim().toLowerCase(Locale.ROOT);
    }
}
