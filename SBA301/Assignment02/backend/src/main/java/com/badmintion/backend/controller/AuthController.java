/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Controller: AuthController
 */
package com.badmintion.backend.controller;

import com.badmintion.backend.dto.request.LoginRequest;
import com.badmintion.backend.dto.response.AccountResponse;
import com.badmintion.backend.dto.response.ApiResponse;
import com.badmintion.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AccountResponse>> login(@Valid @RequestBody LoginRequest request) {
        AccountResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công", response));
    }
}
