package com.timepalette.daylogue.model.entity.settings;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Entity
@Table(
		name = "notif_pref",
		uniqueConstraints = {
				@UniqueConstraint(name = "uk_np_user_evt", columnNames = {"user_id", "evt"})
		}
)
@Getter
@Setter
public class NotifPrefEntity {

	@Id
	@Column(name = "id", length = 26, nullable = false)
	private String id;

	@Column(name = "user_id", length = 26, nullable = false)
	private String userId;

	@Column(name = "evt", length = 64, nullable = false)
	private String evt; // EVENT_REMIND, TASK_DUE ...

	@Column(name = "push_on", nullable = false, columnDefinition = "TINYINT(1)")
	private boolean pushOn = true;

	@Column(name = "email_on", nullable = false, columnDefinition = "TINYINT(1)")
	private boolean emailOn = false;

	@Column(name = "inapp_on", nullable = false, columnDefinition = "TINYINT(1)")
	private boolean inappOn = true;

	@Lob
	@Column(name = "cfg_json", columnDefinition = "LONGTEXT")
	private String cfgJson;

	@Column(name = "u_at", nullable = false, columnDefinition = "DATETIME(3)")
	private LocalDateTime uAt;

	@PrePersist
	protected void onCreate() {
		this.uAt = LocalDateTime.now(ZoneOffset.UTC);
	}

	@PreUpdate
	protected void onUpdate() {
		this.uAt = LocalDateTime.now(ZoneOffset.UTC);
	}

}
