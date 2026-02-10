package com.timepalette.daylogue.model.dto.settings.dashboard;

import java.util.List;
import java.util.Map;

public record DashPortletPrefBulkUpsertRequest (
		List<DashPortletPrefUpsertRequest> items
) {
}
