package com.timepalette.daylogue.serviceImpl.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.category.CategoryBulkRequest;
import com.timepalette.daylogue.model.dto.settings.category.CategoryBulkResultDto;
import com.timepalette.daylogue.model.dto.settings.category.CategoryDto;
import com.timepalette.daylogue.model.dto.settings.category.CategorySetRequestModel;
import com.timepalette.daylogue.service.settings.CategoryService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

	/**
	 * (목록) 시스템 기본 + 사용자 커스텀 카테고리를 병합해 반환한다. (user_id IS NULL + user_id = ?)
	 *  - 정렬: ord ASC, 동일 ord면 name ASC 등 정책 적용
	 */
	@Override
	public ResponseResultModel listMerged(String userId) {
		// 1. 시스템 기본 카테고리 조회 (userId IS NULL)
		// 2. 사용자 커스텀 카테고리 조회 (userId = userId)
		// 3. 두 리스트 병합
		// 4. 정렬 적용 (ord ASC, name ASC 등)
		// 5. DTO 변환 및 반환

		ResponseResultModel result = new ResponseResultModel();
		List<CategoryDto> list = new ArrayList<>();

		result.data = list;

		return result;
	}

	/**
	 *  (목록) 사용자 커스텀 카테고리만 조회한다.
	 *  */
	@Override
	public ResponseResultModel listUserOnly(String userId) {
		// 1. 사용자 커스텀 카테고리 조회 (userId = userId)
		// 2. 정렬 적용
		// 3. DTO 변환 및 반환

		ResponseResultModel result = new ResponseResultModel();
		List<CategoryDto> list = new ArrayList<>();

		result.data = list;

		return result;
	}

	/**
	 * (상세) 카테고리 1건 조회 (시스템/사용자 모두 가능), 접근 가능한지 검증 포함
	 * */
	@Override
	public ResponseResultModel getById(String userId, String categoryId) {
		// 1. 카테고리 ID로 조회
		// 2. 존재 여부 확인 (없으면 404)
		// 3. 권한 확인 (시스템 카테고리이거나 본인 소유인지)
		// 4. DTO 변환 및 반환

		ResponseResultModel result = new ResponseResultModel();
		CategoryDto data = new CategoryDto();

		result.data = data;

		return result;
	}

	/**
	 * (생성) 사용자 커스텀 카테고리를 생성한다. (name 유니크: uk_cat_user_name)
	 * */
	@Override
	public ResponseResultModel create(String userId, CategorySetRequestModel req) {
		// 1. 입력값 검증
		// 2. 중복 이름 체크 (해당 사용자 내에서)
		// 3. 엔티티 생성 및 속성 설정 (userId, name, color, icon 등)
		// 4. 저장 (Repository.save)
		// 5. 결과 DTO 반환

		ResponseResultModel result = new ResponseResultModel();
		CategoryDto data = new CategoryDto();

		result.data = data;

		return result;
	}

	/**
	 * (수정) 사용자 커스텀 카테고리를 수정한다. (본인 소유만)
	 * */
	@Override
	public ResponseResultModel update(String userId, String categoryId, CategorySetRequestModel req) {
		// 1. 카테고리 ID로 조회
		// 2. 존재 여부 및 소유권 확인 (본인 것만 수정 가능)
		// 3. 입력값 검증
		// 4. 이름 변경 시 중복 체크
		// 5. 속성 업데이트
		// 6. 저장
		// 7. 결과 DTO 반환

		ResponseResultModel result = new ResponseResultModel();
		CategoryDto data = new CategoryDto();

		result.data = data;

		return result;
	}

	/**
	 *  (삭제) 사용자 커스텀 카테고리를 삭제한다. (참조 중이면 409 등 정책 적용)
	 *  - 참조 체크는 planner/task/routine 쪽 서비스와 협의 필요
	 *  */
	@Override
	public ResponseResultModel delete(String userId, String categoryId) {
		// 1. 카테고리 ID로 조회
		// 2. 존재 여부 및 소유권 확인
		// 3. 사용 중인 데이터(일정, 루틴 등)가 있는지 확인 (참조 무결성)
		// 4. 삭제 수행
		// 5. 결과 반환

		ResponseResultModel result = new ResponseResultModel();

		result.data = "";

		return result;
	}

	/**
	 * (일괄) add/update/delete를 한 번에 처리한다. (SET-008 같은 API용)
	 *  - 트랜잭션으로 묶고, 결과 목록(변경 후)을 반환
	 *  */
	@Override
	public ResponseResultModel bulkApply(String userId, CategoryBulkRequest req) {
		// 1. 트랜잭션 시작 (@Transactional)
		// 2. 삭제 목록 처리 (검증 -> 삭제)
		// 3. 수정 목록 처리 (검증 -> 수정)
		// 4. 추가 목록 처리 (검증 -> 생성)
		// 5. 최종 결과 집계 및 반환

		ResponseResultModel result = new ResponseResultModel();
//		CategoryBulkResultDto data = new CategoryBulkResultDto();

//		result.data = data;

		return result;
	}
}
