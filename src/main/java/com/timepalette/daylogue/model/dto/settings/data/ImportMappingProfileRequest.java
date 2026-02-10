package com.timepalette.daylogue.model.dto.settings.data;

import java.util.Map;

public record ImportMappingProfileRequest (
		String srcTyp,
		String name,
		Map<String, Object> map,
		Map<String, Object> rule
) {
}
