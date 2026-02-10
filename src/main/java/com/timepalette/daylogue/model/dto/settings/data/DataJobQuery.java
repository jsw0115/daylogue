package com.timepalette.daylogue.model.dto.settings.data;

import java.time.LocalDateTime;

public record DataJobQuery (
		String typ,
		String st,
		LocalDateTime fromUtc,
		LocalDateTime toUtc,
		Integer limit
) {
}
