package com.timepalette.daylogue.config.security;

import com.timepalette.daylogue.model.entity.auth.User;
import com.timepalette.daylogue.service.auth.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
//    private final AuthService userService;
//    private final String secretKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain filterChain) throws ServletException, IOException {

        String token = resolveToken(request);
        if (token != null && jwtTokenProvider.validate(token)) {
            SecurityContextHolder.getContext().setAuthentication(jwtTokenProvider.getAuthentication(token));
        }
//        String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
//
//        // Header의 Authorization 값이 비어있으면 => Jwt Token을 전송하지 않음 => 로그인 하지 않음
//        if(authorizationHeader == null) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        // Header의 Authorization 값이 'Bearer '로 시작하지 않으면 => 잘못된 토큰
//        if(!authorizationHeader.startsWith("Bearer ")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        // 전송받은 값에서 'Bearer ' 뒷부분(Jwt Token) 추출
//        String token = authorizationHeader.split(" ")[1];
//
//        // 전송받은 Jwt Token이 만료되었으면 => 다음 필터 진행(인증 X)
//        if(JwtTokenUtil.isExpired(token, secretKey)) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        // Jwt Token에서 loginId 추출
//        String loginId = JwtTokenUtil.getLoginId(token, secretKey);
//
//        // 추출한 loginId로 User 찾아오기
//        User loginUser = userService.getLoginUserByEmail(loginId);
//
//        // loginUser 정보로 UsernamePasswordAuthenticationToken 발급
//        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
//                loginUser.getId(), null, List.of(new SimpleGrantedAuthority(loginUser.getRole().name())));
//        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//
//        // 권한 부여
//        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (!StringUtils.hasText(bearer)) return null;
        if (!bearer.startsWith("Bearer ")) return null;
        String token = bearer.substring(7);
        return StringUtils.hasText(token) ? token : null;
    }
}
