package com.timepalette.daylogue.service.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.sticker.StickerItemDto;
import com.timepalette.daylogue.model.dto.settings.sticker.StickerPackDto;
import com.timepalette.daylogue.model.dto.settings.sticker.UserStickerPackDto;

import java.util.List;

public interface StickerService {

	/** (스티커팩 카탈로그) 활성화된 스티커팩 목록을 조회한다. */
	ResponseResultModel listEnabledPacks();

	/** (스티커팩 아이템) 특정 팩의 아이템 목록을 조회한다. */
	ResponseResultModel listPackItems(String packId);

	/** (유저 보유팩) 유저가 보유/설치한 스티커팩 상태를 조회한다. */
	ResponseResultModel listUserPacks(String userId);

	/** (설치/해제) 유저 스티커팩 installed 상태를 변경한다. */
	ResponseResultModel setInstalled(String userId, String packId, boolean installed);

	/** (핀 고정) 유저 스티커팩 pinned 상태를 변경한다. */
	ResponseResultModel setPinned(String userId, String packId, boolean pinned);

	/** (획득/추가) 유저에게 스티커팩을 지급/부여한다. (초기 기본팩 지급 등) */
	ResponseResultModel grantPack(String userId, String packId);
}
