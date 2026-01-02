package com.timepalette.daylogue.support;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

/**
 * ULID 생성기(26자, Crockford Base32)
 * @since 2025.12.28
 */
@Component
public class UlidGenerator {

    private static final char[] ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ".toCharArray();
    private static final SecureRandom RND = new SecureRandom();

    /**
     * ULID 26자 생성
     * @since 2025.12.28
     * @return String
     */
    public String newUlid() {
        long time = System.currentTimeMillis();

        // 48-bit time + 80-bit randomness = 128 bits -> 26 chars base32
        byte[] data = new byte[16];

        data[0] = (byte) (time >>> 40);
        data[1] = (byte) (time >>> 32);
        data[2] = (byte) (time >>> 24);
        data[3] = (byte) (time >>> 16);
        data[4] = (byte) (time >>> 8);
        data[5] = (byte) (time);

        byte[] rnd = new byte[10];
        RND.nextBytes(rnd);
        System.arraycopy(rnd, 0, data, 6, 10);

        return encodeBase32(data);
    }

    private String encodeBase32(byte[] data) {

        // 128 bits -> 26 chars (130 bits, top 2 bits are zero)
        char[] out = new char[26];

        int index = 0;
        int buffer = 0;
        int bitsLeft = 0;

        for (byte b : data) {
            buffer = (buffer << 8) | (b & 0xFF);
            bitsLeft += 8;
            while (bitsLeft >= 5) {
                int val = (buffer >> (bitsLeft - 5)) & 31;
                bitsLeft -= 5;
                out[index++] = ENCODING[val];
            }
        }

        if (index < 26) {
            int val = (buffer << (5 - bitsLeft)) & 31;
            out[index++] = ENCODING[val];
        }

        while (index < 26) {
            out[index++] = ENCODING[0];
        }
        return new String(out);
    }
}
