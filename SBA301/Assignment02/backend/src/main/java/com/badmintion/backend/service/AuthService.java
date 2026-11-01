/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Service: AuthService
 */
package com.badmintion.backend.service;

import com.badmintion.backend.dto.request.LoginRequest;
import com.badmintion.backend.dto.response.AccountResponse;

public interface AuthService {
    AccountResponse login(LoginRequest request);
}
