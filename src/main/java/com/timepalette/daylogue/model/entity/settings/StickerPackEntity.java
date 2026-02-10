package com.timepalette.daylogue.model.entity.settings;

import com.timepalette.daylogue.model.entity.common.UtcCreatedUpdatedEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
		name = "sticker_pack",
		uniqueConstraints = {
				@UniqueConstraint(name = "uk_sp_code", columnNames = {"code"})
		},
		indexes = {
				@Index(name = "ix_sp_enabled_ord", columnList = "enabled,ord")
		}
)
@Getter
@Setter
public class StickerPackEntity extends UtcCreatedUpdatedEntity {

	@Id
	@Column(name = "id", length = 26, nullable = false)
	private String id;

	@Column(name = "code", length = 64, nullable = false)
	private String code;

	@Column(name = "name", length = 80, nullable = false)
	private String name;

	@Column(name = "enabled", nullable = false, columnDefinition = "TINYINT(1)")
	private boolean enabled = true;

	@Column(name = "ord", nullable = false)
	private int ord = 0;

	@Lob
	@Column(name = "meta_json", columnDefinition = "LONGTEXT")
	private String metaJson;

}
