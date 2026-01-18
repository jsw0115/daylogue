package com.timepalette.daylogue.support;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

/**
 *  사용자 정보를 Authentication 에서 가져오는 메서드
 */
public final class UserIdResolver {

	private UserIdResolver() {}

	public static String getUserIdByAuth(Authentication auth) {

		// auth 정보가 없거나 인증된 사용자가 아닐 경우
		if (auth == null || !auth.isAuthenticated()) {
			throw SettingsValidator.unauthorized();
		}

		// 1) JWT Resource Server 사용 시
		if (auth instanceof JwtAuthenticationToken jwtAuth) {
			String sub = jwtAuth.getToken().getSubject();
			if (sub != null && !sub.isBlank()) return sub;
		}

		// 2) Principal이 String인 경우
		Object principal = auth.getPrincipal();
		if (principal instanceof String s && !s.isBlank()) return s;

		// 3) 커스텀 Principal(getUserId) 리플렉션 시도
		try {
			var m = principal.getClass().getMethod("getUserId");
			Object v = m.invoke(principal);
			if (v instanceof String s2 && !s2.isBlank()) return s2;
		} catch (Exception ignored) {}

		throw SettingsValidator.unauthorized();
	}
}
