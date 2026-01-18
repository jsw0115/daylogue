package com.timepalette.daylogue.controller.planner;

import com.timepalette.daylogue.controller.BaseApiController;
import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.planner.RoutineRequestModel;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * 플래너 등 로직에서 사용
 * @since 2025.12.26
 */
@Tag(name = "Planner", description = "플래너 정보를 가져오고 저장하는 API")
@Validated
@RestController
@RequestMapping("/api/planner")
public class PlannerApiApiController extends BaseApiController {

    /**
     * @apiNote 데일리 플래너 정보를 가져오는 메서드
     * @param param
     * */
    @RequestMapping(value = "/daily", method = RequestMethod.GET)
    public ResponseEntity<ResponseResultModel> dailyPlanner(@RequestBody RoutineRequestModel param) {

        ResponseResultModel result = new ResponseResultModel();
        return ResponseEntity.ok(result);
    }
}
