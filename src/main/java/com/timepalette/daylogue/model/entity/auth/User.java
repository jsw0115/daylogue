package com.timepalette.daylogue.model.entity.auth;

import com.timepalette.daylogue.model.entity.common.UtcCreatedUpdatedEntity;
import com.timepalette.daylogue.model.enums.auth.UserRole;
import com.timepalette.daylogue.model.enums.auth.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDateTime;

/**
 * auth_db.users
 * @since 2025.12.27
 */
@Entity
@Getter
@Setter
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_users_email", columnNames = {"email"})
        },
        indexes = {
                @Index(name = "ix_users_st", columnList = "st")
        }
)
public class User extends UtcCreatedUpdatedEntity {

    @Id
    @Column(name = "id", length = 26, nullable = false)
    private String id;

    @Column(name = "email", length = 255, nullable = false)
    private String email;

    @Column(name = "pw_hash", length = 255, nullable = false)
    private String pwHash;

    @Column(name = "nick", length = 80, nullable = false)
    private String nick;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 16)
    private UserRole role = UserRole.USER;

    @Enumerated(EnumType.STRING)
    @Column(name = "st", nullable = false, length = 16)
    private UserStatus st = UserStatus.ACTIVE;

    @Column(name = "tz", length = 64, nullable = false)
    private String tz = "Asia/Seoul";

    @Column(name = "d_at", columnDefinition = "DATETIME(3)")
    private LocalDateTime dAt;

    @Column(name = "email_vfy", nullable = false, columnDefinition = "TINYINT(1)")
    private boolean emailVfy;

    @Column(name = "last_login_utc", columnDefinition = "DATETIME(3)")
    private LocalDateTime lastLoginUtc;

    @Column(name = "pw_chg_utc", columnDefinition = "DATETIME(3)")
    private LocalDateTime pwChgUtc;
}
