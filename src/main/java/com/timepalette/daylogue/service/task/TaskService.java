package com.timepalette.daylogue.service.task;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.task.TaskDataRequestModel;
import com.timepalette.daylogue.model.dto.task.TaskReorderRequestModel;
import com.timepalette.daylogue.model.dto.task.TaskRequestModel;

public interface TaskService {

    ResponseResultModel getTasks(TaskRequestModel req);

    ResponseResultModel getTaskDetail(TaskRequestModel req);

    ResponseResultModel saveTaskData(TaskDataRequestModel req);

	ResponseResultModel modifyTaskData(TaskDataRequestModel req);

	ResponseResultModel deleteTaskData(TaskDataRequestModel req);

    ResponseResultModel toggleTaskStatus(TaskDataRequestModel req);

    ResponseResultModel reorderTasks(TaskReorderRequestModel req);

    ResponseResultModel duplicateTask(TaskRequestModel req);
    
}
