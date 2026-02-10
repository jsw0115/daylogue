package com.timepalette.daylogue.model.entity.settings;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
		name = "settings_audit_log",
		indexes = {
				@Index(name = "ix_sal_user_at", columnList = "user_id,at_utc"),
				@Index(name = "ix_sal_area_at", columnList = "area,at_utc")
		}
)
@Getter
@Setter
public class SettingsAuditLogEntity {

	@Id
	@Column(name = "id", length = 26, nullable = false)
	private String id;

	@Column(name = "user_id", length = 26, nullable = false)
	private String userId;

	@Column(name = "area", length = 32, nullable = false)
	private String area; // GENERAL/NOTIF/THEME/CATEGORY/DASH ...

	@Column(name = "action", length = 32, nullable = false)
	private String action; // UPDATE/ADD/DELETE ...

	@Lob
	@Column(name = "diff_json", columnDefinition = "LONGTEXT")
	private String diffJson;

	@Column(name = "at_utc", nullable = false, columnDefinition = "DATETIME(3)")
	private LocalDateTime atUtc;

	@PrePersist
	protected void onCreate() {
		if (this.atUtc == null) this.atUtc = LocalDateTime.now(ZoneOffset.UTC);
	}
}
