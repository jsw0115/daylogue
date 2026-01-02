package com.timepalette.daylogue.model.entity.auth;

import com.timepalette.daylogue.model.entity.common.UtcCreatedEntity;
import com.timepalette.daylogue.model.enums.auth.SocialProvider;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * auth_db.oauth_state
 * @since 2025.12.27
 */
@Entity
@Getter
@Setter
@Table(
        name = "oauth_state",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_os_state", columnNames = {"state"})
        },
        indexes = {
                @Index(name = "ix_os_exp", columnList = "exp_utc"),
                @Index(name = "ix_os_used", columnList = "used_utc")
        }
)
public class OauthState extends UtcCreatedEntity {

        @Id
        @Column(name = "id", length = 26, nullable = false)
        private String id;

        @Enumerated(EnumType.STRING)
        @Column(name = "provider", nullable = false, length = 16)
        private SocialProvider provider;

        @Column(name = "state", length = 128, nullable = false)
        private String state;

        @Column(name = "code_vfy_hash", length = 255)
        private String codeVfyHash;

        @Column(name = "redirect_uri", length = 512)
        private String redirectUri;

        @Column(name = "exp_utc", nullable = false, columnDefinition = "DATETIME(3)")
        private LocalDateTime expUtc;

        @Column(name = "used_utc", columnDefinition = "DATETIME(3)")
        private LocalDateTime usedUtc;
}
