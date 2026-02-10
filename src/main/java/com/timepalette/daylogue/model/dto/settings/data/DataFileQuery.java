package com.timepalette.daylogue.model.dto.settings.data;

import java.time.LocalDateTime;

public record DataFileQuery (
		String kind,
		LocalDateTime fromUtc,
		LocalDateTime toUtc,
		Integer limit
) {
}
