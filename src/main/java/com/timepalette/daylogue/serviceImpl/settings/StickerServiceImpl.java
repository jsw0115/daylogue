package com.timepalette.daylogue.serviceImpl.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.sticker.StickerItemDto;
import com.timepalette.daylogue.model.dto.settings.sticker.StickerPackDto;
import com.timepalette.daylogue.model.dto.settings.sticker.UserStickerPackDto;
import com.timepalette.daylogue.model.entity.auth.User;
import com.timepalette.daylogue.service.settings.StickerService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StickerServiceImpl implements StickerService {
	
	/**
	 * (스티커팩 카탈로그) 활성화된 스티커팩 목록을 조회한다.
	 */
	@Override
	public ResponseResultModel listEnabledPacks() {
		// 1. DB에서 활성화된(enabled=true) 스티커 팩 목록 조회
		// 2. 조회된 엔티티 목록을 StickerPackDto 리스트로 변환
		// 3. 결과 반환
		ResponseResultModel result = new ResponseResultModel();
		List<StickerPackDto> data = new ArrayList<>();
		result.data = data;
		return result;
	}

	/**
	 * (스티커팩 아이템) 특정 팩의 아이템 목록을 조회한다.
	 */
	@Override
	public ResponseResultModel listPackItems(String packId) {
		// 1. packId로 스티커 팩 존재 여부 확인
		// 2. 해당 팩에 속한 스티커 아이템 목록을 DB에서 조회
		// 3. 조회된 엔티티 목록을 StickerItemDto 리스트로 변환
		// 4. 결과 반환
		ResponseResultModel result = new ResponseResultModel();
		List<StickerItemDto> data = new ArrayList<>();
		result.data = data;
		return result;
	}

	/**
	 * (유저 보유팩) 유저가 보유/설치한 스티커팩 상태를 조회한다.
	 */
	@Override
	public ResponseResultModel listUserPacks(String userId) {
		// 1. userId로 사용자가 보유한 스티커 팩 목록(user_sticker_pack) 조회
		// 2. 각 보유 팩 정보에 스티커 팩 마스터 정보(이름, 썸네일 등)를 조합
		// 3. 조회된 데이터를 UserStickerPackDto 리스트로 변환
		// 4. 결과 반환
		ResponseResultModel result = new ResponseResultModel();
		List<UserStickerPackDto> data = new ArrayList<>();
		result.data = data;
		return result;
	}

	/**
	 * (설치/해제) 유저 스티커팩 installed 상태를 변경한다.
	 */
	@Override
	public ResponseResultModel setInstalled(String userId, String packId, boolean installed) {
		// 1. userId와 packId로 사용자가 해당 팩을 보유하고 있는지 확인
		// 2. 보유 중이라면 'installed' 상태를 요청 값으로 변경
		// 3. DB에 변경 사항 저장
		// 4. 업데이트된 UserStickerPackDto 정보 반환
		ResponseResultModel result = new ResponseResultModel();
		UserStickerPackDto data = new UserStickerPackDto();
		result.data = data;
		return result;
	}

	/**
	 * (핀 고정) 유저 스티커팩 pinned 상태를 변경한다.
	 */
	@Override
	public ResponseResultModel setPinned(String userId, String packId, boolean pinned) {
		// 1. userId와 packId로 사용자가 해당 팩을 보유하고 있는지 확인
		// 2. 보유 중이라면 'pinned' 상태를 요청 값으로 변경
		// 3. DB에 변경 사항 저장
		// 4. 업데이트된 UserStickerPackDto 정보 반환
		ResponseResultModel result = new ResponseResultModel();
		UserStickerPackDto data = new UserStickerPackDto();
		result.data = data;
		return result;
	}

	/**
	 * (획득/추가) 유저에게 스티커팩을 지급/부여한다. (초기 기본팩 지급 등)
	 */
	@Override
	public ResponseResultModel grantPack(String userId, String packId) {
		// 1. 사용자가 이미 해당 팩을 보유하고 있는지 확인
		// 2. 보유하고 있지 않다면, user_sticker_pack 테이블에 새로운 레코드 추가
		// 3. 새로 추가된 UserStickerPackDto 정보 반환
		ResponseResultModel result = new ResponseResultModel();
		UserStickerPackDto data = new UserStickerPackDto();
		result.data = data;
		return result;
	}
}
