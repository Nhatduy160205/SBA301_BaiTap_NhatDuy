package com.badmintion.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private String role; // "ROLE_STAFF" or "ROLE_CUSTOMER"
    private String email;
    private String fullName;
    private Integer customerId;
}
