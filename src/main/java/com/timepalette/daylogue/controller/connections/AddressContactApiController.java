package com.timepalette.daylogue.controller.connections;

import com.timepalette.daylogue.controller.BaseApiController;
import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.connections.AddressAddOrUpdateRequestModel;
import com.timepalette.daylogue.model.dto.connections.AddressHistoryRequestModel;
import com.timepalette.daylogue.model.dto.connections.AddressTrashRequestModel;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 주소록 연락처 정보 Create., Update., Delete. 정보를 처리하는 API
 * @category Address
 * @since 2026.02.18
 */
@Tag(name = "Address-Contact", description = "주소 정보를 가져오는 API")
@Validated
@RestController
@RequestMapping("/api/address/contact")
public class AddressContactApiController extends BaseApiController {


	/**
	 *  가입자 주소록 추가
	 *  @apiNote 가입자 주소록 추가
	 * @param param AddressAddOrUpdateGroupRequestModel
	 * @return ResponseEntity<ResponseResultModel>
	 * */
	@RequestMapping(value = "/", method= RequestMethod.POST)
	public ResponseEntity<ResponseResultModel> contact(@RequestBody AddressAddOrUpdateRequestModel param) {

		ResponseResultModel result = new ResponseResultModel();

		String resultCode = result.getErrorCode();
		int status = HttpStatus.valueOf(resultCode).value();

		try {

		} catch (Exception e) {

		}

		return ResponseEntity.status(status).body(result);
	}

	/**
	 *  추가할 사용자 시스템 가입 여부 확인
	 * @apiNote 추가할 사용자 시스템 가입 여부 확인
	 * @param address
	 * @return ResponseEntity<ResponseResultModel>
	 * */
	@RequestMapping(value = "/check", method = RequestMethod.POST)
	public ResponseEntity<ResponseResultModel>  check(@RequestParam String address) {

		ResponseResultModel result = new ResponseResultModel();

		String resultCode = result.getErrorCode();
		int status = HttpStatus.valueOf(resultCode).value();

		try {

		} catch (Exception e) {

		}

		return ResponseEntity.status(status).body(result);
	}

	/**
	 *  미가입자 초대장 발송
	 * @apiNote 미가입자 초대장 발송
	 * @param param
	 * @return ResponseEntity<ResponseResultModel>
	 * */
	@RequestMapping(value = "/invite", method = RequestMethod.POST)
	public ResponseEntity<ResponseResultModel> invite(@RequestBody AddressAddOrUpdateRequestModel param) {

		ResponseResultModel result = new ResponseResultModel();

		String resultCode = result.getErrorCode();
		int status = HttpStatus.valueOf(resultCode).value();

		try {

		} catch (Exception e) {

		}

		return ResponseEntity.status(status).body(result);
	}

	/**
	 *  주소록 정보 수정 (별칭/그룹/즐겨찾기 등)
	 * @apiNote  주소록 정보 수정 (별칭/그룹/즐겨찾기 등)
	 * @param   param
	 * @return ResponseEntity<ResponseResultModel>
	 * */
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public ResponseEntity<ResponseResultModel> update(@RequestBody AddressAddOrUpdateRequestModel param) {

		ResponseResultModel result = new ResponseResultModel();

		String resultCode = result.getErrorCode();
		int status = HttpStatus.valueOf(resultCode).value();

		try {

		} catch (Exception e) {

		}

		return ResponseEntity.status(status).body(result);
	}

	/**
	 *  주소록 단건 삭제 (휴지통 이동)
	 * @apiNote 주소록 단건 삭제 (휴지통 이동)
	 * @param param
	 * @return ResponseEntity<ResponseResultModel>
	 * */
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public ResponseEntity<ResponseResultModel> delete(@RequestBody AddressAddOrUpdateRequestModel param) {

		ResponseResultModel result = new ResponseResultModel();

		String resultCode = result.getErrorCode();
		int status = HttpStatus.valueOf(resultCode).value();

		try {

		} catch (Exception e) {

		}

		return ResponseEntity.status(status).body(result);
	}

	/**
	 *  연락처 활동 히스토리 조회 (굳이..?)
	 * @apiNote   연락처 활동 히스토리 조회
	 * @param param
	 * @return ResponseEntity<ResponseResultModel>
	 * */
	@RequestMapping(value = "/history", method = RequestMethod.POST)
	public ResponseEntity<ResponseResultModel> historyData (@RequestBody AddressHistoryRequestModel param) {

		ResponseResultModel result = new ResponseResultModel();

		String resultCode = result.getErrorCode();
		int status = HttpStatus.valueOf(resultCode).value();

		try {

		} catch (Exception e) {

		}

		return ResponseEntity.status(status).body(result);
	}

	/**
	 *  다중 선택 이동/삭제  (추후 진행)
	 * @apiNote 다중 선택 이동/삭제
	 * @return ResponseEntity<ResponseResultModel>
	 * */
	@RequestMapping(value = "/batch-select", method = RequestMethod.POST)
	public ResponseEntity<ResponseResultModel> batchSelectUpdate () {

		ResponseResultModel result = new ResponseResultModel();

		String resultCode = result.getErrorCode();
		int status = HttpStatus.valueOf(resultCode).value();

		try {

		} catch (Exception e) {

		}

		return ResponseEntity.status(status).body(result);
	}

	/**
	 * 휴지통 목록 조회
	 * @apiNote 휴지통 목록 조회
	 * @param request
	 * @return ResponseEntity<ResponseResultModel>
	 * */
	@RequestMapping(value = "/trash", method = RequestMethod.POST)
	public ResponseEntity<ResponseResultModel> getTrash (@RequestBody AddressTrashRequestModel request) {
		ResponseResultModel result = new ResponseResultModel();

		String resultCode = result.getErrorCode();
		int status = HttpStatus.valueOf(resultCode).value();

		try {

		} catch (Exception e) {

		}

		return ResponseEntity.status(status).body(result);
	}

	/**
	 *  휴지통 목록 삭제
	 * @apiNote 휴지통 목록 삭제
	 * @param request
	 * @return ResponseEntity<ResponseResultModel>
	 * */
	@RequestMapping(value = "/trash", method = RequestMethod.DELETE)
	public ResponseEntity<ResponseResultModel> deleteTrash (@RequestBody AddressTrashRequestModel request) {
		ResponseResultModel result = new ResponseResultModel();

		String resultCode = result.getErrorCode();
		int status = HttpStatus.valueOf(resultCode).value();

		try {

		} catch (Exception e) {

		}

		return ResponseEntity.status(status).body(result);
	}

}
