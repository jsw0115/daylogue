package com.timepalette.daylogue.repository.settings;

import com.timepalette.daylogue.model.entity.settings.ThemeCatalogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThemeCatalogRepository extends JpaRepository<ThemeCatalogEntity, String> {
	// 활성화된 테마 목록
	List<ThemeCatalogEntity> findAllByEnabledTrueOrderByOrdAsc();
}
