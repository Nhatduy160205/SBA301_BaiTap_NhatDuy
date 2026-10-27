package com.example.orchid.controller;

import com.example.orchid.controllers.OrchidController;
import com.example.orchid.exception.GlobalExceptionHandler;
import com.example.orchid.pojos.Orchid;
import com.example.orchid.pojos.OrchidCategory;
import com.example.orchid.services.IOrchidService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrchidController.class)
@Import(GlobalExceptionHandler.class)
class OrchidControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IOrchidService orchidService;

    private Orchid sampleOrchid;
    private OrchidCategory sampleCategory;

    @BeforeEach
    void setUp() {
        sampleCategory = new OrchidCategory(1L, "Dendrobium");
        sampleOrchid = new Orchid(1L, "Ceasar 4N", true, "Special Orchid", sampleCategory, true, "/images/orchid.svg");
    }

    @Test
    @DisplayName("T01: GET /api/orchids should return 200 and list")
    void getAll_ShouldReturnList() throws Exception {
        when(orchidService.getAll()).thenReturn(List.of(sampleOrchid));

        mockMvc.perform(get("/api/orchids"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].orchidName", is("Ceasar 4N")));
    }

    @Test
    @DisplayName("T02: GET /api/orchids?name=Ceasar should return 200 and filtered list")
    void searchByName_ShouldReturnFilteredList() throws Exception {
        when(orchidService.searchByName("Ceasar")).thenReturn(List.of(sampleOrchid));

        mockMvc.perform(get("/api/orchids").param("name", "Ceasar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].orchidName", is("Ceasar 4N")));
    }

    @Test
    @DisplayName("T03: GET /api/orchids/1 should return 200 and orchid details")
    void getById_Existing_ShouldReturnOrchid() throws Exception {
        when(orchidService.getById(1L)).thenReturn(Optional.of(sampleOrchid));

        mockMvc.perform(get("/api/orchids/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orchidID", is(1)))
                .andExpect(jsonPath("$.orchidName", is("Ceasar 4N")));
    }

    @Test
    @DisplayName("T04: GET /api/orchids/999 should return 404 Not Found")
    void getById_NotFound_ShouldReturn404() throws Exception {
        when(orchidService.getById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/orchids/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("T05: POST /api/orchids with valid data should return 201 Created")
    void create_Valid_ShouldReturn201() throws Exception {
        when(orchidService.create(any(Orchid.class))).thenReturn(sampleOrchid);

        mockMvc.perform(post("/api/orchids")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleOrchid)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orchidID", is(1)))
                .andExpect(jsonPath("$.orchidName", is("Ceasar 4N")));
    }

    @Test
    @DisplayName("T06: POST /api/orchids with invalid category should return 400 Bad Request")
    void create_InvalidCategory_ShouldReturn400() throws Exception {
        when(orchidService.create(any(Orchid.class)))
                .thenThrow(new IllegalArgumentException("Category not found: 999"));

        mockMvc.perform(post("/api/orchids")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleOrchid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Category not found: 999")));
    }

    @Test
    @DisplayName("T07: PUT /api/orchids/1 with valid data should return 200 OK")
    void update_Valid_ShouldReturn200() throws Exception {
        when(orchidService.update(eq(1L), any(Orchid.class))).thenReturn(Optional.of(sampleOrchid));

        mockMvc.perform(put("/api/orchids/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleOrchid)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orchidID", is(1)));
    }

    @Test
    @DisplayName("T08: PUT /api/orchids/999 should return 404 Not Found")
    void update_NotFound_ShouldReturn404() throws Exception {
        when(orchidService.update(eq(999L), any(Orchid.class))).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/orchids/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleOrchid)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("T09: DELETE /api/orchids/1 should return 204 No Content")
    void delete_Existing_ShouldReturn204() throws Exception {
        when(orchidService.delete(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/orchids/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("T10: DELETE /api/orchids/999 should return 404 Not Found")
    void delete_NotFound_ShouldReturn404() throws Exception {
        when(orchidService.delete(999L)).thenReturn(false);

        mockMvc.perform(delete("/api/orchids/999"))
                .andExpect(status().isNotFound());
    }
}
