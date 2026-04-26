package com.timepalette.daylogue.model.dto.task;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TaskReorderRequestModel {
    
    private String userId;
    private List<String> taskIds; // 변경된 순서대로 정렬된 할 일 ID 목록

}