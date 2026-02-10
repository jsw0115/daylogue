package com.timepalette.daylogue.model.dto.settings.dashboard;

import java.util.Map;

public record DashboardLayoutUpsertRequest(
		String scope,                 // "all" | "current"
		Map<String, String> layoutsByBp // bp -> layouts JSON 문자열(react-grid-layout layouts)
) {
}
