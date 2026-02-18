package com.timepalette.daylogue.model.dto.connections;

/**
 *  주소록 히스토리 조회 시, 사용되는 Request 모델
 * @since 2026.02.18
 * */
public class AddressHistoryRequestModel {
    public String userId;
	public long contactId;
	public int page;
	public int limit;
}
