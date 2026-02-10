package com.timepalette.daylogue.model.entity.settings;

import com.timepalette.daylogue.model.entity.settings.enums.ExtCalProvider;
import com.timepalette.daylogue.model.entity.settings.enums.SyncRunStatus;
import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
		name = "sync_run_log",
		indexes = {
				@Index(name = "ix_srl_user_time", columnList = "user_id,started_utc"),
				@Index(name = "ix_srl_user_provider", columnList = "user_id,provider")
		}
)
@Getter
@Setter
public class SyncRunLogEntity {

	@Id
	@Column(name = "id", length = 26, nullable = false)
	private String id;

	@Column(name = "user_id", length = 26, nullable = false)
	private String userId;

	@Enumerated(EnumType.STRING)
	@Column(name = "provider", nullable = false, length = 16)
	private ExtCalProvider provider;

	@Enumerated(EnumType.STRING)
	@Column(name = "st", nullable = false, length = 16)
	private SyncRunStatus st;

	@Column(name = "started_utc", nullable = false, columnDefinition = "DATETIME(3)")
	private LocalDateTime startedUtc;

	@Column(name = "ended_utc", nullable = false, columnDefinition = "DATETIME(3)")
	private LocalDateTime endedUtc;

	@Column(name = "pulled_cnt", nullable = false)
	private int pulledCnt = 0;

	@Column(name = "pushed_cnt", nullable = false)
	private int pushedCnt = 0;

	@Column(name = "conflict_cnt", nullable = false)
	private int conflictCnt = 0;

	@Column(name = "err_msg", length = 500)
	private String errMsg;

	@Lob
	@Column(name = "meta_json", columnDefinition = "LONGTEXT")
	private String metaJson;
}
