package com.timepalette.daylogue.repository.settings;

import com.timepalette.daylogue.model.entity.settings.UserDeviceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDeviceRepository extends JpaRepository<UserDeviceEntity, String> {
	// 기기 식별 및 푸시 토큰 갱신용
	Optional<UserDeviceEntity> findByUserIdAndDeviceId(String userId, String deviceId);

	// 사용자 기기 목록 (로그인 관리 등)
	List<UserDeviceEntity> findAllByUserIdOrderByLastSeenUtcDesc(String userId);
}
