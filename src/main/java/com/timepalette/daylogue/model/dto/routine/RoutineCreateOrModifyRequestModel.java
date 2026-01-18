package com.timepalette.daylogue.model.dto.routine;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record RoutineCreateOrModifyRequestModel(
		@NotBlank String name,
		@NotBlank String time,                 // scheduleType=anytime이면 서비스에서 예외 허용 가능(정책)
		@NotNull List<String> daysOfWeek,      // 스펙상 필수(weekly 전제). 확장 scheduleType에 따라 필수조건 바뀜.
		@NotNull Boolean isActive,
		@NotNull Boolean isNotify,

		// 선택
		String icon,
		String categoryId,

		// 스펙: 단일 오프셋(분)
		Integer notifyOffsetMinutes,

		// 확장: 다중 오프셋(분) 또는 문자열("10m") 수용
		List<Integer> notifyOffsetsMinutes,
		List<String> reminders,

		// 확장: scheduleType/interval/goal/pause/timebarLink (JSX 반영)
		String scheduleType,         // daily|weekly|interval|anytime
		Integer intervalDays,        // interval일 때
		String goalType,             // check|count|minutes
		Integer goalValue,
		LocalDate pauseUntil,
		TimebarLinkRequest timebarLink

){}
