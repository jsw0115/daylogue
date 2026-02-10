package com.timepalette.daylogue.repository.settings;

import com.timepalette.daylogue.model.entity.settings.SettingsAuditLogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface SettingsAuditLogRepository extends JpaRepository<SettingsAuditLogEntity, String> {

	// 내 활동 로그 (날짜 범위 필터)
	Page<SettingsAuditLogEntity> findAllByUserIdAndAtUtcBetween(String userId, LocalDateTime start, LocalDateTime end, Pageable pageable);
}
