package com.badmintion.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDTO {

    private Integer customerID;

    @NotBlank(message = "Customer full name is required")
    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    private String customerFullName;

    @NotBlank(message = "Telephone is required")
    @Size(max = 20, message = "Telephone cannot exceed 20 characters")
    private String telephone;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String emailAddress;

    @NotNull(message = "Birthday is required")
    private LocalDate customerBirthday;

    private Integer customerStatus; // 1: Active, 0: Inactive

    // Password optional during update
    private String password;
}

