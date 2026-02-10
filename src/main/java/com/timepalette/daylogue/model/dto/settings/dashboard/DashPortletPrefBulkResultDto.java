package com.timepalette.daylogue.model.dto.settings.dashboard;

import java.util.List;

public record DashPortletPrefBulkResultDto (
		boolean updated,
		int updatedCount,
		List<DashPortletPrefDto> prefs
) {
}
