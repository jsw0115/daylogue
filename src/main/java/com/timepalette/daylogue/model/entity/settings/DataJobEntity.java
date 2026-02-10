package com.timepalette.daylogue.model.entity.settings;

import com.timepalette.daylogue.model.entity.settings.enums.DataJobFormat;
import com.timepalette.daylogue.model.entity.settings.enums.DataJobStatus;
import com.timepalette.daylogue.model.entity.settings.enums.DataJobType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Entity
@Table(
		name = "data_job",
		indexes = {
				@Index(name = "ix_dj_user_st", columnList = "user_id,st"),
				@Index(name = "ix_dj_user_typ", columnList = "user_id,typ"),
				@Index(name = "ix_dj_c", columnList = "c_at")
		}
)
@Getter
@Setter
public class DataJobEntity {

	@Id
	@Column(name = "id", length = 26, nullable = false)
	private String id;

	@Column(name = "user_id", length = 26, nullable = false)
	private String userId;

	@Enumerated(EnumType.STRING)
	@Column(name = "typ", nullable = false, length = 16)
	private DataJobType typ;

	@Enumerated(EnumType.STRING)
	@Column(name = "fmt", nullable = false, length = 16)
	private DataJobFormat fmt;

	@Enumerated(EnumType.STRING)
	@Column(name = "st", nullable = false, length = 16)
	private DataJobStatus st = DataJobStatus.PENDING;

	@Lob
	@Column(name = "params_json", columnDefinition = "LONGTEXT")
	private String paramsJson;

	@Column(name = "result_file_id", length = 26)
	private String resultFileId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "result_file_id", referencedColumnName = "id", insertable = false, updatable = false)
	private DataFileEntity resultFile;

	@Column(name = "err_msg", length = 500)
	private String errMsg;

	@Column(name = "c_at", nullable = false, columnDefinition = "DATETIME(3)")
	private LocalDateTime cAt;

	@Column(name = "s_utc", columnDefinition = "DATETIME(3)")
	private LocalDateTime sUtc;

	@Column(name = "e_utc", columnDefinition = "DATETIME(3)")
	private LocalDateTime eUtc;

	@PrePersist
	protected void onCreate() {
		if (this.cAt == null) this.cAt = LocalDateTime.now(ZoneOffset.UTC);
	}

}
