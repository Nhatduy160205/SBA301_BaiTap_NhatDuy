package com.fpt.sba301.slot12.controller;

import com.fpt.sba301.slot12.model.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public ResponseEntity<ApiResponse<Map<String, String>>> sayHello() {
        return ResponseEntity.ok(ApiResponse.ok(
                "Welcome to SBA301 - Slot 12 REST Fundamentals with Spring Boot",
                Map.of(
                        "module", "Slot 12 (Part A)",
                        "architecture", "3-Layer MVC (Controller -> Service -> Repository)",
                        "status", "Operational"
                )
        ));
    }
}
