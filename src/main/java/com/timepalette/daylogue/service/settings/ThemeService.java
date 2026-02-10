package com.timepalette.daylogue.service.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.theme.ThemeSetDataModel;

import java.util.List;

public interface ThemeService {

	/** (테마 목록) 사용 가능한 테마 목록을 조회한다. (theme_catalog.enabled=1) */
	ResponseResultModel listEnabledThemes();

	/** (현재 테마 조회) 유저의 theme_id를 조회한다. */
	ResponseResultModel getUserThemeId(String userId);

	/** (테마 변경) 유저의 theme_id를 변경한다. (존재/enabled 검증) */
	ResponseResultModel updateUserTheme(String userId, String themeId);

	/** (검증) themeId가 존재하며 enabled인지 검증한다. */
	ResponseResultModel validateThemeId(String themeId);
}
