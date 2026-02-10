package com.timepalette.daylogue.model.dto.settings.device;

public record UserDeviceUpsertRequest (
		String deviceId,
		String platform,
		String pushTok,
		String appVer
) {}
