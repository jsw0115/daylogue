package com.timepalette.daylogue.serviceImpl.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.EffectiveNotificationPolicyDto;
import com.timepalette.daylogue.model.dto.settings.notification.NotificationGlobalDto;
import com.timepalette.daylogue.model.dto.settings.notification.NotificationGlobalPatchRequest;
import com.timepalette.daylogue.model.dto.settings.notification.NotificationTypePrefDto;
import com.timepalette.daylogue.model.dto.settings.notification.NotificationTypePrefUpsertRequest;
import com.timepalette.daylogue.service.settings.NotificationSettingsService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationSettingsServiceImpl implements NotificationSettingsService {

	/**
	 * (전역 알림 설정 조회) push/email/inapp + dnd 를 조회한다. (user_pref)
	 * */
	@Override
	public ResponseResultModel getGlobal(String userId) {
		// 1. userId로 user_pref 테이블에서 전역 알림 설정 조회
		// 2. 설정이 없으면 기본값을 적용하여 DTO 생성
		// 3. DTO를 ResponseResultModel에 담아 반환
		ResponseResultModel result = new ResponseResultModel();
		NotificationGlobalDto data = new NotificationGlobalDto();
		result.data = data;
		return result;
	}

	/**
	 * (전역 알림 설정 저장) 전역 알림 설정을 부분 업데이트한다. (PATCH)
	 * */
	@Override
	public ResponseResultModel updateGlobal(String userId, NotificationGlobalPatchRequest req) {
		// 1. userId로 기존 전역 알림 설정 조회
		// 2. req 객체에 담긴 필드(null이 아닌 필드)만 기존 설정에 덮어쓰기
		// 3. 변경된 설정을 user_pref 테이블에 저장
		// 4. 업데이트된 전체 설정을 DTO로 변환하여 반환
		ResponseResultModel result = new ResponseResultModel();
		NotificationGlobalDto data = new NotificationGlobalDto();
		result.data = data;
		return result;
	}

	/**
	 * (유형별 알림 설정 목록) evt별 설정을 조회한다. (notif_pref)
	 * */
	@Override
	public ResponseResultModel listTypePrefs(String userId) {
		// 1. 시스템에 정의된 모든 알림 유형(event key) 목록 조회
		// 2. userId로 사용자가 설정한 유형별 알림 설정(notif_pref) 목록 조회
		// 3. 두 목록을 조합하여, 사용자 설정이 없는 경우 기본값을 적용한 전체 목록 생성
		// 4. DTO 리스트로 변환하여 반환
		ResponseResultModel result = new ResponseResultModel();
		List<NotificationTypePrefDto> data = new ArrayList<>();
		result.data = data;
		return result;
	}

	/**
	 *  (유형별 알림 설정 저장) 특정 evt의 on/off 및 cfg_json을 upsert 한다.
	 *  */
	@Override
	public ResponseResultModel upsertTypePref(String userId, NotificationTypePrefUpsertRequest req) {
		// 1. userId와 req.evtKey로 기존 유형별 설정 조회
		// 2. 설정이 있으면 req 내용으로 업데이트, 없으면 새로 생성 (upsert)
		// 3. DB에 저장
		// 4. 저장된 최종 설정을 DTO로 변환하여 반환
		ResponseResultModel result = new ResponseResultModel();
		NotificationTypePrefDto data = new NotificationTypePrefDto();
		result.data = data;
		return result;
	}

	/**
	 * (유효 정책 계산) 전역 + 유형별을 조합해 “실제 적용되는 알림 정책”을 계산한다.
	 * */
	@Override
	public ResponseResultModel resolveEffectivePolicy(String userId, String evtKey) {
		// 1. 전역 알림 설정 조회 (getGlobal)
		// 2. 특정 이벤트(evtKey)의 유형별 설정 조회
		// 3. 전역 설정(전체 끄기, 방해금지 시간 등)과 유형별 설정을 조합
		// 4. 최종적으로 해당 이벤트에 대한 알림 발송 여부, 채널 등을 계산
		// 5. 계산된 유효 정책을 DTO에 담아 반환
		ResponseResultModel result = new ResponseResultModel();
		EffectiveNotificationPolicyDto data = new EffectiveNotificationPolicyDto();
		result.data = data;
		return result;
	}
}
