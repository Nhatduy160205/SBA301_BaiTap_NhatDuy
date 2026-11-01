/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Service: AccountService
 */
package com.badmintion.backend.service;

import com.badmintion.backend.dto.request.AccountRequest;
import com.badmintion.backend.dto.request.ProfileUpdateRequest;
import com.badmintion.backend.dto.response.AccountResponse;

import java.util.List;

public interface AccountService {
    List<AccountResponse> getAllAccounts(String keyword);
    AccountResponse getAccountById(Short id);
    AccountResponse createAccount(AccountRequest request);
    AccountResponse updateAccount(Short id, AccountRequest request);
    void deleteAccount(Short id);
    AccountResponse updateProfile(Short id, ProfileUpdateRequest request);
}
