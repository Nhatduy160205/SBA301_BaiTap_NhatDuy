/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Service Implementation: AccountServiceImpl
 */
package com.badmintion.backend.service.impl;

import com.badmintion.backend.dto.request.AccountRequest;
import com.badmintion.backend.dto.request.ProfileUpdateRequest;
import com.badmintion.backend.dto.response.AccountResponse;
import com.badmintion.backend.entity.SystemAccount;
import com.badmintion.backend.exception.BusinessException;
import com.badmintion.backend.exception.ResourceNotFoundException;
import com.badmintion.backend.repository.NewsArticleRepository;
import com.badmintion.backend.repository.SystemAccountRepository;
import com.badmintion.backend.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final SystemAccountRepository accountRepository;
    private final NewsArticleRepository newsArticleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> getAllAccounts(String keyword) {
        List<SystemAccount> list;
        if (keyword != null && !keyword.trim().isEmpty()) {
            list = accountRepository.searchAccounts(keyword.trim());
        } else {
            list = accountRepository.findAll();
        }
        return list.stream().map(AccountResponse::fromEntity).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponse getAccountById(Short id) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản với ID: " + id));
        return AccountResponse.fromEntity(account);
    }

    @Override
    @Transactional
    public AccountResponse createAccount(AccountRequest request) {
        if (accountRepository.existsByAccountEmail(request.getAccountEmail().trim())) {
            throw new BusinessException("Email này đã được sử dụng trong hệ thống");
        }

        if (request.getAccountPassword() == null || request.getAccountPassword().trim().isEmpty()) {
            throw new BusinessException("Mật khẩu không được để trống khi tạo mới tài khoản");
        }

        SystemAccount account = SystemAccount.builder()
                .accountName(request.getAccountName().trim())
                .accountEmail(request.getAccountEmail().trim())
                .accountRole(request.getAccountRole())
                .accountPassword(request.getAccountPassword())
                .build();

        return AccountResponse.fromEntity(accountRepository.save(account));
    }

    @Override
    @Transactional
    public AccountResponse updateAccount(Short id, AccountRequest request) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản với ID: " + id));

        // Nếu thay đổi email, kiểm tra trùng lặp
        if (!account.getAccountEmail().equalsIgnoreCase(request.getAccountEmail().trim())) {
            if (accountRepository.existsByAccountEmail(request.getAccountEmail().trim())) {
                throw new BusinessException("Email mới đã tồn tại trên hệ thống");
            }
            account.setAccountEmail(request.getAccountEmail().trim());
        }

        account.setAccountName(request.getAccountName().trim());
        account.setAccountRole(request.getAccountRole());

        // Nếu có truyền mật khẩu mới thì cập nhật
        if (request.getAccountPassword() != null && !request.getAccountPassword().trim().isEmpty()) {
            account.setAccountPassword(request.getAccountPassword());
        }

        return AccountResponse.fromEntity(accountRepository.save(account));
    }

    @Override
    @Transactional
    public void deleteAccount(Short id) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản với ID: " + id));

        // RÀNG BUỘC THEO ĐỀ BÀI:
        // "the delete action will delete an account in the case this account is not belong to any news articles (created),
        // if the account is already created any news article, cannot delete."
        boolean hasCreatedArticles = newsArticleRepository.existsByCreatedBy_AccountID(id);
        if (hasCreatedArticles) {
            throw new BusinessException("Không thể xóa tài khoản này! Tài khoản đã từng tạo bài viết tin tức trong hệ thống.");
        }

        accountRepository.delete(account);
    }

    @Override
    @Transactional
    public AccountResponse updateProfile(Short id, ProfileUpdateRequest request) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản với ID: " + id));

        account.setAccountName(request.getAccountName().trim());

        // Nếu muốn đổi mật khẩu
        if (request.getNewPassword() != null && !request.getNewPassword().trim().isEmpty()) {
            if (request.getOldPassword() == null || !account.getAccountPassword().equals(request.getOldPassword())) {
                throw new BusinessException("Mật khẩu hiện tại không chính xác");
            }
            account.setAccountPassword(request.getNewPassword());
        }

        return AccountResponse.fromEntity(accountRepository.save(account));
    }
}
