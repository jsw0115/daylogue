package com.timepalette.daylogue.model.dto.routine;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record RoutineCreateQuickRequestModel (
	@NotBlank	String name,
	@NotBlank String time,                 // "HH:mm" - 서비스에서 포맷 검증 권장
	List<String> daysOfWeek,               // ["MON","WED"] (선택)
	String categoryId                      // 선택
) {}
