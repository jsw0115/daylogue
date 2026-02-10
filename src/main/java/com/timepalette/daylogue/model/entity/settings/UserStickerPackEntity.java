package com.timepalette.daylogue.model.entity.settings;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Entity
@Table(
		name = "user_sticker_pack",
		uniqueConstraints = {
				@UniqueConstraint(name = "uk_usp_user_pack", columnNames = {"user_id", "pack_id"})
		},
		indexes = {
				@Index(name = "ix_usp_user_inst", columnList = "user_id,installed")
		}
)
@Getter
@Setter
public class UserStickerPackEntity {

	@Id
	@Column(name = "id", length = 26, nullable = false)
	private String id;

	@Column(name = "user_id", length = 26, nullable = false)
	private String userId;

	@Column(name = "pack_id", length = 26, nullable = false)
	private String packId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pack_id", referencedColumnName = "id", insertable = false, updatable = false)
	private StickerPackEntity pack;

	@Column(name = "installed", nullable = false, columnDefinition = "TINYINT(1)")
	private boolean installed = true;

	@Column(name = "pinned", nullable = false, columnDefinition = "TINYINT(1)")
	private boolean pinned = false;

	@Column(name = "`at`", nullable = false, columnDefinition = "DATETIME(3)")
	private LocalDateTime at;

	@PrePersist
	protected void onCreate() {
		if (this.at == null) this.at = LocalDateTime.now(ZoneOffset.UTC);
	}

}
