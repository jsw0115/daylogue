package com.timepalette.daylogue.service.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.pref.UserPrefDto;
import com.timepalette.daylogue.model.dto.settings.pref.UserPrefGeneralPatchRequest;
import com.timepalette.daylogue.model.dto.settings.pref.UserPrefNotificationPatchRequest;
import com.timepalette.daylogue.model.dto.settings.pref.UserPrefShareDefaultsPatchRequest;

public interface UserPrefService {

	/** (조회/생성) user_pref가 없으면 기본값으로 생성 후 반환한다. */
	ResponseResultModel getOrCreate(String userId);

	/** (일반 설정 업데이트) start_scr/date_fmt/time_fmt/mode 등 일반 영역을 부분 업데이트한다. */
	ResponseResultModel updateGeneral(String userId, UserPrefGeneralPatchRequest req);

	/** (알림 전역 업데이트) push_on/email_on/inapp_on/dnd_s/dnd_e 를 부분 업데이트한다. */
	ResponseResultModel updateNotificationGlobal(String userId, UserPrefNotificationPatchRequest req);

	/** (공유 기본값 업데이트) def_edit_sc/def_del_sc/editor_del/max_* 등을 업데이트한다. */
	ResponseResultModel updateShareDefaults(String userId, UserPrefShareDefaultsPatchRequest req);

	/** (테마 업데이트) theme_id 업데이트 (ThemeService 검증 후 호출하는 방식 권장) */
	ResponseResultModel updateTheme(String userId, String themeId);

}
