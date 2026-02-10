package com.timepalette.daylogue.model.entity.settings.converter;

import com.timepalette.daylogue.model.entity.settings.enums.TimeFmt;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class TimeFmtConverter implements AttributeConverter<TimeFmt, String> {

	@Override
	public String convertToDatabaseColumn(TimeFmt attribute) {
		return attribute == null ? null : attribute.getDbValue();
	}

	@Override
	public TimeFmt convertToEntityAttribute(String dbData) {
		return TimeFmt.fromDbValue(dbData);
	}
}