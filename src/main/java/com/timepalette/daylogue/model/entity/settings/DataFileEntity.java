package com.timepalette.daylogue.model.entity.settings;

import com.timepalette.daylogue.model.entity.settings.enums.DataFileKind;
import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Entity
@Table(
		name = "data_file",
		indexes = {
				@Index(name = "ix_df_user_kind", columnList = "user_id,kind"),
				@Index(name = "ix_df_exp", columnList = "exp_utc")
		}
)
@Getter
@Setter
public class DataFileEntity {

	@Id
	@Column(name = "id", length = 26, nullable = false)
	private String id;

	@Column(name = "user_id", length = 26, nullable = false)
	private String userId;

	@Enumerated(EnumType.STRING)
	@Column(name = "kind", nullable = false, length = 16)
	private DataFileKind kind;

	@Column(name = "filename", length = 255, nullable = false)
	private String filename;

	@Column(name = "mime", length = 100)
	private String mime;

	@Column(name = "size_b", nullable = false)
	private long sizeB = 0L;

	@Column(name = "sha256", length = 64)
	private String sha256;

	@Column(name = "storage_key", length = 512, nullable = false)
	private String storageKey;

	@Column(name = "exp_utc", columnDefinition = "DATETIME(3)")
	private LocalDateTime expUtc;

	@Column(name = "c_at", nullable = false, columnDefinition = "DATETIME(3)")
	private LocalDateTime cAt;

	@PrePersist
	protected void onCreate() {
		if (this.cAt == null) this.cAt = LocalDateTime.now(ZoneOffset.UTC);
	}

}
