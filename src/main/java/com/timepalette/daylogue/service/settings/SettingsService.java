package com.timepalette.daylogue.service.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.*;
import com.timepalette.daylogue.model.dto.settings.category.CategorySetDataModel;
import com.timepalette.daylogue.model.dto.settings.category.CategorySetRequestModel;
import com.timepalette.daylogue.model.dto.settings.notification.NotificationSetDataModel;
import com.timepalette.daylogue.model.dto.settings.notification.NotificationSetRequestModel;
import com.timepalette.daylogue.model.dto.settings.theme.ThemeSetDataModel;
import com.timepalette.daylogue.model.dto.settings.theme.ThemeSetRequestModel;

public interface SettingsService {

	public ResponseResultModel getGeneralSet(GeneralSetRequestModel req);

	public ResponseResultModel updateGeneralSet(GeneralSetRequestModel req);

	public ResponseResultModel getNotificationSet(NotificationSetRequestModel req);

	public ResponseResultModel updateNotificationSet(NotificationSetRequestModel req);

	public ResponseResultModel getThemeSet(ThemeSetRequestModel req);

	public ResponseResultModel updateThemeSet(ThemeSetRequestModel req);

	public ResponseResultModel getCategorySet(CategorySetRequestModel req);

	public ResponseResultModel updateCategorySet(CategorySetRequestModel req);

	public ResponseResultModel getSharingSet(SharingSetRequestModel req);

	public ResponseResultModel updateSharingSet(SharingSetRequestModel req);

//	/** (부트스트랩) 앱 진입 시 필요한 설정 묶음을 한 번에 반환한다. (user_pref, dashboard, themes, categories, notif prefs 등) */
//	SettingsBootstrapDto bootstrap(String userId);
//
//	/** (일반 설정 조회) mode/startScreen/dateFmt/timeFmt 같은 기본 설정을 조회한다. */
//	GeneralSettingsDto getGeneral(String userId);
//
//	/** (일반 설정 저장) 일반 설정을 부분 업데이트한다. */
//	GeneralSettingsDto updateGeneral(String userId, GeneralSettingsPatchRequest req);
//
//	/** (통합 조회) settings 화면에서 한 번에 보여줄 통합 데이터를 반환한다. (탭 UI 초기 로딩 최적화용) */
//	SettingsOverviewDto getOverview(String userId);
}
