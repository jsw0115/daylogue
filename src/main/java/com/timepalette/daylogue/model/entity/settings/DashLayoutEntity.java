package com.timepalette.daylogue.model.entity.settings;

import com.timepalette.daylogue.model.entity.common.UtcCreatedUpdatedEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
		name = "dash_layout",
		uniqueConstraints = {
				@UniqueConstraint(name = "uk_dl_user_scope_bp", columnNames = {"user_id", "scope", "bp"})
		},
		indexes = {
				@Index(name = "ix_dl_user", columnList = "user_id")
		}
)
@Getter
@Setter
public class DashLayoutEntity extends UtcCreatedUpdatedEntity {

	@Id
	@Column(name = "id", length = 26, nullable = false)
	private String id;

	@Column(name = "user_id", length = 26, nullable = false)
	private String userId;

	@Enumerated(EnumType.STRING)
	@Column(name = "scope", nullable = false, length = 16)
	private Scope scope = Scope.all;

	@Column(name = "bp", length = 16)
	private String bp;

	@Lob
	@Column(name = "json", nullable = false, columnDefinition = "LONGTEXT")
	private String json;

	public enum Scope { all, current }
}
