package com.timepalette.daylogue.repository.settings;

import com.timepalette.daylogue.model.entity.settings.DashLayoutEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DashLayoutRepository extends JpaRepository<DashLayoutEntity, String> {
	// 특정 스코프의 모든 BP 레이아웃 조회
	List<DashLayoutEntity> findAllByUserIdAndScope(String userId, DashLayoutEntity.Scope scope);

	// 특정 BP 레이아웃 단건 조회 (Upsert용)
	Optional<DashLayoutEntity> findByUserIdAndScopeAndBp(String userId, DashLayoutEntity.Scope scope, String bp);

	// 초기화용 삭제
	void deleteByUserIdAndScope(String userId, DashLayoutEntity.Scope scope);
}
