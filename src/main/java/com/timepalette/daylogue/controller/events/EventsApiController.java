package com.timepalette.daylogue.controller.events;

import com.timepalette.daylogue.controller.BaseApiController;
import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.event.SearchRequestModel;
import com.timepalette.daylogue.model.dto.event.UpsertScheduleRequestModel;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * 2026.01.29   API 컨트롤러 생성
 * */
@Tag(name = "Events", description = "일정 저장/수정/삭제/검색 등의 기능을 제공하는 API")
@Validated
@RestController
@RequestMapping("/api/events")
public class EventsApiController extends BaseApiController {

	/**
	 *  [검색/목록] 기간 내 이벤트 조회 (주간/월간/검색바 공용)
	 *      필터 : 키워드, 카테고리, visibility, 북마크, D-day, 공유
	 *      정렬
	 * @param auth
	 * @param param
	 * */
	@RequestMapping(value = "/search", method = RequestMethod.GET)
	public ResponseEntity<ResponseResultModel> getSearch(Authentication auth, @RequestBody SearchRequestModel param) {

		logger().info("EventsApiController, getSearch");
		ResponseResultModel result = new ResponseResultModel();
		return ResponseEntity.ok(result);
	}

	/**
	 * [생성] 반복 없는 일정 생성
	 * @param   auth
	 * @param   param
	 * */
	@RequestMapping(value = "/schedule", method = RequestMethod.POST)
	public ResponseEntity<ResponseResultModel> addSchedule (Authentication auth, @RequestBody UpsertScheduleRequestModel param) {

		logger().info("EventsApiController, addSchedule");
		ResponseResultModel result = new ResponseResultModel();
		return ResponseEntity.ok(result);
	}

	/**
	 * [수정] 반복 없는 일정 수정
	 * @param   auth
	 * @param   param
	 * */
	@RequestMapping(value = "/schedule", method = RequestMethod.PATCH)
	public ResponseEntity<ResponseResultModel> updateSchedule (Authentication auth, @RequestBody UpsertScheduleRequestModel param) {

		logger().info("EventsApiController, updateSchedule");
		ResponseResultModel result = new ResponseResultModel();
		return ResponseEntity.ok(result);
	}

	/**
	 * [삭제] 반복 없는 일정 삭제
	 * @param   auth
	 * @param   param
	 * */
	@RequestMapping(value = "/schedule", method = RequestMethod.DELETE)
	public ResponseEntity<ResponseResultModel> deleteSchedule (Authentication auth, @RequestBody UpsertScheduleRequestModel param) {

		logger().info("EventsApiController, deleteSchedule");
		ResponseResultModel result = new ResponseResultModel();
		return ResponseEntity.ok(result);
	}

	/**
	 * [생성] 반복 설정 일정 생성
	 * @param   auth
	 * @param   param
	 * */
	@RequestMapping(value = "/repeat-schedule", method = RequestMethod.POST)
	public ResponseEntity<ResponseResultModel> addRepeatSchedule (Authentication auth, @RequestBody UpsertScheduleRequestModel param) {

		logger().info("EventsApiController, addRepeatSchedule");
		ResponseResultModel result = new ResponseResultModel();
		return ResponseEntity.ok(result);
	}

	/**
	 * [수정] 반복 설정 일정 수정
	 *      이번 한번만 수정.
	 * @param   auth
	 * @param   param
	 * */
	@RequestMapping(value = "/repeat-schedule/once", method = RequestMethod.PATCH)
	public ResponseEntity<ResponseResultModel> updateRepeatScheduleOnce (Authentication auth, @RequestBody UpsertScheduleRequestModel param) {

		logger().info("EventsApiController, addRepeatSchedule");
		ResponseResultModel result = new ResponseResultModel();
		return ResponseEntity.ok(result);
	}

	/**
	 * [수정] 반복 설정 일정 수정
	 *      앞으로 모두 수정
	 * @param   auth
	 * @param   param
	 * */
	@RequestMapping(value = "/repeat-schedule/future", method = RequestMethod.PATCH)
	public ResponseEntity<ResponseResultModel> updateRepeatScheduleFuture (Authentication auth, @RequestBody UpsertScheduleRequestModel param) {

		logger().info("EventsApiController, updateRepeatScheduleFuture");
		ResponseResultModel result = new ResponseResultModel();
		return ResponseEntity.ok(result);
	}

	/**
	 * [삭제] 기준일 부터 반복 종료
	 * @param   auth
	 * @param   param
	 * */
	@RequestMapping(value = "/repeat-schedule/future", method = RequestMethod.POST)
	public ResponseEntity<ResponseResultModel> deleteRepeatScheduleFuture (Authentication auth, @RequestBody UpsertScheduleRequestModel param) {

		logger().info("EventsApiController, deleteRepeatScheduleFuture");
		ResponseResultModel result = new ResponseResultModel();
		return ResponseEntity.ok(result);
	}
}
