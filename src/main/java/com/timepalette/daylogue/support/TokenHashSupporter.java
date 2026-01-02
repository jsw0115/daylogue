package com.timepalette.daylogue.support;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/**
 * 토큰 해시(SHA-256)
 * @since 2025.12.28
 */
@Component
public class TokenHashSupporter {

    /**
     * 입력 문자열을 SHA-256 hex로 변환
     * @since 2025.12.28
     * @param raw
     * @return String
     */
    public String sha256Hex(String raw) {
        if (raw == null) return null;
        try {

            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            return toHex(digest);
        } catch (Exception e) {

            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    private String toHex(byte[] bytes) {

        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {

            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
