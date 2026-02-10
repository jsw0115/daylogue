package com.timepalette.daylogue.repository.settings;

import com.timepalette.daylogue.model.entity.settings.ImportMappingProfileEntity;
import com.timepalette.daylogue.model.entity.settings.enums.ImportSourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImportMappingProfileRepository extends JpaRepository<ImportMappingProfileEntity, String> {
	// 소스 타입별 매핑 프로필 목록
	List<ImportMappingProfileEntity> findAllByUserIdAndSrcTyp(String userId, ImportSourceType srcTyp);

	Optional<ImportMappingProfileEntity> findByIdAndUserId(String id, String userId);
}
