package com.timepalette.daylogue.model.dto.settings.dashboard;

import java.util.List;
import java.util.Map;

public record DashboardSettingsDto (
		String scope,
		Map<String, String> layoutsByBp,     // bp -> layouts JSON
		List<DashPortletPrefDto> portletPrefs // vis/ord/cfg
) {
}
