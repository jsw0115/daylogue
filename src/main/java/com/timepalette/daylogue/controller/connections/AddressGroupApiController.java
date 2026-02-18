package com.timepalette.daylogue.controller.connections;

import com.timepalette.daylogue.controller.BaseApiController;
import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.connections.AddressAddOrUpdateRequestModel;
import com.timepalette.daylogue.model.dto.connections.AddressGroupAddOrUpdateRequestModel;
import com.timepalette.daylogue.model.dto.connections.AddressGroupUpdateOrderRequestModel;
import com.timepalette.daylogue.model.dto.connections.AddressSearchRequestModel;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * 주소록 그룹 정보를 처리하는 API
 * @category Address
 * @since 2026.02.18
 */
@Tag(name = "Address-Group", description = "주소록 그룹(폴더) 정보를 가져오는 API")
@Validated
@RestController
@RequestMapping("/api/address/group")
public class AddressGroupApiController extends BaseApiController {

	/**
	 *  그룹 목록 조회
	 * @apiNote 그룹 목록 조회
	 * @param param
	 * @return ResponseEntity<ResponseResultModel>
	 * */
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	public ResponseEntity<ResponseResultModel> list (@RequestBody AddressSearchRequestModel param) {
		ResponseResultModel result = new ResponseResultModel();

		String resultCode = result.getErrorCode();
		int status = HttpStatus.valueOf(resultCode).value();

		try {

		} catch (Exception e) {

		}

		return ResponseEntity.status(status).body(result);
	}

	/**
	 *  주소록 그룹 생성
	 * @apiNote 주소록 그룹 생성
	 * @param   request
	 * */
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	public ResponseEntity<ResponseResultModel> addGroup (@RequestBody AddressGroupAddOrUpdateRequestModel request) {
		ResponseResultModel result = new ResponseResultModel();

		String resultCode = result.getErrorCode();
		int status = HttpStatus.valueOf(resultCode).value();

		try {

		} catch (Exception e) {

		}

		return ResponseEntity.status(status).body(result);
	}

	/**
	 *  주소록 그룹 수정
	 * @apiNote 주소록 그룹 수정
	 * @param   request
	 * */
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public ResponseEntity<ResponseResultModel> updateGroup (@RequestBody AddressGroupAddOrUpdateRequestModel request) {
		ResponseResultModel result = new ResponseResultModel();

		String resultCode = result.getErrorCode();
		int status = HttpStatus.valueOf(resultCode).value();

		try {

		} catch (Exception e) {

		}

		return ResponseEntity.status(status).body(result);
	}

	/**
	 *  주소록 그룹 정렬 순서 변경
	 * @apiNote 주소록 그룹 정렬 순서 변경
	 * @param   request
	 * @return ResponseEntity<ResponseResultModel>
	 * */
	@RequestMapping(value = "/updateGroupOrder", method = RequestMethod.POST)
	public ResponseEntity<ResponseResultModel> updateGroupOrder (@RequestBody AddressGroupUpdateOrderRequestModel request) {
		ResponseResultModel result = new ResponseResultModel();

		String resultCode = result.getErrorCode();
		int status = HttpStatus.valueOf(resultCode).value();

		try {

		} catch (Exception e) {

		}

		return ResponseEntity.status(status).body(result);
	}

	/**
	 *  주소록 그룹 삭제
	 * @apiNote 주소록 그룹 삭제
	 * @param   request
	 * @return ResponseEntity<ResponseResultModel>
	 * */
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public ResponseEntity<ResponseResultModel> deleteGroup (@RequestBody AddressGroupAddOrUpdateRequestModel request) {
		ResponseResultModel result = new ResponseResultModel();

		String resultCode = result.getErrorCode();
		int status = HttpStatus.valueOf(resultCode).value();

		try {

		} catch (Exception e) {

		}

		return ResponseEntity.status(status).body(result);
	}
}
