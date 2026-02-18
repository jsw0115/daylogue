package com.timepalette.daylogue.model.dto.connections;

/**
 *  주소록 추가/수정/삭제 요청 시 사용되는 모델
 * @since 2026.02.18
 * */
public class AddressAddOrUpdateRequestModel {

	public long contactId;
	public String userId;
	public String name;
	public String nickname;
	public String email;
	public boolean isFavorite = false;

}
