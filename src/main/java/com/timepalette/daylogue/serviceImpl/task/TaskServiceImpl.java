package com.timepalette.daylogue.serviceImpl.task;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.task.TaskDataRequestModel;
import com.timepalette.daylogue.model.dto.task.TaskReorderRequestModel;
import com.timepalette.daylogue.model.dto.task.TaskRequestModel;
import com.timepalette.daylogue.model.entity.auth.User;
import com.timepalette.daylogue.repository.auth.UserRepository;
import com.timepalette.daylogue.service.task.TaskService;
import com.timepalette.daylogue.support.UserIdResolver;

@Service
public class TaskServiceImpl implements TaskService {
    
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    // --- 공통 검증 메서드 ---

    /**
     * 권한 확인 공통 메서드
     * @param taskId 대상 할 일 ID
     * @param userId 사용자 ID
     * @param action 권한 종류 (예: "READ", "UPDATE", "DELETE")
     */
    private void checkPermission(String taskId, String userId, String action) {
        // TODO: TaskRepository에서 taskId로 Task를 조회한 뒤,
        // 소유자(owner)이거나 공유 멤버인지, 그리고 요청한 action에 대한 권한이 있는지 검증
        // 권한이 없다면 throw new AccessDeniedException("권한이 없습니다.");
        logger.debug("권한 확인: taskId={}, userId={}, action={}", taskId, userId, action);
    }

    // --- 비즈니스 로직 ---

    /**
     * 할 일 목록 조회
     */
    @Override
    public ResponseResultModel getTasks(TaskRequestModel req) {
        ResponseResultModel result = new ResponseResultModel();
        
        // 아이디로 사용자 정보 확인 (유용한 사용자인지 확인)
        UserIdResolver.validateUser(req.getUserId());

        // 사용자와 관련된 할 일 정보 가져오기 
        // List<Task> tasks = taskRepository.findByUserId(req.getUserId());
        
        // 응답 모델 설정 
        result.setSuccess(true);
        result.setData("Task 목록 데이터"); // TODO: 실제 데이터 맵핑
        return result;
    }

    @Override
    public ResponseResultModel getTaskDetail(TaskRequestModel req) {
        ResponseResultModel result = new ResponseResultModel();
        
        // 아이디로 사용자 정보 확인 (유용한 사용자인지 확인)
        UserIdResolver.validateUser(req.getUserId());

        // 해당 할 일의 아이디와 사용자 아이디로 조회 권한이 있는지 확인
        checkPermission(req.getTaskId(), req.getUserId(), "READ");

        // 할 일 상세 정보 데이터 반환 
        // Task task = taskRepository.findById(req.getTaskId()).orElseThrow();

        // 응답 모델 설정 
        result.setSuccess(true);
        result.setData("Task 상세 데이터"); // TODO: 실제 데이터 맵핑
        return result;
    }

    @Override
    public ResponseResultModel saveTaskData(TaskDataRequestModel req) {
        ResponseResultModel result = new ResponseResultModel();
        
        // 아이디로 사용자 정보 확인 (유용한 사용자인지 확인)
        UserIdResolver.validateUser(req.getUserId());

        // 해당 할 일의 데이터 설정
        // Task task = new Task(); task.setTitle(req.getTitle()); ...

        // DB 저장 
        // taskRepository.save(task);

        // 응답 모델 설정 
        result.setSuccess(true);
        result.setData("저장된 Task 데이터");
        return result;
    }

    @Override
    public ResponseResultModel modifyTaskData(TaskDataRequestModel req) {
        ResponseResultModel result = new ResponseResultModel();
        
        // 아이디로 사용자 정보 확인 (유용한 사용자인지 확인)
        UserIdResolver.validateUser(req.getUserId());

        // 해당 할 일의 아이디와 사용자 아이디로 수정 권한이 있는지 확인 
        checkPermission(req.getTaskId(), req.getUserId(), "UPDATE");

        // 할 일 상세 정보 데이터 반환 
        // Task task = taskRepository.findById(req.getTaskId()).orElseThrow();

        // 할 일의 수정된 데이터 DB에 수정 
        // task.setTitle(req.getTitle()); taskRepository.save(task);

        // 응답 모델 설정 
        result.setSuccess(true);
        result.setData("수정된 Task 데이터");
        return result;
    }

