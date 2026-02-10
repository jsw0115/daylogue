package com.timepalette.daylogue.model.dto.settings.data;

import java.time.LocalDateTime;

public record DataFileDto (
		String id,
		String userId,
		String kind,          // EXPORT | IMPORT | BACKUP
		String filename,
		String mime,
		long sizeB,
		String sha256,
		String storageKey,
		LocalDateTime expUtc,
		LocalDateTime cAt
) {
}
