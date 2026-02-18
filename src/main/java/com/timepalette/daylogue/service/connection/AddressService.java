package com.timepalette.daylogue.service.connection;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.connections.*;

/**
 * 주소록(Address) 관련 비즈니스 로직을 처리하는 서비스 인터페이스
 * 연락처 검색, 상세 조회, 추가/수정/삭제, 그룹 관리 등을 포함합니다.
 * @since 2026.02.18
 */
public interface AddressService {
	// ========================================================================
	// 1. AddressApiController (조회 관련)
	// ========================================================================

	/**
	 * 주소록 목록 검색
	 * @param param 검색 조건 (그룹 ID, 검색어, 즐겨찾기 여부 등)
	 * @return 주소록 목록 결과
	 */
	ResponseResultModel searchAddress(AddressSearchRequestModel param);

	/**
	 * 연락처 상세 정보 조회
	 * @param param 연락처 ID를 포함한 요청 모델
	 * @return 연락처 상세 정보 (메모, 히스토리 등 포함)
	 */
	ResponseResultModel getAddressDetail(AddressDetailRequestModel param);


	// ========================================================================
	// 2. AddressContactApiController (연락처 CUD 및 액션)
	// ========================================================================

	/**
	 * 가입자 주소록 추가
	 * @param param 추가할 사용자 정보 (targetUserId, nickname, groupId 등)
	 * @return 추가 결과
	 */
	ResponseResultModel addContact(AddressAddOrUpdateRequestModel param);

	/**
	 * 시스템 가입 여부 확인
	 * @param email 확인하려는 이메일 주소
	 * @return 가입 여부 및 사용자 정보 (존재 시)
	 */
	ResponseResultModel checkSystemUser(String email);

	/**
	 * 미가입자 초대장 발송
	 * @param param 이메일 정보를 포함한 요청 모델
	 * @return 발송 성공 여부
	 */
	ResponseResultModel inviteUser(AddressAddOrUpdateRequestModel param);

	/**
	 * 주소록 정보 수정
	 * @param param 수정할 정보 (별칭, 그룹 이동, 즐겨찾기 상태 등)
	 * @return 수정 결과
	 */
	ResponseResultModel updateContact(AddressAddOrUpdateRequestModel param);

	/**
	 * 주소록 단건 삭제 (휴지통 이동 - Soft Delete)
	 * @param param 삭제할 연락처 ID
	 * @return 삭제 결과
	 */
	ResponseResultModel deleteContact(AddressAddOrUpdateRequestModel param);

	/**
	 * 연락처 활동 히스토리 조회
	 * @param param 연락처 ID 및 페이징 정보
	 * @return 활동 내역 리스트
	 */
	ResponseResultModel getContactHistory(AddressHistoryRequestModel param);

	/**
	 * 다중 선택 처리 (이동/삭제 등)
	 * @return 처리 결과
	 */
	ResponseResultModel batchProcessContacts();

	/**
	 * 휴지통 목록 조회
	 * @param request 페이징 정보 등
	 * @return 삭제된 연락처 목록
	 */
	ResponseResultModel getTrashList(AddressTrashRequestModel request);

	/**
	 * 휴지통 비우기 (영구 삭제) 또는 특정 항목 영구 삭제
	 * @param request 삭제할 항목 ID 리스트 등
	 * @return 삭제 결과
	 */
	ResponseResultModel deleteTrashItems(AddressTrashRequestModel request);


	// ========================================================================
	// 3. AddressGroupApiController (그룹 관리)
	// ========================================================================

	/**
	 * 그룹(폴더) 목록 조회
	 * @param param 조회 조건 (필요 시)
	 * @return 그룹 목록 및 각 그룹별 카운트
	 */
	ResponseResultModel getGroupList(AddressSearchRequestModel param);

	/**
	 * 그룹 생성
	 * @param request 생성할 그룹 명 등
	 * @return 생성된 그룹 정보
	 */
	ResponseResultModel addGroup(AddressGroupAddOrUpdateRequestModel request);

	/**
	 * 그룹 정보 수정 (이름 변경 등)
	 * @param request 그룹 ID 및 변경할 이름
	 * @return 수정 결과
	 */
	ResponseResultModel updateGroup(AddressGroupAddOrUpdateRequestModel request);

	/**
	 * 그룹 정렬 순서 변경
	 * @param request 변경된 그룹 ID 순서 배열
	 * @return 변경 결과
	 */
	ResponseResultModel updateGroupOrder(AddressGroupUpdateOrderRequestModel request);

	/**
	 * 그룹 삭제
	 * @param request 삭제할 그룹 ID (옵션: 내부 연락처 처리 방식)
	 * @return 삭제 결과
	 */
	ResponseResultModel deleteGroup(AddressGroupAddOrUpdateRequestModel request);
}
