package com.fpt.sba301.slot25.service;

import com.fpt.sba301.slot25.dto.AuthResponse;
import com.fpt.sba301.slot25.dto.LoginRequest;
import com.fpt.sba301.slot25.dto.SignupRequest;
import com.fpt.sba301.slot25.dto.UserResponse;
import com.fpt.sba301.slot25.entity.AppUser;
import com.fpt.sba301.slot25.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Value("${security.jwt.expiration-ms:900000}")
    private long expirationMs;

    public AuthService(AppUserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public UserResponse signup(SignupRequest request) {
        // Business logic strictly performed in Service Layer
        if (userRepository.existsByEmail(request.email().trim())) {
            throw new IllegalStateException("EMAIL_EXISTS");
        }

        AppUser user = new AppUser();
        user.setEmail(request.email().trim());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole("USER");
        user.setEnabled(true);

        AppUser saved = userRepository.save(user);
        return new UserResponse(saved.getId(), saved.getEmail(), saved.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        // Delegate authentication to Spring Security AuthenticationManager
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().trim(), request.password())
        );

        UserDetails principal = (UserDetails) auth.getPrincipal();
        String token = jwtService.generateToken(principal);
        return new AuthResponse(token, "Bearer", expirationMs / 1000);
    }
}