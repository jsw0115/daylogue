package com.timepalette.daylogue.repository.settings;

import com.timepalette.daylogue.model.entity.settings.DataJobEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DataJobRepository extends JpaRepository<DataJobEntity, String> {
	// 작업 목록 조회 (페이징 + 필터링은 QueryDSL 추천, 여기선 기본 JPQL 예시)
	Page<DataJobEntity> findAllByUserId(String userId, Pageable pageable);

	// 내 작업 단건 조회 (보안)
	Optional<DataJobEntity> findByIdAndUserId(String id, String userId);
}
