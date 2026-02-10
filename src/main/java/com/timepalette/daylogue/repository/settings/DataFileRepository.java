package com.timepalette.daylogue.repository.settings;

import com.timepalette.daylogue.model.entity.settings.DataFileEntity;
import com.timepalette.daylogue.model.entity.settings.enums.DataFileKind;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DataFileRepository extends JpaRepository<DataFileEntity, String> {
	// 파일 목록 (종류별)
	Page<DataFileEntity> findAllByUserIdAndKind(String userId, DataFileKind kind, Pageable pageable);

	// 파일 단건 조회 (다운로드 시 소유권 확인)
	Optional<DataFileEntity> findByIdAndUserId(String id, String userId);
}
