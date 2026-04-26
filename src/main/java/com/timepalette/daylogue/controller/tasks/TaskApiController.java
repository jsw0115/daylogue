package com.timepalette.daylogue.controller.tasks;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.timepalette.daylogue.controller.BaseApiController;
import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.task.TaskDataRequestModel;
import com.timepalette.daylogue.model.dto.task.TaskReorderRequestModel;
import com.timepalette.daylogue.model.dto.task.TaskRequestModel;
import com.timepalette.daylogue.service.task.TaskService;
import com.timepalette.daylogue.support.UserIdResolver;

import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Tasks API Controller
 * @category Tasks
 * @since 2026.04.26
 *
 * === 제공 스펙(요청서) ===
 * TSK-001 GET      /api/tasks                  : 할 일 목록 조회
 * TSK-002 GET      /api/tasks/{taskId}         : 단일 할 일 상세 조회
 * TSK-003 POST     /api/tasks                  : 할 일 생성
 * TSK-004 PUT      /api/tasks/{taskId}         : 할 일 수정
 * TSK-005 DELETE   /api/tasks/{taskId}         : 할 일 삭제
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
@RestController
@RequestMapping("/api/tasks")
@Validated
@Tag(name = "Tasks", description = "사용자의 할 일 정보를 가져오고 저장하는 API")
public class TaskApiController extends BaseApiController {
    
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private TaskService taskService;

    public TaskApiController (TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * 할 일 목록 조회
     * @return
      */
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<ResponseResultModel> getTasks(Authentication auth, @RequestBody TaskRequestModel req) {

        ResponseResultModel result = new ResponseResultModel();

        String userId = UserIdResolver.getUserIdByAuth(auth);

        req.setUserId(userId);
        result = taskService.getTasks(req);

        return ResponseEntity.ok(result);
    }

    /**
     * 단일 할 일 상세 조회
     * @return
      */
    @RequestMapping(value = "/{taskId}", method = RequestMethod.GET)
    public ResponseEntity<ResponseResultModel> getDetails(Authentication auth, @PathVariable String taskId, @RequestBody TaskRequestModel req) {

        logger.debug("GET getDetails, taskId : " + taskId);
        ResponseResultModel result = new ResponseResultModel();

        String userId = UserIdResolver.getUserIdByAuth(auth);

        req.setUserId(userId);
        req.setTaskId(taskId);
        result = taskService.getTaskDetail(req);

        return ResponseEntity.ok(result);
    }

    /**
     * 할 일 생성
     * @return
      */
    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<ResponseResultModel> saveTasks(Authentication auth, @RequestBody TaskDataRequestModel req) {

        logger.debug("POST saveTasks, taskId : ");
        ResponseResultModel result = new ResponseResultModel();

        String userId = UserIdResolver.getUserIdByAuth(auth);

        req.setUserId(userId);
        result = taskService.saveTaskData(req);

        return ResponseEntity.ok(result);
    }

    /**
     * 할 일 수정
     * @return
      */
    @RequestMapping(value = "/{taskId}", method = RequestMethod.PUT)
    public ResponseEntity<ResponseResultModel> modifyTasks(Authentication auth, @PathVariable String taskId, @RequestBody TaskDataRequestModel req) {

        logger.debug("PUT saveTasks, taskId : " + taskId);
        ResponseResultModel result = new ResponseResultModel();

        String userId = UserIdResolver.getUserIdByAuth(auth);

        req.setUserId(userId);
        req.setTaskId(taskId);
        result = taskService.modifyTaskData(req);

        return ResponseEntity.ok(result);
    }

    /**
     * 할 일 삭제
     * @return
      */
    @RequestMapping(value = "/{taskId}", method = RequestMethod.DELETE)
    public ResponseEntity<ResponseResultModel> deleteTasks(Authentication auth, @PathVariable String taskId, @RequestBody TaskDataRequestModel req) {

        logger.debug("DELETE saveTasks, taskId : " + taskId);
        ResponseResultModel result = new ResponseResultModel();

        String userId = UserIdResolver.getUserIdByAuth(auth);

        req.setUserId(userId);
        req.setTaskId(taskId);
        result = taskService.deleteTaskData(req);

        return ResponseEntity.ok(result);
    }

    /**
     * 할 일 완료 상태 토글 (상태 변경 전용 API)
     * @return
     */
    @RequestMapping(value = "/{taskId}/status", method = RequestMethod.PATCH)
    public ResponseEntity<ResponseResultModel> toggleTaskStatus(Authentication auth, @PathVariable String taskId, @RequestBody TaskDataRequestModel req) {

        logger.debug("PATCH toggleTaskStatus, taskId : " + taskId);
        ResponseResultModel result = new ResponseResultModel();

        String userId = UserIdResolver.getUserIdByAuth(auth);

        req.setUserId(userId);
        req.setTaskId(taskId);
        result = taskService.toggleTaskStatus(req);

        return ResponseEntity.ok(result);
    }

    /**
     * 할 일 순서 변경 (Drag & Drop 등)
     * @return
     */
    @RequestMapping(value = "/reorder", method = RequestMethod.PUT)
    public ResponseEntity<ResponseResultModel> reorderTasks(Authentication auth, @RequestBody TaskReorderRequestModel req) {

        logger.debug("PUT reorderTasks");
        ResponseResultModel result = new ResponseResultModel();

        String userId = UserIdResolver.getUserIdByAuth(auth);

        req.setUserId(userId);
        result = taskService.reorderTasks(req);

        return ResponseEntity.ok(result);
    }

    /**
     * 할 일 복제
     * @return
     */
    @RequestMapping(value = "/{taskId}/duplicate", method = RequestMethod.POST)
    public ResponseEntity<ResponseResultModel> duplicateTask(Authentication auth, @PathVariable String taskId, @RequestBody TaskRequestModel req) {

        logger.debug("POST duplicateTask, taskId : " + taskId);
        ResponseResultModel result = new ResponseResultModel();

        String userId = UserIdResolver.getUserIdByAuth(auth);

        req.setUserId(userId);
        req.setTaskId(taskId);
        result = taskService.duplicateTask(req);

        return ResponseEntity.ok(result);
    }
}
