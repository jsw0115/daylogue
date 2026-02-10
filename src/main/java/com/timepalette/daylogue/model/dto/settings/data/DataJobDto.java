package com.timepalette.daylogue.model.dto.settings.data;

import java.time.LocalDateTime;
import java.util.Map;

public record DataJobDto (
		String id,
		String userId,
		String typ,             // EXPORT | IMPORT | BACKUP | RESTORE
		String fmt,             // JSON | CSV | ICS | XLSX | PDF
		String st,              // PENDING | RUNNING | DONE | FAILED | CANCELED
		Map<String, Object> params,
		String resultFileId,
		String errMsg,
		LocalDateTime cAt,
		LocalDateTime sUtc,
		LocalDateTime eUtc
) {
}
