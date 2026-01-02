package com.timepalette.daylogue.model.entity.auth;

import com.timepalette.daylogue.model.enums.auth.ThrottleKeyType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * auth_db.login_throttle
 * @since 2025.12.27
 */
@Entity
@Getter
@Setter
@Table(
        name = "login_throttle",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_lt_key", columnNames = {"key_type", "key_val"})
        },
        indexes = {
                @Index(name = "ix_lt_lock", columnList = "lock_utc"),
                @Index(name = "ix_lt_fail", columnList = "last_fail_utc")
        }
)
public class LoginThrottle {

        @Id
        @Column(name = "id", length = 26, nullable = false)
        private String id;

        @Enumerated(EnumType.STRING)
        @Column(name = "key_type", nullable = false, length = 16)
        private ThrottleKeyType keyType;

        @Column(name = "key_val", nullable = false, length = 255)
        private String keyVal;

        @Column(name = "fail_cnt", nullable = false)
        private int failCnt;

        @Column(name = "lock_utc", columnDefinition = "DATETIME(3)")
        private LocalDateTime lockUtc;

        @Column(name = "last_fail_utc", columnDefinition = "DATETIME(3)")
        private LocalDateTime lastFailUtc;

        @Column(name = "u_at", nullable = false, columnDefinition = "DATETIME(3)")
        private LocalDateTime uAt;
}
