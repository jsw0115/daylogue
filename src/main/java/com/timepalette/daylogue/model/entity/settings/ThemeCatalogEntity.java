package com.timepalette.daylogue.model.entity.settings;

import com.timepalette.daylogue.model.entity.common.UtcCreatedUpdatedEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Entity
@Table(name = "theme_catalog")
@Getter
@Setter
public class ThemeCatalogEntity extends UtcCreatedUpdatedEntity {

	@Id
	@Column(name = "id", length = 64, nullable = false)
	private String id; // dark/light/pastel

	@Column(name = "name", length = 80, nullable = false)
	private String name;

	@Column(name = "enabled", nullable = false, columnDefinition = "TINYINT(1)")
	private boolean enabled = true;

	@Column(name = "ord", nullable = false)
	private int ord = 0;

	@Lob
	@Column(name = "meta_json", columnDefinition = "LONGTEXT")
	private String metaJson;

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
