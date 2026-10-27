package com.fpt.sba301.slot26.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class Dtos {
    public record SignupRequest(
        @Email(message = "Email must be valid")
        @NotBlank(message = "Email is required")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 100, message = "Password must be at least 8 chars")
        String password,

        String role
    ) {}

    public record LoginRequest(
        @Email(message = "Email must be valid")
        @NotBlank(message = "Email is required")
        String email,

        @NotBlank(message = "Password is required")
        String password
    ) {}

    public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresIn
    ) {}

    public record UserResponse(
        Long id,
        String email,
        String role
    ) {}

    public record OrchidRequest(
        @NotBlank(message = "Orchid name is required")
        String orchidName,
        Boolean isNatural,
        String orchidDescription,
        String orchidCategory,
        Boolean isAttractive,
        String orchidURL
    ) {}

    public record OrchidResponse(
        Integer orchidId,
        String orchidName,
        Boolean isNatural,
        String orchidDescription,
        String orchidCategory,
        Boolean isAttractive,
        String orchidURL
    ) {}
}