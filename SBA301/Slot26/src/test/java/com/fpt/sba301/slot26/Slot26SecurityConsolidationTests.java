package com.fpt.sba301.slot26;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fpt.sba301.slot26.service.JwtService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class Slot26SecurityConsolidationTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtService jwtService;

    private String userToken;
    private String adminToken;

    @BeforeAll
    void setup() throws Exception {
        // Sign up USER
        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                { "email": "regular.user@example.com", "password": "Password@123", "role": "USER" }
                """))
                .andExpect(status().isCreated());

        // Sign up ADMIN
        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                { "email": "admin.user@example.com", "password": "Password@123", "role": "ADMIN" }
                """))
                .andExpect(status().isCreated());

        // Login USER
        MvcResult userLoginRes = mvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                { "email": "regular.user@example.com", "password": "Password@123" }
                """))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode uNode = objectMapper.readTree(userLoginRes.getResponse().getContentAsString());
        userToken = uNode.get("accessToken").asText();

        // Login ADMIN
        MvcResult adminLoginRes = mvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                { "email": "admin.user@example.com", "password": "Password@123" }
                """))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode aNode = objectMapper.readTree(adminLoginRes.getResponse().getContentAsString());
        adminToken = aNode.get("accessToken").asText();
    }

    @Test
    @Order(1)
    void n01_protectedWithoutToken_returns401() throws Exception {
        mvc.perform(get("/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(2)
    void n02_malformedToken_returns401() throws Exception {
        mvc.perform(get("/users/me")
                .header("Authorization", "Bearer invalid-garbage-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(3)
    void n03_tamperedToken_returns401() throws Exception {
        String tampered = userToken.substring(0, userToken.length() - 5) + "ABCDE";
        mvc.perform(get("/users/me")
                .header("Authorization", "Bearer " + tampered))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(4)
    void n04_expiredToken_returns401() throws Exception {
        UserDetails expiredUser = User.withUsername("regular.user@example.com")
                .password("any")
                .roles("USER")
                .build();
        // Generate token with negative expiration (-5 seconds)
        String expiredToken = jwtService.generateToken(expiredUser, -5000);

        mvc.perform(get("/users/me")
                .header("Authorization", "Bearer " + expiredToken))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(5)
    void n05_userAccessAdminEndpoint_returns403() throws Exception {
        mvc.perform(get("/admin/users")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(6)
    void n06_adminAccessAdminEndpoint_returns200() throws Exception {
        mvc.perform(get("/admin/users")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @Order(7)
    void n07_publicOrchidsWithoutToken_returns200() throws Exception {
        mvc.perform(get("/orchids"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @Order(8)
    void n08_corsPreflightAllowedOrigin_returnsCorsHeaders() throws Exception {
        mvc.perform(options("/orchids")
                .header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "POST")
                .header("Access-Control-Request-Headers", "authorization,content-type"))
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    @Test
    @Order(9)
    void n09_corsDisallowedOrigin_noAllowHeader() throws Exception {
        mvc.perform(options("/orchids")
                .header("Origin", "http://evil.example")
                .header("Access-Control-Request-Method", "POST")
                .header("Access-Control-Request-Headers", "authorization,content-type"))
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }

    @Test
    @Order(10)
    void n10_loginBadPassword_returns401() throws Exception {
        mvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                { "email": "regular.user@example.com", "password": "WrongPassword" }
                """))
                .andExpect(status().isUnauthorized());
    }
}