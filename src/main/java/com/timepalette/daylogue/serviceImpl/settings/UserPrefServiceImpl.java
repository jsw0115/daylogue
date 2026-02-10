package com.timepalette.daylogue.serviceImpl.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.pref.UserPrefDto;
import com.timepalette.daylogue.model.dto.settings.pref.UserPrefGeneralPatchRequest;
import com.timepalette.daylogue.model.dto.settings.pref.UserPrefNotificationPatchRequest;
import com.timepalette.daylogue.model.dto.settings.pref.UserPrefShareDefaultsPatchRequest;
import com.timepalette.daylogue.service.settings.UserPrefService;
import org.springframework.stereotype.Service;

@Service
public class UserPrefServiceImpl implements UserPrefService {
	/**
	 * (조회/생성) user_pref가 없으면 기본값으로 생성 후 반환한다.
	 */
	@Override
	public ResponseResultModel getOrCreate(String userId) {
		// 1. userId로 user_pref 테이블에서 설정 조회
		// 2. 설정이 없으면, 기본값을 가진 새로운 UserPref 엔티티 생성
		// 3. DB에 저장
		// 4. 해당 엔티티를 DTO로 변환하여 반환
		ResponseResultModel result = new ResponseResultModel();
		UserPrefDto data = new UserPrefDto();
		return null;
	}

	/**
	 * (일반 설정 업데이트) start_scr/date_fmt/time_fmt/mode 등 일반 영역을 부분 업데이트한다.
	 */
	@Override
	public ResponseResultModel updateGeneral(String userId, UserPrefGeneralPatchRequest req) {
		// 1. userId로 user_pref 엔티티 조회 (getOrCreate 활용)
		// 2. 요청(req) 객체에서 변경할 필드만 엔티티에 반영 (Patch)
		// 3. DB에 저장
		// 4. 업데이트된 엔티티를 DTO로 변환하여 반환
		ResponseResultModel result = new ResponseResultModel();
		UserPrefDto data = new UserPrefDto();
		return null;
	}

	/**
	 * (알림 전역 업데이트) push_on/email_on/inapp_on/dnd_s/dnd_e 를 부분 업데이트한다.
	 */
	@Override
	public ResponseResultModel updateNotificationGlobal(String userId, UserPrefNotificationPatchRequest req) {
		// 1. userId로 user_pref 엔티티 조회 (getOrCreate 활용)
		// 2. 요청(req) 객체에서 알림 관련 필드만 엔티티에 반영 (Patch)
		// 3. DB에 저장
		// 4. 업데이트된 엔티티를 DTO로 변환하여 반환
		ResponseResultModel result = new ResponseResultModel();
		UserPrefDto data = new UserPrefDto();
		return null;
	}

	/**
	 * (공유 기본값 업데이트) def_edit_sc/def_del_sc/editor_del/max_* 등을 업데이트한다.
	 */
	@Override
	public ResponseResultModel updateShareDefaults(String userId, UserPrefShareDefaultsPatchRequest req) {
		// 1. userId로 user_pref 엔티티 조회 (getOrCreate 활용)
		// 2. 요청(req) 객체에서 공유 기본값 관련 필드만 엔티티에 반영 (Patch)
		// 3. DB에 저장
		// 4. 업데이트된 엔티티를 DTO로 변환하여 반환
		ResponseResultModel result = new ResponseResultModel();
		UserPrefDto data = new UserPrefDto();
		return null;
	}

	/**
	 * (테마 업데이트) theme_id 업데이트 (ThemeService 검증 후 호출하는 방식 권장)
	 */
	@Override
	public ResponseResultModel updateTheme(String userId, String themeId) {
		// 1. (선행) ThemeService에서 themeId 유효성 검증
		// 2. userId로 user_pref 엔티티 조회 (getOrCreate 활용)
		// 3. 엔티티의 theme_id 필드를 새로운 값으로 업데이트
		// 4. DB에 저장
		// 5. 업데이트된 엔티티를 DTO로 변환하여 반환
		ResponseResultModel result = new ResponseResultModel();
		UserPrefDto data = new UserPrefDto();
		return null;
	}
}
