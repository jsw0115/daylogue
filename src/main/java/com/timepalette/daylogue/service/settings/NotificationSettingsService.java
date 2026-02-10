package com.timepalette.daylogue.service.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.EffectiveNotificationPolicyDto;
import com.timepalette.daylogue.model.dto.settings.notification.NotificationGlobalDto;
import com.timepalette.daylogue.model.dto.settings.notification.NotificationGlobalPatchRequest;
import com.timepalette.daylogue.model.dto.settings.notification.NotificationTypePrefDto;
import com.timepalette.daylogue.model.dto.settings.notification.NotificationTypePrefUpsertRequest;

import java.util.List;

public interface NotificationSettingsService {

	/** (전역 알림 설정 조회) push/email/inapp + dnd 를 조회한다. (user_pref) */
	ResponseResultModel getGlobal(String userId);

	/** (전역 알림 설정 저장) 전역 알림 설정을 부분 업데이트한다. (PATCH) */
	ResponseResultModel updateGlobal(String userId, NotificationGlobalPatchRequest req);

	/** (유형별 알림 설정 목록) evt별 설정을 조회한다. (notif_pref) */
	ResponseResultModel listTypePrefs(String userId);

	/** (유형별 알림 설정 저장) 특정 evt의 on/off 및 cfg_json을 upsert 한다. */
	ResponseResultModel upsertTypePref(String userId, NotificationTypePrefUpsertRequest req);

	/** (유효 정책 계산) 전역 + 유형별을 조합해 “실제 적용되는 알림 정책”을 계산한다. */
	ResponseResultModel resolveEffectivePolicy(String userId, String evtKey);
}
