package com.timepalette.daylogue.model.dto.settings.dashboard;

import java.time.LocalDateTime;
import java.util.Map;

public record DashboardLayoutResultDto (
		boolean updated,
		String scope,
		Map<String, String> layoutsByBp,
		LocalDateTime uAt
) {
}
