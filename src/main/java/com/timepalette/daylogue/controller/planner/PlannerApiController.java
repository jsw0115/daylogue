package com.timepalette.daylogue.controller.planner;

import com.timepalette.daylogue.controller.BaseApiController;
import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.planner.PlannerRequestModel;
import com.timepalette.daylogue.model.dto.planner.RoutineRequestModel;
import com.timepalette.daylogue.model.dto.planner.UpCommingRequestModel;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * 플래너 등 로직에서 사용
 *      일간/주간/월간/대시보드 화면에서 "이벤트를 보여주기 위한" 조회 API 제공
 *      필터/정렬/카테고리/공개범위 드롭다운을 서버 쿼리로 반영
 *      반복 일정(Series) + 반복 발생분(Occurrence) + 예외(Exception) 머지 결과를 반환
 * 저장/수정/삭제는 EventsApiController에서 진행
 * @category Planner
 * @since 2025.12.26
 */
@Tag(name = "Planner", description = "플래너 정보를 가져오고 저장하는 API")
@Validated
@RestController
@RequestMapping("/api/planner")
public class PlannerApiController extends BaseApiController {

    /**
     * @apiNote 데일리 플래너 정보를 가져오는 메서드
     * "오늘 일정" 카드 / 일정 리스트 패널 등에서 사용
     * @param auth
     * @param param
     * */
    @RequestMapping(value = "/daily", method = RequestMethod.GET)
    public ResponseEntity<ResponseResultModel> getDailyPlanner(Authentication auth, @RequestBody PlannerRequestModel param) {

        logger().info("PlannerApiController, getDailyPlanner");
        ResponseResultModel result = new ResponseResultModel();
        return ResponseEntity.ok(result);
    }

    /**
     * @apiNote 주간 플래너 정보를 가져오는 메서드
     * @param   auth
     * @param   param
     * */
    @RequestMapping(value = "/weekly", method = RequestMethod.GET)
    public ResponseEntity<ResponseResultModel> getWeeklyPlanner(Authentication auth, @RequestBody PlannerRequestModel param) {

        logger().info("PlannerApiController, getWeeklyPlanner");
        ResponseResultModel result = new ResponseResultModel();
        return ResponseEntity.ok(result);
    }

    /**
     * @apiNote 월간 플래너 정보를 가져오는 메서드
     * @param   auth
     * @param   param
     * */
    @RequestMapping(value = "/monthly", method = RequestMethod.GET)
    public ResponseEntity<ResponseResultModel> getMonthlyPlanner(Authentication auth, @RequestBody PlannerRequestModel param) {

        logger().info("PlannerApiController, getMonthlyPlanner");
        ResponseResultModel result = new ResponseResultModel();
        return ResponseEntity.ok(result);
    }

    /**
     * @apiNote 연간 플래너 정보를 가져오는 메서드
     * @param   auth
     * @param   param
     * */
    @RequestMapping(value = "/yearly", method = RequestMethod.GET)
    public ResponseEntity<ResponseResultModel> getYearlyPlanner(Authentication auth, @RequestBody PlannerRequestModel param) {

        logger().info("PlannerApiController, getYearlyPlanner");
        ResponseResultModel result = new ResponseResultModel();
        return ResponseEntity.ok(result);
    }

    /**
     * @apiNote 다가오는 일정 N일 (기본 7일)
     * @param   auth
     * @param   param
     * */
    @RequestMapping(value = "/upcoming", method = RequestMethod.GET)
    public ResponseEntity<ResponseResultModel> getUpComing(Authentication auth, @RequestBody UpCommingRequestModel param) {

        logger().info("PlannerApiController, getUpComing");
        ResponseResultModel result = new ResponseResultModel();
        return ResponseEntity.ok(result);
    }
}
