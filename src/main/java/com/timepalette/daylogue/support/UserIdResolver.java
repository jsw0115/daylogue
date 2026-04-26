package com.timepalette.daylogue.support;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import com.timepalette.daylogue.model.entity.auth.User;
import com.timepalette.daylogue.service.auth.AuthService;

/**
 *  사용자 정보를 Authentication 에서 가져오는 메서드
 */
public final class UserIdResolver {

	public static AuthService authService;

	public UserIdResolver(AuthService authService) {
		this.authService = authService;
	}

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

    /**
     * 사용자 유효성 검사
     * @param userId 확인할 사용자 ID
     */
    public static boolean validateUser(String userId) {
        
        if (userId != null && userId.trim().isEmpty()) {
            
            User user = UserIdResolver.getUserInfo(userId);
            if (user != null) {

                return true;
            }
        }

        return false;
    }

	/**
	 * 
	 * 
	 */
	public static User getUserInfo(String userId) {

		User result = new User();
		if (userId == null || userId.trim().isEmpty()) {

			return result;
		} else {

			result = authService.getUserInfo(userId);
			return result;
		}
	}
}
