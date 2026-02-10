package com.timepalette.daylogue.serviceImpl.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.theme.ThemeSetDataModel;
import com.timepalette.daylogue.service.settings.ThemeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThemeServiceImpl implements ThemeService {

	/**
	 * (테마 목록) 사용 가능한 테마 목록을 조회한다. (theme_catalog.enabled=1)
	 */
	@Override
	public ResponseResultModel listEnabledThemes() {
		// 1. DB에서 활성화된(enabled=true) 테마 목록을 조회합니다.
		// 2. 조회된 엔티티 목록을 DTO 리스트로 변환합니다.
		// 3. 결과를 ResponseResultModel에 담아 반환합니다.
		ResponseResultModel result = new ResponseResultModel();
		List<ThemeSetDataModel> data = List.of();

		result.data = data;
		return result;
	}

	/**
	 * (현재 테마 조회) 유저의 theme_id를 조회한다.
	 */
	@Override
	public ResponseResultModel getUserThemeId(String userId) {
		// 1. userId로 user_pref 테이블에서 사용자의 theme_id를 조회합니다.
		// 2. 만약 설정된 테마가 없다면 기본 테마 ID를 반환합니다.
		// 3. 조회된 theme_id를 ResponseResultModel에 담아 반환합니다.
		ResponseResultModel result = new ResponseResultModel();
		String data = "";
		result.data = data;
		return result;
	}

	/**
	 * (테마 변경) 유저의 theme_id를 변경한다. (존재/enabled 검증)
	 */
	@Override
	public ResponseResultModel updateUserTheme(String userId, String themeId) {
		// 1. 변경하려는 themeId가 유효한지 검증합니다 (validateThemeId 호출).
		// 2. 검증이 성공하면 userId로 user_pref 테이블의 theme_id를 업데이트합니다.
		// 3. 업데이트된 theme_id를 ResponseResultModel에 담아 반환합니다.
		ResponseResultModel result = new ResponseResultModel();
		String data = "";
		result.data = data;
		return result;
	}

	/**
	 * (검증) themeId가 존재하며 enabled인지 검증한다.
	 */
	@Override
	public ResponseResultModel validateThemeId(String themeId) {
		// 1. themeId로 theme_catalog 테이블에서 테마를 조회합니다.
		// 2. 테마가 존재하고 enabled 상태인지 확인합니다.
		// 3. 유효성 검사 결과를 ResponseResultModel에 담아 반환합니다 (성공 또는 실패).
		ResponseResultModel result = new ResponseResultModel();

		return result;
	}
}
