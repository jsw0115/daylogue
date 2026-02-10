package com.timepalette.daylogue.repository.settings;

import com.timepalette.daylogue.model.entity.settings.DashPortletPrefEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DashPortletPrefRepository extends JpaRepository<DashPortletPrefEntity, String > {
	// 포틀릿 설정 전체 조회
	List<DashPortletPrefEntity> findAllByUserIdOrderByOrdAsc(String userId);

	// 특정 포틀릿 설정 조회
	Optional<DashPortletPrefEntity> findByUserIdAndPortletId(String userId, String portletId);
}
