package com.timepalette.daylogue.service.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.external.*;

import java.util.List;

public interface ExternalCalendarService {

	/** (연동 계정 목록) 유저의 외부 캘린더 연동 계정들을 조회한다. */
	ResponseResultModel listAccounts(String userId);

	/** (연동 계정 조회) provider별 계정 1건을 조회한다. */
	ResponseResultModel getAccount(String userId, String provider);

	/** (연동 상태 변경) CONNECTED/REVOKED/ERROR 상태를 갱신한다. */
	ResponseResultModel updateAccountStatus(String userId, String provider, String status, String metaJson);

	/** (동기화 실행 요청) 수동 동기화 실행을 요청한다. (실제 sync는 워커/배치로) */
	ResponseResultModel requestSync(String userId, String provider);

	/** (동기화 로그 목록) 마지막 동기화/내역 UI용 로그를 조회한다. */
	ResponseResultModel listSyncLogs(String userId, String provider, int limit);

	/** (충돌 해결 기록/반영) 충돌 해결 UI에서 선택 결과를 반영한다. (정책/구현 단계에 따라) */
	ResponseResultModel resolveConflicts(String userId, String provider, ConflictResolveRequest req);
}
