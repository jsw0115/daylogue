package com.timepalette.daylogue.model.entity.auth;

import com.timepalette.daylogue.model.entity.common.UtcCreatedEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * auth_db.refresh_token
 * @since 2025.12.27
 */
@Entity
@Getter
@Setter
@Table(
        name = "refresh_token",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_rt_hash", columnNames = {"tok_hash"})
        },
        indexes = {
                @Index(name = "ix_rt_user", columnList = "user_id"),
                @Index(name = "ix_rt_exp", columnList = "exp_utc"),
                @Index(name = "ix_rt_rev", columnList = "rev_utc"),
                @Index(name = "ix_rt_user_dev", columnList = "user_id,device_id"),
                @Index(name = "ix_rt_last_used", columnList = "last_used_utc")
        }
)
public class RefreshToken extends UtcCreatedEntity {

        @Id
        @Column(name = "id", length = 26, nullable = false)
        private String id;

        @Column(name = "user_id", length = 26, nullable = false)
        private String userId;

        @Column(name = "tok_hash", length = 255, nullable = false)
        private String tokHash;

        @Column(name = "exp_utc", nullable = false, columnDefinition = "DATETIME(3)")
        private LocalDateTime expUtc;

        @Column(name = "rev_utc", columnDefinition = "DATETIME(3)")
        private LocalDateTime revUtc;

        @Column(name = "device_id", length = 128)
        private String deviceId;

        @Column(name = "jti", length = 36)
        private String jti;

        @Column(name = "last_used_utc", columnDefinition = "DATETIME(3)")
        private LocalDateTime lastUsedUtc;
}
