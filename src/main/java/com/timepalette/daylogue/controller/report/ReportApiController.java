package com.timepalette.daylogue.controller.report;

import org.springframework.web.bind.annotation.RestController;

import com.timepalette.daylogue.controller.BaseApiController;
import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.report.ReportDataRequestModel;
import com.timepalette.daylogue.model.dto.report.ReportRequestModel;
import com.timepalette.daylogue.service.report.ReportService;
import com.timepalette.daylogue.service.task.TaskService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Rport API Controller
 * @category Reports
 * @since 2026.04.26
 * 
 * === 제공 스펙(요청서) ===
 * RTN-001 GET      /api/reports/{reportId}              : 리포트 상세 조회
 * RTN-002 POST     /api/reports/{reportId}              : 리포트 저장 (생성/수정)
 * RTN-003 POST     /api/reports/draft                   : AI 요약 초안 생성
 * RTN-004 GET      /api/reports/time-blocks             : 일간 업무 타임블록 조회
 * RTN-005 GET      /api/reports/{reportId}/sub-reports  : 기반(하위) 리포트 목록 조회
 *
 * === JSX 기준 확장(호환) ===
 * - scheduleType(daily|weekly|interval|anytime), intervalDays
 * - goalType(check|count|minutes), goalValue
 * - reminders 다중(문자열 "10m" 또는 분 int 목록)
 * - history: memo(선택), backfill(과거 날짜)
 *
 * 인증:
 * - 모든 API는 Authorization: Bearer <accessToken> 필요(스펙 Auth=Y)
 * - Controller에서는 보통 @PreAuthorize 또는 Spring Security Filter로 인증 강제
 */
@Tag(name = "Report", description = "업무 리포트 정보를 가져오고 저장하는 API")
@Validated
@RestController
@RequestMapping("/api/reports")
public class ReportApiController extends BaseApiController {
    
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private ReportService reportService;

    public ReportApiController (ReportService reportService) {
        this.reportService = reportService;
    }


    /**
     * 리포트 상세 조회
     * @apiNote 리포트 상세 조회
     * @return
      */
    @RequestMapping(value = "/{reportId}", method = RequestMethod.GET)
    public ResponseEntity<ResponseResultModel> getReports(Authentication auth, @PathVariable Long reportId, @RequestBody ReportRequestModel req) {

        ResponseResultModel result = new ResponseResultModel();

        return ResponseEntity.ok(result);
    }

    /**
     * 리포트 저장 및 수정
     * @apiNote 리포트 저장 및 수정
     * @return
      */
    @RequestMapping(value = "/{reportId}", method = RequestMethod.POST)
    public ResponseEntity<ResponseResultModel> saveReport(Authentication auth, @PathVariable Long reportId, @RequestBody ReportRequestModel req) {

        logger.debug("POST saveReport, reportId : " + reportId);
        ResponseResultModel result = new ResponseResultModel();

        return ResponseEntity.ok(result);
    }

    /**
     * AI 요약 초안 생성
     * @apiNote AI 요약 초안 생성
     * @return
      */
    @RequestMapping(value = "/draft", method = RequestMethod.POST)
    public ResponseEntity<ResponseResultModel> saveDraft(Authentication auth, @RequestBody ReportDataRequestModel req) {

        logger.debug("POST saveDraft");
        ResponseResultModel result = new ResponseResultModel();

        return ResponseEntity.ok(result);
    }

    /**
     * 일간 업무 타임블록 조회 
     * @apiNote 일간 업무 타임블록 조회 
     * @return
      */
    @RequestMapping(value = "/time-blocks", method = RequestMethod.GET)
    public ResponseEntity<ResponseResultModel> getTimeBlocks(Authentication auth, @RequestBody ReportDataRequestModel req) {

        logger.debug("GET getTimeBlocks");
        ResponseResultModel result = new ResponseResultModel();

        return ResponseEntity.ok(result);
    }

    /**
     * 할 일 삭제
     * @apiNote 할 일 삭제
     * @return
      */
    @RequestMapping(value = "/{reportId}/sub-reports", method = RequestMethod.GET)
    public ResponseEntity<ResponseResultModel> getSubReports(Authentication auth, @PathVariable Long reportId, @RequestBody ReportDataRequestModel req) {

        logger.debug("GET getSubReports, reportId : " + reportId);
        ResponseResultModel result = new ResponseResultModel();

        return ResponseEntity.ok(result);
    }

}
