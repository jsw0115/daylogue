package com.timepalette.daylogue.controller.connections;

import com.timepalette.daylogue.model.dto.connections.AddressDetailRequestModel;
import com.timepalette.daylogue.service.connection.AddressService;
import org.springframework.web.bind.annotation.*;

import com.timepalette.daylogue.controller.BaseApiController;
import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.connections.AddressSearchRequestModel;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;


/**
 * 주소록 로직에서 사용 
 * @category Address
 * @since 2026.02.18
 */
@Tag(name = "Address", description = "주소록 정보를 가져오는 API")
@Validated
@RestController
@RequestMapping("/api/address")
public class AddressApiController extends BaseApiController {

	private AddressService addressService;

	public AddressApiController(AddressService addressService) {
		this.addressService = addressService;
	}

    /**
     * 주소록 검색 결과를 가져오는 메서드 
     * @apiNote 주소록 정보를 가져오는 메서드
     * @param param AddressSearchRequestParamModel
     * @return ResponseEntity<ResponseResultModel>
     */
    @RequestMapping(value = "/search", method=RequestMethod.POST)
    public ResponseEntity<ResponseResultModel> searchAddress(@RequestBody AddressSearchRequestModel param) {

        ResponseResultModel result = new ResponseResultModel();

        String resultCode = result.getErrorCode();
        int status = HttpStatus.valueOf(resultCode).value();

        try {

        } catch (Exception e) {

        }

        return ResponseEntity.status(status).body(result);
    }

    /**
     * 연락처 상세 정보 조회
     * @apiNote 연락처 상세 정보를 조회하는 메서드
     * @param   param
     * @return  ResponseEntity<ResponseResultModel>
     */
	@RequestMapping(value = "/detail", method = RequestMethod.GET)
	public ResponseEntity<ResponseResultModel> detailAddress(@RequestBody AddressDetailRequestModel param) {

		ResponseResultModel result = new ResponseResultModel();

		String resultCode = result.getErrorCode();
		int status = HttpStatus.valueOf(resultCode).value();

		try {

		} catch (Exception e) {

		}

		return ResponseEntity.status(status).body(result);
	}

}
