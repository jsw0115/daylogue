package com.timepalette.daylogue.model.entity.settings;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
		name = "sticker_item",
		uniqueConstraints = {
				@UniqueConstraint(name = "uk_si_pack_code", columnNames = {"pack_id", "code"})
		},
		indexes = {
				@Index(name = "ix_si_pack_ord", columnList = "pack_id,ord")
		}
)
@Getter
@Setter
public class StickerItemEntity {

	@Id
	@Column(name = "id", length = 26, nullable = false)
	private String id;

	@Column(name = "pack_id", length = 26, nullable = false)
	private String packId;

	/**
	 * pack_id FK를 객체로도 접근하고 싶으면 관계를 추가.
	 * - insert/update는 packId로 하고, 읽기용으로 pack을 매핑(중복 컬럼 방지)
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pack_id", referencedColumnName = "id", insertable = false, updatable = false)
	private StickerPackEntity pack;

	@Column(name = "code", length = 64, nullable = false)
	private String code;

	@Column(name = "label", length = 80)
	private String label;

	@Column(name = "asset_url", length = 512, nullable = false)
	private String assetUrl;

	@Column(name = "ord", nullable = false)
	private int ord = 0;

	@Lob
	@Column(name = "meta_json", columnDefinition = "LONGTEXT")
	private String metaJson;
}
