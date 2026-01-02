package com.timepalette.daylogue.model.entity.auth;

import com.timepalette.daylogue.model.enums.auth.AuthAuditEvent;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

/**
 * auth_db.auth_audit_log
 * @since 2025.12.27
 */
@Entity
@Getter
@Setter
@Table(
        name = "auth_audit_log",
        indexes = {
                @Index(name = "ix_aal_user_at", columnList = "user_id,at_utc"),
                @Index(name = "ix_aal_evt_at", columnList = "evt,at_utc"),
                @Index(name = "ix_aal_at", columnList = "at_utc")
        }
)
public class AuthAuditLog {

        @Id
        @Column(name = "id", length = 26, nullable = false)
        private String id;

        @Column(name = "user_id", length = 26)
        private String userId;

        @Enumerated(EnumType.STRING)
        @Column(name = "evt", nullable = false, length = 32)
        private AuthAuditEvent evt;

        @Column(name = "ip", length = 45)
        private String ip;

        @Column(name = "ua", length = 255)
        private String ua;

        @Lob
        @Column(name = "meta_json", columnDefinition = "LONGTEXT")
        private String metaJson;

        @Column(name = "at_utc", nullable = false, columnDefinition = "DATETIME(3)")
        private LocalDateTime atUtc;

        @PrePersist
        protected void onCreate() {
                if (this.atUtc == null) {
                        this.atUtc = LocalDateTime.now(ZoneOffset.UTC);
                }
        }
}
