package com.fpt.sba301.slot13.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public ResponseEntity<Map<String, Object>> hello() {
        return ResponseEntity.ok(Map.of(
                "status", "RUNNING",
                "slot", "Slot 13 - REST Annotations & 3-Layer CRUD",
                "framework", "Spring Boot 3.3.4 (Java 21)",
                "endpoints", List.of("/api/news", "/api/news/{id}")
        ));
    }
}
