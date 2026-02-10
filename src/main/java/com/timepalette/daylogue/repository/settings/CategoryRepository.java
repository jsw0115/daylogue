package com.timepalette.daylogue.repository.settings;

import com.timepalette.daylogue.model.entity.settings.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, String> {

    // 만약 서비스 로직에서 특정 키로 설정을 찾는 기능이 필요하다면 다음과 같은 메소드를 추가할 수 있습니다.
    // Optional<Setting> findBySettingKey(String settingKey);
    // SET-007: 시스템 기본(NULL) + 내 카테고리 조회 (인덱스: ix_cat_user, ix_cat_ord 활용)
    @Query("SELECT c FROM CategoryEntity c " +
		    "WHERE (c.userId IS NULL OR c.userId = :userId) " +
		    "AND c.st = 'ACTIVE' " +
		    "ORDER BY c.ord ASC, c.name ASC")
    List<CategoryEntity> findAllMerged(@Param("userId") String userId);

	// 사용자 커스텀 카테고리만 조회
	List<CategoryEntity> findAllByUserIdAndStOrderByOrdAsc(String userId, CategoryEntity.Status st);

	// 단건 조회 시 권한 체크 포함 (내 것이거나 시스템 것이거나)
	@Query("SELECT c FROM CategoryEntity c WHERE c.id = :id AND (c.userId = :userId OR c.userId IS NULL)")
	Optional<CategoryEntity> findByIdAndAccessCheck(@Param("id") String id, @Param("userId") String userId);

	// 중복 이름 체크 (uk_cat_user_name 대응)
	boolean existsByUserIdAndName(String userId, String name);
}