package com.timepalette.daylogue.service.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.device.UserDeviceDto;
import com.timepalette.daylogue.model.dto.settings.device.UserDeviceUpsertRequest;

import java.util.List;

public interface UserDeviceService {

	/** (등록/갱신) device_id 기준으로 upsert 하며 push_tok/app_ver 등을 갱신한다. */
	ResponseResultModel registerOrUpdate(String userId, UserDeviceUpsertRequest req);

	/** (목록) 사용자의 기기 목록을 조회한다. (보안 설정/기기관리 화면) */
	ResponseResultModel listDevices(String userId);

	/** (활동 기록) last_seen_utc 를 갱신한다. (앱 사용 중 주기적 호출/특정 API에서 처리) */
	ResponseResultModel touchLastSeen(String userId, String deviceId);

	/** (해지) 기기를 해지 처리한다. (revoked_utc set) */
	ResponseResultModel revoke(String userId, String deviceId);

	/** (푸시 토큰 갱신) 푸시 토큰만 교체한다. */
	ResponseResultModel updatePushToken(String userId, String deviceId, String pushToken);
}
