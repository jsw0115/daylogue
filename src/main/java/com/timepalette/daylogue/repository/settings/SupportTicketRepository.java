package com.timepalette.daylogue.repository.settings;

import com.timepalette.daylogue.model.entity.settings.SupportTicketEntity;
import com.timepalette.daylogue.model.entity.settings.enums.SupportTicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicketEntity, String> {
	// 내 문의 내역 (상태 필터링 가능)
	Page<SupportTicketEntity> findAllByUserIdAndSt(String userId, SupportTicketStatus st, Pageable pageable);

	// 상태 필터 없을 때
	Page<SupportTicketEntity> findAllByUserId(String userId, Pageable pageable);

	// 상세 조회 (소유권 체크)
	Optional<SupportTicketEntity> findByIdAndUserId(String id, String userId);
}
