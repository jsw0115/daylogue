package com.timepalette.daylogue.service.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.SettingsAuditLogDto;
import com.timepalette.daylogue.model.dto.settings.SettingsAuditQuery;

import java.util.List;

public interface SettingsAuditService {

	/** (로그 기록) 설정 변경 이벤트를 감사 로그로 기록한다. */
	ResponseResultModel append(String userId, String area, String action, String diffJson);

	/** (조회) 사용자별 설정 변경 이력을 조회한다. (기간/영역 필터) */
	ResponseResultModel listByUser(String userId, SettingsAuditQuery query);

	/** (조회) 영역별(예: DASH) 변경 로그를 조회한다. (관리자/운영용) */
	ResponseResultModel listByArea(String area, SettingsAuditQuery query);

}
