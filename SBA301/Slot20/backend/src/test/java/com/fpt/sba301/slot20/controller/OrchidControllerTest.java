package com.fpt.sba301.slot20.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fpt.sba301.slot20.entity.Orchid;
import com.fpt.sba301.slot20.entity.OrchidCategory;
import com.fpt.sba301.slot20.exception.ResourceNotFoundException;
import com.fpt.sba301.slot20.service.IOrchidService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrchidController.class)
class OrchidControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IOrchidService orchidService;

    @Test
    void getAllOrchids_ShouldReturn200AndJsonList() throws Exception {
        OrchidCategory cat = new OrchidCategory(1L, "Cattleya");
        Orchid o1 = new Orchid(1L, "Cattleya Queen", true, true, "Desc", "url", cat);
        when(orchidService.getAllOrchids(null)).thenReturn(List.of(o1));

        mockMvc.perform(get("/orchids/")
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].orchidName", is("Cattleya Queen")));
    }

    @Test
    void getOrchidById_WhenExists_ShouldReturn200() throws Exception {
        OrchidCategory cat = new OrchidCategory(1L, "Cattleya");
        Orchid o1 = new Orchid(5L, "Test Orchid", true, true, "Desc", "url", cat);
        when(orchidService.getOrchidById(5L)).thenReturn(o1);

        mockMvc.perform(get("/orchids/5")
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(jsonPath("$.orchidID", is(5)))
                .andExpect(jsonPath("$.orchidName", is("Test Orchid")));
    }

    @Test
    void getOrchidById_WhenNotFound_ShouldReturn404() throws Exception {
        when(orchidService.getOrchidById(999L)).thenThrow(new ResourceNotFoundException("Orchid not found with id: 999"));

        mockMvc.perform(get("/orchids/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.message", is("Orchid not found with id: 999")));
    }

    @Test
    void createOrchid_WhenValid_ShouldReturn201() throws Exception {
        OrchidCategory cat = new OrchidCategory(1L, "Cattleya");
        Orchid saved = new Orchid(12L, "New Orchid", true, false, "Desc", "url", cat);
        when(orchidService.createOrchid(any(Orchid.class))).thenReturn(saved);

        mockMvc.perform(post("/orchids/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saved))
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isCreated())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(jsonPath("$.orchidID", is(12)));
    }

    @Test
    void deleteOrchid_WhenExists_ShouldReturn204() throws Exception {
        doNothing().when(orchidService).deleteOrchid(10L);

        mockMvc.perform(delete("/orchids/10")
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isNoContent())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    @Test
    void preflightCorsOptions_ShouldReturn200AndAllowHeaders() throws Exception {
        mockMvc.perform(options("/orchids/")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "Content-Type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(header().exists("Access-Control-Allow-Methods"));
    }
}
