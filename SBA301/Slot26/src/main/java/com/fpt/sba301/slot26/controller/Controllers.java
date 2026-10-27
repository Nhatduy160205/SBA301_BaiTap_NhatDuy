package com.fpt.sba301.slot26.controller;

import com.fpt.sba301.slot26.dto.Dtos.*;
import com.fpt.sba301.slot26.service.AuthService;
import com.fpt.sba301.slot26.service.OrchidService;
import com.fpt.sba301.slot26.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}

@RestController
@RequestMapping("/users")
class UserController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(Authentication authentication) {
        return ResponseEntity.ok(Map.of(
                "username", authentication.getName(),
                "authorities", authentication.getAuthorities()
        ));
    }
}

@RestController
@RequestMapping("/admin")
class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}

@RestController
@RequestMapping("/orchids")
class OrchidController {

    private final OrchidService orchidService;

    public OrchidController(OrchidService orchidService) {
        this.orchidService = orchidService;
    }

    @GetMapping
    public ResponseEntity<List<OrchidResponse>> getAll() {
        return ResponseEntity.ok(orchidService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrchidResponse> getById(@PathVariable int id) {
        return ResponseEntity.ok(orchidService.findById(id));
    }

    @PostMapping
    public ResponseEntity<OrchidResponse> create(@Valid @RequestBody OrchidRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orchidService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrchidResponse> update(@PathVariable int id, @Valid @RequestBody OrchidRequest req) {
        return ResponseEntity.ok(orchidService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        orchidService.delete(id);
        return ResponseEntity.noContent().build();
    }
}