package com.timepalette.daylogue.service.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.category.CategoryBulkRequest;
import com.timepalette.daylogue.model.dto.settings.category.CategoryBulkResultDto;
import com.timepalette.daylogue.model.dto.settings.category.CategoryDto;
import com.timepalette.daylogue.model.dto.settings.category.CategorySetRequestModel;

import java.util.List;

public interface CategoryService {

	/**
	 * (목록) 시스템 기본 + 사용자 커스텀 카테고리를 병합해 반환한다. (user_id IS NULL + user_id = ?)
	 *  - 정렬: ord ASC, 동일 ord면 name ASC 등 정책 적용
	 */
	ResponseResultModel listMerged(String userId);

	/**
	 *  (목록) 사용자 커스텀 카테고리만 조회한다.
	 *  */
	ResponseResultModel listUserOnly(String userId);

	/**
	 * (상세) 카테고리 1건 조회 (시스템/사용자 모두 가능), 접근 가능한지 검증 포함
	 * */
	ResponseResultModel getById(String userId, String categoryId);

	/**
	 * (생성) 사용자 커스텀 카테고리를 생성한다. (name 유니크: uk_cat_user_name)
	 * */
	ResponseResultModel create(String userId, CategorySetRequestModel req);

	/**
	 * (수정) 사용자 커스텀 카테고리를 수정한다. (본인 소유만)
	 * */
	ResponseResultModel update(String userId, String categoryId, CategorySetRequestModel req);

	/**
	 *  (삭제) 사용자 커스텀 카테고리를 삭제한다. (참조 중이면 409 등 정책 적용)
	 *  - 참조 체크는 planner/task/routine 쪽 서비스와 협의 필요
	 *  */
	ResponseResultModel delete(String userId, String categoryId);

	/**
	 * (일괄) add/update/delete를 한 번에 처리한다. (SET-008 같은 API용)
	 *  - 트랜잭션으로 묶고, 결과 목록(변경 후)을 반환
	 *  */
	ResponseResultModel bulkApply(String userId, CategoryBulkRequest req);
}
