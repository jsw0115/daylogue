package com.timepalette.daylogue.model.dto.settings.category;

import lombok.*;

@Getter
@Setter
public class CategoryDto {

	private String op; // add|update|delete
	private String id; // update/delete
	private String name; // add/update
	private String color; // add/update
	private String icon; // add/update
	private Integer ord; // add/update
}
