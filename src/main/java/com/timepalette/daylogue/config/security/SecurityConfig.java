package com.timepalette.daylogue.config.security;

import com.timepalette.daylogue.service.auth.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

//    private final AuthService userService;
//    private static String secretKey = "my-secret-key-123123";

    private static final String[] PERMIT_ALL = {
            "/api/auth/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };

    // 인증 없이 접근 가능한 공개 API만 열어둠
    private static final String[] AUTH_PUBLIC = {
            "/api/auth/login",
            "/api/auth/Login",
            "/api/auth/signup",
            "/api/auth/SignUp",
            "/api/auth/token/refresh",
            "/api/auth/Refresh",
            "/api/auth/password-reset/**",
            "/api/auth/phone/**",
            "/api/auth/find-id",
            "/api/auth/oauth/**"
    };

    private static final String[] SWAGGER_PUBLIC = {
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/demo-ui.html"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtTokenProvider jwtTokenProvider) throws Exception {

        http
                // CORS는 WebConfig + 여기(cors) 둘 다 맞아야 안전
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"success\":false,\"data\":null,\"message\":\"UNAUTHORIZED\",\"errorCode\":\"AUTH_TOKEN_INVALID\"}");
                        })
                        .accessDeniedHandler((req, res, e) -> {
                            res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"success\":false,\"data\":null,\"message\":\"FORBIDDEN\",\"errorCode\":\"AUTH_FORBIDDEN\"}");
                        })
                )
                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers(
//                                "/demo-ui.html",
//                                "/swagger-ui/**",
//                                "/v3/api-docs/**",
//                                "/swagger-ui.html"
//                        ).permitAll()
//
//                        // OPTIONS 프리플라이트 허용(특히 CORS)
////                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//                        .anyRequest().authenticated()
                        // 프리플라이트 허용
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 공개 엔드포인트
                        .requestMatchers(SWAGGER_PUBLIC).permitAll()
                        .requestMatchers(AUTH_PUBLIC).permitAll()

                        // 나머지는 인증 필요
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults())
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);
//                .addFilterBefore(new JwtAuthenticationFilter(userService, secretKey), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
