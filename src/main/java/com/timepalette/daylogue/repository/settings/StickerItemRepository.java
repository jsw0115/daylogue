package com.timepalette.daylogue.repository.settings;

import com.timepalette.daylogue.model.entity.settings.StickerItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StickerItemRepository extends JpaRepository<StickerItemEntity, String> {
	// 팩 상세 조회
	List<StickerItemEntity> findAllByPackIdOrderByOrdAsc(String packId);
}
