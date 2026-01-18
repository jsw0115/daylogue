package com.timepalette.daylogue.model.dto.common;

import lombok.*;

@Getter
@Setter
public class ResponseResultModel {

	public boolean isSuccess;
	public String message;
	public String errorCode;
	public Object data;
}
