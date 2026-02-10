package com.timepalette.daylogue.model.dto.settings.dashboard;

import java.util.Map;

public record DashPortletPrefUpsertRequest(
		String portletId,
		Boolean vis,
		Integer ord,
		Map<String, Object> cfg
) {
}
