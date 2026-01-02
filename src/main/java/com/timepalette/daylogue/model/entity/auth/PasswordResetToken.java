package com.timepalette.daylogue.model.entity.auth;

import com.timepalette.daylogue.model.entity.common.UtcCreatedEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * auth_db.password_reset_token
 * @since 2025.12.27
 */
@Entity
@Getter
@Setter
@Table(
        name = "password_reset_token",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_prt_hash", columnNames = {"tok_hash"})
        },
        indexes = {
                @Index(name = "ix_prt_user", columnList = "user_id"),
                @Index(name = "ix_prt_exp", columnList = "exp_utc"),
                @Index(name = "ix_prt_used", columnList = "used_utc")
        }
)
public class PasswordResetToken extends UtcCreatedEntity {

        @Id
        @Column(name = "id", length = 26, nullable = false)
        private String id;

        @Column(name = "user_id", length = 26, nullable = false)
        private String userId;

        @Column(name = "tok_hash", length = 255, nullable = false)
        private String tokHash;

        @Column(name = "exp_utc", nullable = false, columnDefinition = "DATETIME(3)")
        private LocalDateTime expUtc;

        @Column(name = "used_utc", columnDefinition = "DATETIME(3)")
        private LocalDateTime usedUtc;
}
