package fu.se.lab06jwt;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import fu.se.lab06jwt.entities.User;
import fu.se.lab06jwt.services.JwtService;
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

import java.util.HashMap;

import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class Lab06SecurityIntegrationTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtService jwtService;

    private static String validJwtToken;

    @Test
    @Order(1)
    void t01_postSignup_valid_returns201_newHashedUser() throws Exception {
        String payload = """
        {
            "fullName": "SBA301 Student",
            "email": "student01@fpt.edu.vn",
            "password": "P@ssword123"
        }
        """;

        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.fullName").value("SBA301 Student"))
                .andExpect(jsonPath("$.email").value("student01@fpt.edu.vn"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @Order(2)
    void t02_postSignup_duplicateEmail_returns409() throws Exception {
        String payload = """
        {
            "fullName": "Duplicate Student",
            "email": "student01@fpt.edu.vn",
            "password": "P@ssword123"
        }
        """;

        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email already exists"));
    }

    @Test
    @Order(3)
    void t03_postLogin_valid_returns200_andJwt() throws Exception {
        String payload = """
        {
            "email": "student01@fpt.edu.vn",
            "password": "P@ssword123"
        }
        """;

        MvcResult result = mvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.expiresIn").value(3600000L))
                .andReturn();

        JsonNode node = objectMapper.readTree(result.getResponse().getContentAsString());
        validJwtToken = node.get("token").asText();
    }

    @Test
    @Order(4)
    void t04_postLogin_badPassword_returns401() throws Exception {
        String payload = """
        {
            "email": "student01@fpt.edu.vn",
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
    void t05_getUsersMe_noToken_returns401() throws Exception {
        mvc.perform(get("/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(6)
    void t06_getUsersMe_validToken_returns200_correctPrincipal() throws Exception {
        mvc.perform(get("/users/me")
                .header("Authorization", "Bearer " + validJwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("student01@fpt.edu.vn"))
                .andExpect(jsonPath("$.fullName").value("SBA301 Student"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @Order(7)
    void t07_getUsers_validToken_returns200_noPasswordLeak() throws Exception {
        mvc.perform(get("/users")
                .header("Authorization", "Bearer " + validJwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].password").doesNotExist());
    }

    @Test
    @Order(8)
    void t08_getUsersMe_malformedToken_returns401() throws Exception {
        mvc.perform(get("/users/me")
                .header("Authorization", "Bearer not.a.valid.jwt.token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(9)
    void t09_getUsersMe_tamperedToken_returns401() throws Exception {
        String tampered = validJwtToken.substring(0, validJwtToken.length() - 6) + "XXXXXX";
        mvc.perform(get("/users/me")
                .header("Authorization", "Bearer " + tampered))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(10)
    void t10_getUsersMe_expiredToken_returns401() throws Exception {
        User tempUser = new User(1, "Temp", "student01@fpt.edu.vn", "pw");
        // create token with negative TTL
        String expired = jwtService.generateToken(new HashMap<>(), tempUser, -10000L);

        mvc.perform(get("/users/me")
                .header("Authorization", "Bearer " + expired))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(11)
    void t11_signup_invalidEmail_returns400() throws Exception {
        String payload = """
        {
            "fullName": "Bad Email User",
            "email": "not-an-email",
            "password": "Password123"
        }
        """;

        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(12)
    void t12_signup_emptyPassword_returns400() throws Exception {
        String payload = """
        {
            "fullName": "Empty Password User",
            "email": "valid@fpt.edu.vn",
            "password": ""
        }
        """;

        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isBadRequest());
    }
}