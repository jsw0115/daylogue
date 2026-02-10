package com.timepalette.daylogue.model.dto.settings.data;

import java.util.Map;

public record DataJobRequest (
		String typ,
		String fmt,
		Map<String, Object> params
) {
}
