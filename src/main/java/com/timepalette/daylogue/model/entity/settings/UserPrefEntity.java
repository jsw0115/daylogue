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
	private String startScr;

	@Column(name = "date_fmt", length = 32, nullable = false)
	private String dateFmt;

	@Column(name = "time_fmt", nullable = false)
	private String timeFmt; // "24h" | "12h"

	@Column(name = "theme_id", length = 64, nullable = false)
	private String themeId;

	// 알림
	@Column(name = "push_on", nullable = false)
	private boolean pushOn;

	@Column(name = "email_on", nullable = false)
	private boolean emailOn;

	@Column(name = "inapp_on", nullable = false)
	private boolean inappOn;

	@Column(name = "dnd_s", length = 5)
	private String dndS; // HH:mm

	@Column(name = "dnd_e", length = 5)
	private String dndE; // HH:mm

	// 공유 기본값
	@Column(name = "def_edit_sc", nullable = false)
	private String defEditSc; // "single"|"future"

	@Column(name = "def_del_sc", nullable = false)
	private String defDelSc; // "none"|"single"|"future"

	@Column(name = "editor_del", nullable = false)
	private boolean editorDel;

	@Column(name = "max_edit_sc", nullable = false)
	private String maxEditSc; // "single"|"future"

	@Column(name = "max_del_sc", nullable = false)
	private String maxDelSc; // "none"|"single"|"future"

	@Column(name = "u_at", nullable = false, columnDefinition = "DATETIME(3)")
	private LocalDateTime uAt;

	@PrePersist
	public void prePersist() {
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		if (uAt == null) uAt = now;

		// DB 기본값과 동일하게 초기화(레코드 없을 때 생성용)
		if (mode == null) mode = "B";
		if (startScr == null) startScr = "home";
		if (dateFmt == null) dateFmt = "YYYY-MM-DD";
		if (timeFmt == null) timeFmt = "24h";
		if (themeId == null) themeId = "default";
		// 알림
		// boolean은 default false라 DDL과 일치시키려면 명시 세팅 필요
		// 하지만 create 시점에 서비스에서 세팅해도 됨.
		if (defEditSc == null) defEditSc = "future";
		if (defDelSc == null) defDelSc = "none";
		if (maxEditSc == null) maxEditSc = "future";
		if (maxDelSc == null) maxDelSc = "future";
	}

	@PreUpdate
	public void preUpdate() {
		this.uAt = LocalDateTime.now(ZoneOffset.UTC);
	}

}
