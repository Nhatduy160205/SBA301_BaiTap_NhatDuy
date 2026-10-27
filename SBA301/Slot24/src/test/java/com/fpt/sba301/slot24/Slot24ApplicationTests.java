package com.fpt.sba301.slot24;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fpt.sba301.slot24.dto.LoginRequest;
import com.fpt.sba301.slot24.dto.SignupRequest;
import com.fpt.sba301.slot24.entity.AppUser;
import com.fpt.sba301.slot24.repository.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class Slot24ApplicationTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    // T01: Signup valid -> 201 Created & DB password encoded
    @Test
    void t01_signup_returns201() throws Exception {
        SignupRequest req = new SignupRequest("student24@example.com", "Sba301@2026");
        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email", is("student24@example.com")))
                .andExpect(jsonPath("$.role", is("USER")));

        AppUser saved = userRepository.findByEmail("student24@example.com").orElseThrow();
        org.junit.jupiter.api.Assertions.assertTrue(passwordEncoder.matches("Sba301@2026", saved.getPasswordHash()));
        org.junit.jupiter.api.Assertions.assertNotEquals("Sba301@2026", saved.getPasswordHash());
    }

    // T02: Signup duplicate -> 409 Conflict
    @Test
    void t02_signupDuplicate_returns409() throws Exception {
        SignupRequest req = new SignupRequest("student24@example.com", "Sba301@2026");
        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());

        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict());
    }

    // T03: Login valid -> 200 + Bearer token
    @Test
    void t03_loginValid_returnsToken() throws Exception {
        SignupRequest signup = new SignupRequest("student24@example.com", "Sba301@2026");
        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isCreated());

        LoginRequest login = new LoginRequest("student24@example.com", "Sba301@2026");
        mvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.tokenType", is("Bearer")));
    }

    // T04: Login wrong password -> 401 Unauthorized
    @Test
    void t04_loginWrongPassword_returns401() throws Exception {
        SignupRequest signup = new SignupRequest("student24@example.com", "Sba301@2026");
        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isCreated());

        LoginRequest login = new LoginRequest("student24@example.com", "WrongPassword");
        mvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized());
    }

    // T05: Protected endpoint /users/me without token -> 403 / 401
    @Test
    void t05_usersMeWithoutToken_fails() throws Exception {
        mvc.perform(get("/users/me"))
                .andExpect(status().isForbidden());
    }

    // T06: Protected endpoint /users/me with valid Bearer token -> 200 OK
    @Test
    void t06_usersMeWithValidToken_returns200() throws Exception {
        SignupRequest signup = new SignupRequest("student24@example.com", "Sba301@2026");
        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isCreated());

        LoginRequest login = new LoginRequest("student24@example.com", "Sba301@2026");
        MvcResult res = mvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn();

        String body = res.getResponse().getContentAsString();
        String token = objectMapper.readTree(body).get("accessToken").asText();

        mvc.perform(get("/users/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("student24@example.com")));
    }
}
