package com.timepalette.daylogue.model.entity.settings;

import com.timepalette.daylogue.model.entity.settings.enums.ExtCalAccountStatus;
import com.timepalette.daylogue.model.entity.settings.enums.ExtCalProvider;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Entity
@Table(
		name = "ext_cal_account",
		uniqueConstraints = {
				@UniqueConstraint(name = "uk_eca_user_provider", columnNames = {"user_id", "provider"})
		},
		indexes = {
				@Index(name = "ix_eca_user_st", columnList = "user_id,st")
		}
)
@Getter
@Setter
public class ExtCalAccountEntity {

	@Id
	@Column(name = "id", length = 26, nullable = false)
	private String id;

	@Column(name = "user_id", length = 26, nullable = false)
	private String userId;

	@Enumerated(EnumType.STRING)
	@Column(name = "provider", nullable = false, length = 16)
	private ExtCalProvider provider;

	@Enumerated(EnumType.STRING)
	@Column(name = "st", nullable = false, length = 16)
	private ExtCalAccountStatus st = ExtCalAccountStatus.CONNECTED;

	@Column(name = "scopes", length = 500)
	private String scopes;

	@Lob
	@Column(name = "meta_json", columnDefinition = "LONGTEXT")
	private String metaJson;

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