    @Override
    public ResponseResultModel deleteTaskData(TaskDataRequestModel req) {
        ResponseResultModel result = new ResponseResultModel();
        
        // 아이디로 사용자 정보 확인 (유용한 사용자인지 확인)
        UserIdResolver.validateUser(req.getUserId());

        // 해당 할 일의 아이디와 사용자 아이디로 삭제 권한이 있는지 확인 
        checkPermission(req.getTaskId(), req.getUserId(), "DELETE");

        // 할 일의 상세 정보 데이터 반환 
        // Task task = taskRepository.findById(req.getTaskId()).orElseThrow();

        // 할 일의 DB에 삭제 설정으로 변경 
        // task.setDeletedAt(LocalDateTime.now()); taskRepository.save(task);

        // 응답 모델 설정 
        result.setSuccess(true);
        result.setMessage("삭제 완료");
        return result;
    }

    @Override
    public ResponseResultModel toggleTaskStatus(TaskDataRequestModel req) {
        ResponseResultModel result = new ResponseResultModel();

        // 아이디로 사용자 정보 확인 (유효한 사용자인지 확인)
        UserIdResolver.validateUser(req.getUserId());

        // 접속한 사용자가 할 일의 토글을 완료 처리 할 수 있는 사용자인지 확인 
        checkPermission(req.getTaskId(), req.getUserId(), "UPDATE_STATUS");

        // 할 일의 상태 변경 
        // Task task = taskRepository.findById(req.getTaskId()).orElseThrow();
        // task.setStatus(req.isDone() ? TaskStatus.DONE : TaskStatus.TODO);
        // taskRepository.save(task);

        // 응답 모델 설정 
        result.setSuccess(true);
        result.setData("상태 변경된 Task 데이터");
        return result;
    }

    @Override
    public ResponseResultModel reorderTasks(TaskReorderRequestModel req) {
        ResponseResultModel result = new ResponseResultModel();
        
        // 아이디로 사용자 정보 확인 (유효한 사용자인지 확인) 
        UserIdResolver.validateUser(req.getUserId());

        // 여러 개의 할 일에 대한 권한 확인 및 순서 변경 처리
        if (req.getTaskIds() != null && !req.getTaskIds().isEmpty()) {
            for (int i = 0; i < req.getTaskIds().size(); i++) {
                String taskId = req.getTaskIds().get(i);
                
                // 해당 할일의 순서 정보를 변경할 수 있는 권한이 있는지 확인
                checkPermission(taskId, req.getUserId(), "UPDATE_ORDER");
                
                // 사용자의 할 일 순서 변경하여 DB에 변경
                // Task task = taskRepository.findById(taskId).orElseThrow();
                // task.setOrderIndex(i);
                // taskRepository.save(task);
            }
        }
        
        // 사용자의 할 일 순서 변경하여 DB에 변경
        
        // 응답 모델 설정
        result.setSuccess(true);
        result.setMessage("순서 변경 완료");
        return result;
    }

    @Override
    public ResponseResultModel duplicateTask(TaskRequestModel req) {
        ResponseResultModel result = new ResponseResultModel();

        // 아이디로 사용자 정보 확인 (유효한 사용자인지 확인)
        UserIdResolver.validateUser(req.getUserId());

        // 해당 할 일을 열람할 수 있는 사용자인지 확인 
        checkPermission(req.getTaskId(), req.getUserId(), "READ");

        // 사용자의 할 일을 복제하여 DB에 저장 
        // Task originTask = taskRepository.findById(req.getTaskId()).orElseThrow();
        // Task duplicateTask = originTask.duplicate(); // 내부 복제 로직
        // taskRepository.save(duplicateTask);

        // 응답 모델 설정 
        result.setSuccess(true);
        result.setData("복제된 Task 데이터");
        return result;
    }
}
