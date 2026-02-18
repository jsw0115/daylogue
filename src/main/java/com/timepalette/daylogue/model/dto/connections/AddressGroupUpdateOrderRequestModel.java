package com.timepalette.daylogue.model.dto.connections;

import java.util.ArrayList;
import java.util.List;

/**
 *  주소록 그룹 순서 변경 시에 사용되는 Request 모델
 * @since 2026.02.18
 * */
public class AddressGroupUpdateOrderRequestModel {

	public String userId;
	public List<Long> groupIds = new ArrayList<>();
}
