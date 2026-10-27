package com.fpt.sba301.slot25.controller;

import com.fpt.sba301.slot25.dto.AuthResponse;
import com.fpt.sba301.slot25.dto.LoginRequest;
import com.fpt.sba301.slot25.dto.SignupRequest;
import com.fpt.sba301.slot25.dto.UserResponse;
import com.fpt.sba301.slot25.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthService authService;

    public AuthenticationController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}