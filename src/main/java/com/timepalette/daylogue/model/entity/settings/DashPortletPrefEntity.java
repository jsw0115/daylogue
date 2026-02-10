package com.timepalette.daylogue.model.entity.settings;

import com.timepalette.daylogue.model.entity.common.UtcCreatedUpdatedEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Entity
@Table(
		name = "dash_portlet_pref",
		uniqueConstraints = {
				@UniqueConstraint(name = "uk_dpp_user_portlet", columnNames = {"user_id", "portlet_id"})
		},
		indexes = {
				@Index(name = "ix_dpp_user_vis", columnList = "user_id,vis"),
				@Index(name = "ix_dpp_user_ord", columnList = "user_id,ord")
		}
)
@Getter
@Setter
public class DashPortletPrefEntity extends UtcCreatedUpdatedEntity {

	@Id
	@Column(name = "id", length = 26, nullable = false)
	private String id;

	@Column(name = "user_id", length = 26, nullable = false)
	private String userId;

	@Column(name = "portlet_id", length = 64, nullable = false)
	private String portletId;

	@Column(name = "vis", nullable = false, columnDefinition = "TINYINT(1)")
	private boolean vis = true;

	@Column(name = "ord", nullable = false)
	private int ord = 0;

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
