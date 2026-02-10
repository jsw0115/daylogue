package com.timepalette.daylogue.model.entity.settings;

import com.timepalette.daylogue.model.entity.settings.enums.DevicePlatform;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
		name = "user_device",
		uniqueConstraints = {
				@UniqueConstraint(name = "uk_ud_user_device", columnNames = {"user_id", "device_id"})
		},
		indexes = {
				@Index(name = "ix_ud_user_last", columnList = "user_id,last_seen_utc"),
				@Index(name = "ix_ud_user_rev", columnList = "user_id,revoked_utc")
		}
)
@Getter
@Setter
public class UserDeviceEntity {

	@Id
	@Column(name = "id", length = 26, nullable = false)
	private String id;

	@Column(name = "user_id", length = 26, nullable = false)
	private String userId;

	@Column(name = "device_id", length = 128, nullable = false)
	private String deviceId;

	@Enumerated(EnumType.STRING)
	@Column(name = "platform", nullable = false, length = 16)
	private DevicePlatform platform = DevicePlatform.WEB;

	@Column(name = "push_tok", length = 512)
	private String pushTok;

	@Column(name = "app_ver", length = 32)
	private String appVer;

	@Column(name = "last_seen_utc", columnDefinition = "DATETIME(3)")
	private LocalDateTime lastSeenUtc;

	@Column(name = "revoked_utc", columnDefinition = "DATETIME(3)")
	private LocalDateTime revokedUtc;

	@Column(name = "c_at", nullable = false, columnDefinition = "DATETIME(3)")
	private LocalDateTime cAt;

	@Column(name = "u_at", nullable = false, columnDefinition = "DATETIME(3)")
	private LocalDateTime uAt;

	@PrePersist
	protected void onCreate() {
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		if (this.cAt == null) this.cAt = now;
		this.uAt = now;
	}

	@PreUpdate
	protected void onUpdate() {
		this.uAt = LocalDateTime.now(ZoneOffset.UTC);
	}
}
