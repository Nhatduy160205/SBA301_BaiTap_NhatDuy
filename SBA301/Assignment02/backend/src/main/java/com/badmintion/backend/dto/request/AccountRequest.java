/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * DTO: AccountRequest
 */
package com.badmintion.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountRequest {

    @NotBlank(message = "Tên tài khoản không được để trống")
    private String accountName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String accountEmail;

    @NotNull(message = "Vai trò không được để trống (1: Admin, 2: Staff)")
    private Integer accountRole;

    private String accountPassword; // Có thể để trống khi update nếu không muốn đổi pass
}
