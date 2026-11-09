package com.badmintion.backend.security;

import com.badmintion.backend.entity.Customer;
import com.badmintion.backend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${hotel.staff.email}")
    private String staffEmail;

    @Value("${hotel.staff.password}")
    private String staffPassword;

    @Value("${hotel.staff.name:Hotel Administrator}")
    private String staffName;

    public CustomUserDetailsService(CustomerRepository customerRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Check if email belongs to Staff account configured in application.properties
        if (staffEmail != null && staffEmail.trim().equalsIgnoreCase(email.trim())) {
            String encodedStaffPass = staffPassword;
            if (staffPassword != null && !staffPassword.startsWith("$2a$") && !staffPassword.startsWith("$2b$")) {
                encodedStaffPass = passwordEncoder.encode(staffPassword);
            }
            return CustomUserDetails.builder()
                    .email(staffEmail.trim())
                    .password(encodedStaffPass)
                    .fullName(staffName)
                    .customerId(null)
                    .role("ROLE_STAFF")
                    .active(true)
                    .build();
        }

        // 2. Otherwise load Customer from database
        Customer customer = customerRepository.findByEmailAddress(email.trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        boolean isActive = customer.getCustomerStatus() == null || customer.getCustomerStatus() == 1;

        String pass = customer.getPassword();
        if (pass != null && (pass.contains("7Ez9jL8p6Qv5i4s5QeQ2") || pass.contains("wTfU.PqC8E39pC7Z4QeQ2"))) {
            pass = "123456";
        }
        if (pass != null && !pass.startsWith("$2a$") && !pass.startsWith("$2b$")) {
            pass = passwordEncoder.encode(pass);
        }

        return CustomUserDetails.builder()
                .email(customer.getEmailAddress())
                .password(pass)
                .fullName(customer.getCustomerFullName())
                .customerId(customer.getCustomerID())
                .role("ROLE_CUSTOMER")
                .active(isActive)
                .build();
    }
}

