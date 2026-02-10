package com.timepalette.daylogue.model.entity.settings;

import com.timepalette.daylogue.model.entity.common.UtcCreatedUpdatedEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
	name = "category",
	uniqueConstraints = {
		@UniqueConstraint(name = "uk_cat_user_name", columnNames = {"user_id", "name"})
	},
	indexes = {
		@Index(name = "ix_cat_user", columnList = "user_id"),
		@Index(name = "ix_cat_ord", columnList = "user_id,ord"),
		@Index(name = "ix_cat_parent", columnList = "user_id,parent_id"),
		@Index(name = "ix_cat_st", columnList = "user_id,st")
	}
)
public class CategoryEntity extends UtcCreatedUpdatedEntity {

	@Id
	@Column(name = "id", length = 26, nullable = false)
	private String id;

	@Column(name = "user_id", length = 26)
	private String userId; // null이면 시스템 기본

	@Column(name = "parent_id", length = 26)
	private String parentId;

	@Column(name = "name", length = 60, nullable = false)
	private String name;

	@Column(name = "color", length = 7, nullable = false)
	private String color; // #RRGGBB

	@Column(name = "icon", length = 16)
	private String icon;

	@Column(name = "ord", nullable = false)
	private int ord = 0;


	@Enumerated(EnumType.STRING)
	@Column(name = "scope", nullable = false, length = 16)
	private Scope scope = Scope.ALL;

	@Column(name = "is_pinned", nullable = false, columnDefinition = "TINYINT(1)")
	private boolean pinned = false;

	@Enumerated(EnumType.STRING)
	@Column(name = "st", nullable = false, length = 16)
	private Status st = Status.ACTIVE;

	@Column(name = "d_at", columnDefinition = "DATETIME(3)")
	private LocalDateTime dAt;

	@Column(name = "d_by", length = 26)
	private String dBy;

	public enum Scope { ALL, EVENT, TASK, ROUTINE, MEMO, DIARY }
	public enum Status { ACTIVE, DELETED }
}
