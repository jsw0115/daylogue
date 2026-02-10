package com.timepalette.daylogue.model.entity.common;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

/**
 * created + updated timestamp 공통
 * @since 2025.12.27
 */
@MappedSuperclass
@Getter
@Setter
public abstract class UtcCreatedUpdatedEntity {

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
