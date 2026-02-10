package com.timepalette.daylogue.model.dto.settings.data;

import java.time.LocalDateTime;
import java.util.Map;

public record ImportMappingProfileDto (
		String id,
		String userId,
		String srcTyp,               // CSV | ICS
		String name,
		Map<String, Object> map,
		Map<String, Object> rule,
		LocalDateTime cAt,
		LocalDateTime uAt
) {
}
