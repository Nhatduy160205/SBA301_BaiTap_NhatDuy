package com.fpt.sba301.slot14.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FUNewsManagementSystem REST API Specification")
                        .version("1.0.0")
                        .description("Comprehensive REST API contract for News and Content Management in SBA301 Slot 14.")
                        .contact(new Contact()
                                .name("SBA301 Teaching Team")
                                .email("phucpt10@fpt.edu.vn")
                                .url("https://fpt.edu.vn"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://springdoc.org")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Development Server")
                ));
    }
}
