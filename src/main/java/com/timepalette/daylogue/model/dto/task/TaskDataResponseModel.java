package com.timepalette.daylogue.model.dto.task;

import com.timepalette.daylogue.model.dto.common.RepeatCommonModel;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskDataResponseModel {
    
    private String userId;
    private String taskId;
    /**
     * 간단/상세 등록 여부 
     * 등록일자
     * 수정일자
     * 할 일 제목 
     * 카테고리 
     * 소요시간
     * 에너지 레벨 
     * 반복 여부
     * 반복 설정
     */
    private boolean isSipmleRegist = true;
    private String regDate;
    private String updateDate;
    private String title;
    private int category;   // ENUM 관리
    private int minutes;
    private int energyLevel;
    private boolean isRepeat;
    private RepeatCommonModel repeat;
}
