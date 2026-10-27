package com.fpt.sba301.slot24.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UserController {

    @GetMapping("/users/me")
    public Map<String, Object> me(Authentication authentication) {
        return Map.of(
                "name", authentication.getName(),
                "authorities", authentication.getAuthorities()
        );
    }

    @GetMapping("/admin/dashboard")
    public Map<String, Object> adminOnly(Authentication authentication) {
        return Map.of(
                "message", "Admin access granted",
                "admin", authentication.getName()
        );
    }
}
