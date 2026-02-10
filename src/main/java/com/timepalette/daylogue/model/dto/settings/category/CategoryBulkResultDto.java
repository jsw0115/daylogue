package com.timepalette.daylogue.model.dto.settings.category;

import java.util.List;

public record CategoryBulkResultDto(
		List<Item> categories
) {
	public enum Op { add, update, delete }

	public record Item(
			Op op,
			String id,       // update/delete 필수
			String name,     // add 필수, update 선택
			String color,    // add 필수, update 선택
			String icon,     // 선택
			Integer ord      // 선택
	) {}
}
