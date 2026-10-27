package com.fpt.sba301.slot24.service;

import com.fpt.sba301.slot24.dto.LoginRequest;
import com.fpt.sba301.slot24.dto.LoginResponse;
import com.fpt.sba301.slot24.dto.SignupRequest;
import com.fpt.sba301.slot24.dto.UserResponse;
import com.fpt.sba301.slot24.entity.AppUser;
import com.fpt.sba301.slot24.repository.AppUserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final AppUserRepository users;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(AppUserRepository users, PasswordEncoder encoder,
                       AuthenticationManager authenticationManager, JwtService jwtService) {
        this.users = users;
        this.encoder = encoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public UserResponse signup(SignupRequest req) {
        if (req == null || req.email() == null || req.password() == null) {
            throw new IllegalArgumentException("Signup credentials cannot be null");
        }
        // Business Rule: Email uniqueness check
        if (users.existsByEmail(req.email().trim())) {
            throw new IllegalStateException("EMAIL_EXISTS");
        }

        AppUser user = new AppUser();
        user.setEmail(req.email().trim());
        user.setPasswordHash(encoder.encode(req.password()));
        user.setRole("USER");
        user.setEnabled(true);

        AppUser saved = users.save(user);
        return new UserResponse(saved.getId(), saved.getEmail(), saved.getRole());
    }

    public LoginResponse login(LoginRequest req) {
        if (req == null || req.email() == null || req.password() == null) {
            throw new IllegalArgumentException("Login credentials cannot be null");
        }

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email().trim(), req.password())
        );

        UserDetails principal = (UserDetails) auth.getPrincipal();
        String token = jwtService.generateToken(principal);
        return new LoginResponse(token, "Bearer");
    }
}
