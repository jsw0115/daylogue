package com.timepalette.daylogue.repository.settings;

import com.timepalette.daylogue.model.entity.settings.NotifPrefEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotifPrefRepository extends JpaRepository<NotifPrefEntity, String> {
	// 전체 유형별 설정 조회
	List<NotifPrefEntity> findAllByUserId(String userId);

	// 특정 이벤트 설정 조회
	Optional<NotifPrefEntity> findByUserIdAndEvt(String userId, String evt);
}
