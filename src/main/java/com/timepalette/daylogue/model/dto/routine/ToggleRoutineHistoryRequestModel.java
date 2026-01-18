package com.timepalette.daylogue.model.dto.routine;

import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record ToggleRoutineHistoryRequestModel (
		@NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
		String status,   // done|missed|skip (선택, 없으면 서버 토글)
		String memo      // 선택(길게누름 편집)
) {}
