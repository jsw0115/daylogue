package com.timepalette.daylogue.model.entity.settings;

import com.timepalette.daylogue.model.entity.settings.enums.SupportTicketStatus;
import com.timepalette.daylogue.model.entity.settings.enums.SupportTicketType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Entity
@Table(
		name = "support_ticket",
		indexes = {
				@Index(name = "ix_st_user", columnList = "user_id"),
				@Index(name = "ix_st_st", columnList = "st"),
				@Index(name = "ix_st_c", columnList = "c_at")
		}
)
@Getter
@Setter
public class SupportTicketEntity {

	@Id
	@Column(name = "id", length = 26, nullable = false)
	private String id;

	@Column(name = "user_id", length = 26, nullable = false)
	private String userId;

	@Enumerated(EnumType.STRING)
	@Column(name = "typ", nullable = false, length = 16)
	private SupportTicketType typ = SupportTicketType.OTHER;

	@Enumerated(EnumType.STRING)
	@Column(name = "st", nullable = false, length = 16)
	private SupportTicketStatus st = SupportTicketStatus.OPEN;

	@Column(name = "title", length = 200, nullable = false)
	private String title;

	@Lob
	@Column(name = "body", nullable = false, columnDefinition = "LONGTEXT")
	private String body;

	@Lob
	@Column(name = "meta_json", columnDefinition = "LONGTEXT")
	private String metaJson;

	@Column(name = "c_at", nullable = false, columnDefinition = "DATETIME(3)")
	private LocalDateTime cAt;

	@Column(name = "u_at", nullable = false, columnDefinition = "DATETIME(3)")
	private LocalDateTime uAt;

	@PrePersist
	protected void onCreate() {
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		if (this.cAt == null) this.cAt = now;
		this.uAt = now;
	}

	@PreUpdate
	protected void onUpdate() {
		this.uAt = LocalDateTime.now(ZoneOffset.UTC);
	}
}
