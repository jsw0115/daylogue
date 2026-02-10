package com.timepalette.daylogue.serviceImpl.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.SettingsAuditLogDto;
import com.timepalette.daylogue.model.dto.settings.SettingsAuditQuery;
import com.timepalette.daylogue.service.settings.SettingsAuditService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SettingsAuditServiceImpl implements SettingsAuditService {

	/**
	 * (로그 기록) 설정 변경 이벤트를 감사 로그로 기록한다.
	 */
	@Override
	public ResponseResultModel append(String userId, String area, String action, String diffJson) {
		// 1. 감사 로그 엔티티 생성
		// 2. userId, area, action, diffJson 및 현재 시간 등 정보 설정
		// 3. DB에 로그 저장
		// 4. 성공 여부 반환 (보통 비동기 처리하므로 성공으로 간주)
		ResponseResultModel result = new ResponseResultModel();
		ResponseResultModel data = new ResponseResultModel();
		return result;
	}

	/**
	 * (조회) 사용자별 설정 변경 이력을 조회한다. (기간/영역 필터)
	 */
	@Override
	public ResponseResultModel listByUser(String userId, SettingsAuditQuery query) {
		// 1. userId와 쿼리(기간, 영역 필터)를 기반으로 DB에서 로그 조회
		// 2. 페이징 처리
		// 3. 조회된 로그를 DTO 리스트로 변환
		// 4. 결과 반환
		ResponseResultModel result = new ResponseResultModel();
		List<SettingsAuditLogDto> data = List.of();
		result.data = data;
		return result;
	}

	/**
	 * (조회) 영역별(예: DASH) 변경 로그를 조회한다. (관리자/운영용)
	 */
	@Override
	public ResponseResultModel listByArea(String area, SettingsAuditQuery query) {
		// 1. area와 쿼리(기간 등)를 기반으로 DB에서 로그 조회
		// 2. 페이징 처리
		// 3. 조회된 로그를 DTO 리스트로 변환
		// 4. 결과 반환
		ResponseResultModel result = new ResponseResultModel();
		List<SettingsAuditLogDto> data = List.of();
		result.data = data;
		return result;
	}
}
