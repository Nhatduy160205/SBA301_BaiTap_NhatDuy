package com.badmintion.backend.service;

import com.badmintion.backend.dto.AuthRequest;
import com.badmintion.backend.dto.AuthResponse;
import com.badmintion.backend.dto.RegisterRequest;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    AuthResponse register(RegisterRequest request);
}

