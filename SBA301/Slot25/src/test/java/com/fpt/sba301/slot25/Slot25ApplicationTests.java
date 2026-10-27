package com.fpt.sba301.slot25;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class Slot25ApplicationTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static String token;

    @Test
    @Order(1)
    void t01_signupValidUser_returns201() throws Exception {
        String payload = """
        {
            "email": "student25@example.com",
            "password": "Password@123"
        }
        """;

        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.email").value("student25@example.com"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    @Order(2)
    void t02_signupDuplicateEmail_returnsConflict() throws Exception {
        String payload = """
        {
            "email": "student25@example.com",
            "password": "Password@123"
        }
        """;

        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("EMAIL_EXISTS"));
    }

    @Test
    @Order(3)
    void t03_loginValid_returnsToken() throws Exception {
        String payload = """
        {
            "email": "student25@example.com",
            "password": "Password@123"
        }
        """;

        MvcResult result = mvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andReturn();

        JsonNode node = objectMapper.readTree(result.getResponse().getContentAsString());
        token = node.get("accessToken").asText();
    }

    @Test
    @Order(4)
    void t04_loginWrongPassword_returns401() throws Exception {
        String payload = """
        {
            "email": "student25@example.com",
            "password": "WrongPassword"
        }
        """;

        mvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(5)
    void t05_protectedMe_noToken_returns401() throws Exception {
        mvc.perform(get("/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(6)
    void t06_protectedMe_validToken_returns200() throws Exception {
        mvc.perform(get("/users/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("student25@example.com"));
    }

    @Test
    @Order(7)
    void t07_protectedUsers_validToken_returns200() throws Exception {
        mvc.perform(get("/users")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}