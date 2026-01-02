package com.timepalette.daylogue.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;

@Configuration
@OpenAPIDefinition(info = @io.swagger.v3.oas.annotations.info.Info(title = "API 명세서", description = "API 명세서 테스트 입니다.", version = "v1"))
@RequiredArgsConstructor
public class OpenApiConfig {

    public static final String SECURITY_SCHEME_NAME = "bearerAuth";

    @Bean
    public OpenAPI openAPI() {

        SecurityScheme bearerAuthScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                // 아래 두 줄은 "명시용" (동작에 필수는 아니지만 Swagger UI에서 의도가 더 분명해짐)
                .in(SecurityScheme.In.HEADER)
                .name(HttpHeaders.AUTHORIZATION)
                .description("Authorization 헤더에 다음 형식으로 입력: Bearer {JWT}");

        return new OpenAPI()
                .info(new Info()
                        .title("TimeFlow API")
                        .description("Timebar Diary / Planner API")
                        .version("v1"))
                // 전역으로 bearerAuth 요구(모든 API에 자물쇠 표시)
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, bearerAuthScheme));
    }
}
