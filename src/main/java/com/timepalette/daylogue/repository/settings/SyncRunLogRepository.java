package com.timepalette.daylogue.repository.settings;

import com.timepalette.daylogue.model.entity.settings.SyncRunLogEntity;
import com.timepalette.daylogue.model.entity.settings.enums.ExtCalProvider;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SyncRunLogRepository extends JpaRepository<SyncRunLogEntity, String> {
	// 최근 로그 조회 (startedUtc 내림차순 + Pageable로 limit 처리)
	List<SyncRunLogEntity> findAllByUserIdAndProviderOrderByStartedUtcDesc(String userId, ExtCalProvider provider, Pageable pageable);
}