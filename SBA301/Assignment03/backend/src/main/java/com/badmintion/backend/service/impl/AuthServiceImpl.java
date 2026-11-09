package com.badmintion.backend.service.impl;

import com.badmintion.backend.dto.AuthRequest;
import com.badmintion.backend.dto.AuthResponse;
import com.badmintion.backend.dto.RegisterRequest;
import com.badmintion.backend.entity.Customer;
import com.badmintion.backend.exception.BadRequestException;
import com.badmintion.backend.repository.CustomerRepository;
import com.badmintion.backend.security.CustomUserDetails;
import com.badmintion.backend.security.JwtTokenProvider;
import com.badmintion.backend.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider,
                           CustomerRepository customerRepository,
                           PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = tokenProvider.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .role(userDetails.getRole())
                .email(userDetails.getEmail())
                .fullName(userDetails.getFullName())
                .customerId(userDetails.getCustomerId())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (customerRepository.existsByEmailAddress(request.getEmailAddress().trim())) {
            throw new BadRequestException("Email address already registered: " + request.getEmailAddress());
        }

        Customer customer = Customer.builder()
                .customerFullName(request.getCustomerFullName().trim())
                .telephone(request.getTelephone().trim())
                .emailAddress(request.getEmailAddress().trim().toLowerCase())
                .customerBirthday(request.getCustomerBirthday())
                .customerStatus(1) // Active by default
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        customer = customerRepository.save(customer);

        CustomUserDetails userDetails = CustomUserDetails.builder()
                .email(customer.getEmailAddress())
                .password(customer.getPassword())
                .fullName(customer.getCustomerFullName())
                .customerId(customer.getCustomerID())
                .role("ROLE_CUSTOMER")
                .active(true)
                .build();

        String token = tokenProvider.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .role("ROLE_CUSTOMER")
                .email(customer.getEmailAddress())
                .fullName(customer.getCustomerFullName())
                .customerId(customer.getCustomerID())
                .build();
    }
}

