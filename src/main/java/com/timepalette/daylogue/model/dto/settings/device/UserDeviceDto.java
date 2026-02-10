package com.timepalette.daylogue.model.dto.settings.device;

import java.time.LocalDateTime;

public record UserDeviceDto (
		String id,
		String userId,
		String deviceId,
		String platform,          // WEB | ANDROID | IOS | DESKTOP
		String pushTok,           // 필요하면 마스킹해서 내려도 됨
		String appVer,
		LocalDateTime lastSeenUtc,
		LocalDateTime revokedUtc,
		LocalDateTime cAt,
		LocalDateTime uAt
) {
}
