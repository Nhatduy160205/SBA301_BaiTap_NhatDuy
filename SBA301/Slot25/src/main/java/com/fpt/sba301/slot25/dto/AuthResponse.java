package com.fpt.sba301.slot25.dto;

public record AuthResponse(
    String accessToken,
    String tokenType,
    long expiresIn
) {}