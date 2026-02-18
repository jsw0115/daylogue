package com.timepalette.daylogue.model.dto.connections;

import lombok.Getter;
import lombok.Setter;

/** 
 * 주소록 검색 로직에서 사용하는 검색 결과 조회 시, Request Model 정보
 * @category Address
 * @since 2026.02.18
 */
public class AddressSearchRequestModel {
    
    public String groupId;
    public String userId;
    public String keyWord;
    public boolean isFavorite;
}
