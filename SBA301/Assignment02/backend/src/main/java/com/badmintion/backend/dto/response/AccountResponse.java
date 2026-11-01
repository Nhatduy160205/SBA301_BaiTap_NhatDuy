/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * DTO: AccountResponse
 */
package com.badmintion.backend.dto.response;

import com.badmintion.backend.entity.SystemAccount;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountResponse {
    private Short accountID;
    private String accountName;
    private String accountEmail;
    private Integer accountRole;

    public static AccountResponse fromEntity(SystemAccount account) {
        if (account == null) return null;
        return AccountResponse.builder()
                .accountID(account.getAccountID())
                .accountName(account.getAccountName())
                .accountEmail(account.getAccountEmail())
                .accountRole(account.getAccountRole())
                .build();
    }
}
