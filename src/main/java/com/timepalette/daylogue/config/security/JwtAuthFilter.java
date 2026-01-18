package com.timepalette.daylogue.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;

/**
 *
 */
public class JwtAuthFilter extends OncePerRequestFilter {
    private static final List<String> SKIP_PATH_PREFIXES = List.of(
            "/api/auth/login",
            "/api/auth/signup",
            "/api/auth/token/refresh",
            "/api/auth/password-reset",
            "/api/auth/phone",
            "/api/auth/find-id",
            "/api/auth/oauth",

            "/api/auth/",
            "/v3/api-docs",
            "/swagger-ui",
            "/swagger-ui.html",
            "/demo-ui.html"
    );

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        for (String p : SKIP_PATH_PREFIXES) {
            if (uri.startsWith(p)) return true;
        }
        return false;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            String token = resolveBearerToken(request);

//            if (token != null && jwtTokenProvider.validate(token)) {
//                SecurityContextHolder.getContext().setAuthentication(jwtTokenProvider.getAuthentication(token));
//            }

            // token이 없거나, validate=false면 그냥 인증 없이 진행 → 보호 자원 접근 시 entryPoint가 401 처리
            filterChain.doFilter(request, response);

        } finally {
            // 여기서 clearContext() 하면 downstream에서 인증이 사라지므로 하면 안 됨
            // SecurityContext는 요청 스레드 단위로 관리되고, SecurityContextHolderFilter가 정리해줌.
        }
    }

    private String resolveBearerToken(HttpServletRequest request) {
        String bearer = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (!StringUtils.hasText(bearer)) return null;
        if (!bearer.startsWith("Bearer ")) return null;
        String token = bearer.substring(7);
        return StringUtils.hasText(token) ? token : null;
    }
}
