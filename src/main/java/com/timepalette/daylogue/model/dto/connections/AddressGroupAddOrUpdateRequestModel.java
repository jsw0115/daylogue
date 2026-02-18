package com.timepalette.daylogue.model.dto.connections;

/**
 *  주소록 그룹 추가, 수정, 삭제 시, 사용되는 Request 모델
 * @since 2026.02.18
 * */
public class AddressGroupAddOrUpdateRequestModel {

	public long contactId;
	public String userId;
	public String label;
	public boolean isFavorite = false;
}
