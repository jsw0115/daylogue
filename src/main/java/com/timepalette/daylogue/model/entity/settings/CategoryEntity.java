package com.timepalette.daylogue.model.entity.settings;

import com.timepalette.daylogue.model.entity.common.UtcCreatedUpdatedEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "category")
public class CategoryEntity extends UtcCreatedUpdatedEntity {

	@Id
	@Column(name = "id", length = 26, nullable = false)
	private String id;

	@Column(name = "user_id", length = 26)
	private String userId; // null이면 시스템 기본

	@Column(name = "name", length = 60, nullable = false)
	private String name;

	@Column(name = "color", length = 7, nullable = false)
	private String color; // #RRGGBB

	@Column(name = "icon", length = 16)
	private String icon;

	@Column(name = "ord", nullable = false)
	private int ord;
}
