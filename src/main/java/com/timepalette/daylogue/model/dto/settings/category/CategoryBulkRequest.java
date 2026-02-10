package com.timepalette.daylogue.model.dto.settings.category;

import java.util.List;

public record CategoryBulkRequest (
		boolean updated,
		int addedCount,
		int updatedCount,
		int deletedCount,
		List<CategoryDto> categories,
		List<FailedItem> failed // 부분 실패를 허용한다면 사용(트랜잭션이면 보통 전체 실패)
) {
	public record FailedItem(
			String op,
			String id,
			String reason
	) {}
}
