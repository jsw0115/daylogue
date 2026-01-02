package com.timepalette.daylogue.model.entity.auth;

import com.timepalette.daylogue.model.enums.auth.SocialProvider;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * auth_db.social_account
 * @since 2025.12.27
 */
@Entity
@Getter
@Setter
@Table(
        name = "social_account",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_sa_provider_uid", columnNames = {"provider", "provider_uid"})
        },
        indexes = {
                @Index(name = "ix_sa_user", columnList = "user_id"),
                @Index(name = "ix_sa_provider", columnList = "provider"),
                @Index(name = "ix_sa_unlinked", columnList = "unlinked_utc")
        }
)
public class SocialAccount {

        @Id
        @Column(name = "id", length = 26, nullable = false)
        private String id;

        @Column(name = "user_id", length = 26, nullable = false)
        private String userId;

        @Enumerated(EnumType.STRING)
        @Column(name = "provider", nullable = false, length = 16)
        private SocialProvider provider;

        @Column(name = "provider_uid", length = 128, nullable = false)
        private String providerUid;

        @Column(name = "email", length = 255)
        private String email;

        @Column(name = "email_vfy", nullable = false, columnDefinition = "TINYINT(1)")
        private boolean emailVfy;

        @Column(name = "linked_utc", nullable = false, columnDefinition = "DATETIME(3)")
        private LocalDateTime linkedUtc;

        @Column(name = "unlinked_utc", columnDefinition = "DATETIME(3)")
        private LocalDateTime unlinkedUtc;
}
