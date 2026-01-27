package com.timepalette.daylogue.model.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserAuthDataResponseModel {

	private String userId = "";
	private String nickName = "";
	private String email = "";
	private String role = "";
}
