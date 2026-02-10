package com.timepalette.daylogue.serviceImpl.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.device.UserDeviceDto;
import com.timepalette.daylogue.model.dto.settings.device.UserDeviceUpsertRequest;
import com.timepalette.daylogue.service.settings.UserDeviceService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDeviceServiceImpl implements UserDeviceService {

	/**
	 * (등록/갱신) device_id 기준으로 upsert 하며 push_tok/app_ver 등을 갱신한다.
	 */
	@Override
	public ResponseResultModel registerOrUpdate(String userId, UserDeviceUpsertRequest req) {
		// 1. 요청의 deviceId를 기준으로 DB에서 기기 정보 조회
		// 2. 기기가 존재하면, 요청 정보(푸시 토큰, 앱 버전 등)로 기존 엔티티 업데이트
		// 3. 기기가 존재하지 않으면, 새로운 UserDevice 엔티티 생성
		// 4. DB에 저장 (upsert)
		// 5. 저장된 기기 정보를 DTO로 변환하여 반환
		ResponseResultModel result = new ResponseResultModel();
//		UserDeviceDto data = new UserDeviceDto();
		return null;
	}

	/**
	 * (목록) 사용자의 기기 목록을 조회한다. (보안 설정/기기관리 화면)
	 */
	@Override
	public ResponseResultModel listDevices(String userId) {
		// 1. userId로 등록된 모든 기기 목록을 DB에서 조회 (해지되지 않은 기기만)
		// 2. 조회된 엔티티 목록을 UserDeviceDto 리스트로 변환
		// 3. 결과 반환
		ResponseResultModel result = new ResponseResultModel();
		List<UserDeviceDto> data = List.of();
		return result;
	}

	/**
	 * (활동 기록) last_seen_utc 를 갱신한다. (앱 사용 중 주기적 호출/특정 API에서 처리)
	 */
	@Override
	public ResponseResultModel touchLastSeen(String userId, String deviceId) {
		// 1. userId와 deviceId로 기기 정보 조회
		// 2. 기기가 존재하면 'last_seen_utc' 필드를 현재 시간으로 갱신
		// 3. DB에 저장
		// 4. 성공 여부 반환
		ResponseResultModel result = new ResponseResultModel();
		return null;
	}

	/**
	 * (해지) 기기를 해지 처리한다. (revoked_utc set)
	 */
	@Override
	public ResponseResultModel revoke(String userId, String deviceId) {
		// 1. userId와 deviceId로 기기 정보 조회
		// 2. 기기가 존재하고 해지되지 않았다면, 'revoked_utc' 필드를 현재 시간으로 설정
		// 3. 푸시 토큰 등 민감 정보 제거
		// 4. DB에 저장
		// 5. 변경된 기기 정보를 DTO로 변환하여 반환
		ResponseResultModel result = new ResponseResultModel();
//		UserDeviceDto data = new UserDeviceDto();
		return null;
	}

	/**
	 * (푸시 토큰 갱신) 푸시 토큰만 교체한다.
	 */
	@Override
	public ResponseResultModel updatePushToken(String userId, String deviceId, String pushToken) {
		// 1. userId와 deviceId로 기기 정보 조회
		// 2. 기기가 존재하면 'pushToken' 필드를 새로운 값으로 업데이트
		// 3. DB에 저장
		// 4. 변경된 기기 정보를 DTO로 변환하여 반환
		ResponseResultModel result = new ResponseResultModel();
//		UserDeviceDto data = new UserDeviceDto();
		return null;
	}
}
