package com.timepalette.daylogue.repository.settings;

import com.timepalette.daylogue.model.entity.settings.UserStickerPackEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserStickerPackRepository extends JpaRepository<UserStickerPackEntity, String> {
	// N+1 방지: pack 정보를 함께 로딩
	@EntityGraph(attributePaths = "pack")
	List<UserStickerPackEntity> findAllByUserId(String userId);

	Optional<UserStickerPackEntity> findByUserIdAndPackId(String userId, String packId);
}
