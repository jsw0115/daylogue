package com.timepalette.daylogue.model.dto.settings.dashboard;

import java.time.LocalDateTime;
import java.util.Map;

public record DashPortletPrefDto (
		String id,
		String userId,
		String portletId,
		boolean vis,
		int ord,
		Map<String, Object> cfg,   // cfg_json
		LocalDateTime uAt
) {
}
