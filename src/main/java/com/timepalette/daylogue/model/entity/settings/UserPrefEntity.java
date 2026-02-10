package com.timepalette.daylogue.model.entity.settings;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneOffset;


@Entity
@Getter
@Setter
@Table(
		name = "user_pref"
)
public class UserPrefEntity {

	@Id
	@Column(name = "user_id", length = 26, nullable = false)
	private String userId;

	// (DDL 추가 필요) mode ENUM('J','P','B')
	@Column(name = "mode", length = 1, nullable = false)
	private String mode; // "J" | "P" | "B"

	// 일반
	@Column(name = "start_scr", length = 32, nullable = false)
	private String startScr = "home";

	@Column(name = "date_fmt", length = 32, nullable = false)
	private String dateFmt = "YYYY-MM-DD";

	@Enumerated(EnumType.STRING)
	@Column(name = "time_fmt", nullable = false, length = 8)
	private TimeFormat timeFmt = TimeFormat._24h; // "24h" | "12h"

	@Column(name = "theme_id", length = 64, nullable = false)
	private String themeId;

	// 알림
	@Column(name = "push_on", nullable = false, columnDefinition = "TINYINT(1)")
	private boolean pushOn = true;

	@Column(name = "email_on", nullable = false, columnDefinition = "TINYINT(1)")
	private boolean emailOn = false;

	@Column(name = "inapp_on", nullable = false, columnDefinition = "TINYINT(1)")
	private boolean inappOn = true;

	@Column(name = "dnd_s", length = 5)
	private String dndS; // HH:mm

	@Column(name = "dnd_e", length = 5)
	private String dndE; // HH:mm

	// 공유 기본값
	@Enumerated(EnumType.STRING)
	@Column(name = "def_edit_sc", nullable = false, length = 16)
	private EditScope defEditSc = EditScope.future;

	@Enumerated(EnumType.STRING)
	@Column(name = "def_del_sc", nullable = false, length = 16)
	private DeleteScope defDelSc = DeleteScope.none;

	@Column(name = "editor_del", nullable = false, columnDefinition = "TINYINT(1)")
	private boolean editorDel = false;

	@Enumerated(EnumType.STRING)
	@Column(name = "max_edit_sc", nullable = false, length = 16)
	private EditScope maxEditSc = EditScope.future;

	@Enumerated(EnumType.STRING)
	@Column(name = "max_del_sc", nullable = false, length = 16)
	private DeleteScope maxDelSc = DeleteScope.future;

	// 확장(권장)
	@Enumerated(EnumType.STRING)
	@Column(name = "week_start", nullable = false, length = 8)
	private WeekStart weekStart = WeekStart.MON;

	@Column(name = "locale", length = 16, nullable = false)
	private String locale = "ko-KR";

	@Column(name = "time_step_min", nullable = false)
	private int timeStepMin = 10;

	@Enumerated(EnumType.STRING)
	@Column(name = "def_event_vis", nullable = false, length = 16)
	private EventVisibility defEventVis = EventVisibility.PRIVATE;

	@Column(name = "def_event_all_day", nullable = false, columnDefinition = "TINYINT(1)")
	private boolean defEventAllDay = true;

	@Column(name = "def_event_dur_min", nullable = false)
	private int defEventDurMin = 60;

	@Column(name = "def_reminder_min")
	private Integer defReminderMin;

	@Column(name = "overlap_warn_on", nullable = false, columnDefinition = "TINYINT(1)")
	private boolean overlapWarnOn = true;

	// updated timestamp only
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

	public enum TimeFormat { _24h, _12h }
	public enum EditScope { single, future }
	public enum DeleteScope { none, single, future }
	public enum WeekStart { MON, SUN }
	public enum EventVisibility { PRIVATE, FRIENDS, SHARED, PUBLIC }

}
