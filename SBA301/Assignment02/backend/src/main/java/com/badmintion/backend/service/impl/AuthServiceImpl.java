/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Service Implementation: AuthServiceImpl
 */
package com.badmintion.backend.service.impl;

import com.badmintion.backend.dto.request.LoginRequest;
import com.badmintion.backend.dto.response.AccountResponse;
import com.badmintion.backend.entity.SystemAccount;
import com.badmintion.backend.exception.BusinessException;
import com.badmintion.backend.repository.SystemAccountRepository;
import com.badmintion.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final SystemAccountRepository accountRepository;

    @Override
    public AccountResponse login(LoginRequest request) {
        SystemAccount account = accountRepository.findByAccountEmail(request.getEmail().trim())
                .orElseThrow(() -> new BusinessException("Email hoặc mật khẩu không chính xác"));

        if (!account.getAccountPassword().equals(request.getPassword())) {
            throw new BusinessException("Email hoặc mật khẩu không chính xác");
        }

        return AccountResponse.fromEntity(account);
    }
}
