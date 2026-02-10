package com.timepalette.daylogue.model.entity.common;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

/**
 * created timestamp 공통
 * @since 2025.12.27
 */
@MappedSuperclass
@Getter
@Setter
public abstract class UtcCreatedEntity {

    @Column(name = "c_at", nullable = false, columnDefinition = "DATETIME(3)")
    private LocalDateTime cAt;

    @PrePersist
    protected void onCreate() {
        if (this.cAt == null) {
            this.cAt = LocalDateTime.now(ZoneOffset.UTC);
        }
    }
}
