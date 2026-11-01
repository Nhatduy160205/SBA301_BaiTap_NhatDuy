/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Controller: AccountController
 */
package com.badmintion.backend.controller;

import com.badmintion.backend.dto.request.AccountRequest;
import com.badmintion.backend.dto.request.ProfileUpdateRequest;
import com.badmintion.backend.dto.response.AccountResponse;
import com.badmintion.backend.dto.response.ApiResponse;
import com.badmintion.backend.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAllAccounts(
            @RequestParam(required = false) String keyword) {
        List<AccountResponse> list = accountService.getAllAccounts(keyword);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountById(@PathVariable Short id) {
        AccountResponse response = accountService.getAccountById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AccountResponse>> createAccount(@Valid @RequestBody AccountRequest request) {
        AccountResponse response = accountService.createAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Tạo tài khoản thành công", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> updateAccount(
            @PathVariable Short id,
            @Valid @RequestBody AccountRequest request) {
        AccountResponse response = accountService.updateAccount(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật tài khoản thành công", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable Short id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa tài khoản thành công", null));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<AccountResponse>> updateProfile(
            @PathVariable Short id,
            @Valid @RequestBody ProfileUpdateRequest request) {
        AccountResponse response = accountService.updateProfile(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin cá nhân thành công", response));
    }
}
