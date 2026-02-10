package com.timepalette.daylogue.model.entity.settings;

import com.timepalette.daylogue.model.entity.settings.enums.ImportSourceType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Entity
@Table(
		name = "import_mapping_profile",
		indexes = {
				@Index(name = "ix_imp_user", columnList = "user_id"),
				@Index(name = "ix_imp_user_src", columnList = "user_id,src_typ")
		}
)
@Getter
@Setter
public class ImportMappingProfileEntity {

	@Id
	@Column(name = "id", length = 26, nullable = false)
	private String id;

	@Column(name = "user_id", length = 26, nullable = false)
	private String userId;

	@Enumerated(EnumType.STRING)
	@Column(name = "src_typ", nullable = false, length = 16)
	private ImportSourceType srcTyp;

	@Column(name = "name", length = 100, nullable = false)
	private String name;

	@Lob
	@Column(name = "map_json", nullable = false, columnDefinition = "LONGTEXT")
	private String mapJson;

	@Lob
	@Column(name = "rule_json", columnDefinition = "LONGTEXT")
	private String ruleJson;

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
