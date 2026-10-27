package com.fpt.sba301.slot16.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fpt.sba301.slot16.exception.NewsNotFoundException;
import com.fpt.sba301.slot16.model.NewsRequestDTO;
import com.fpt.sba301.slot16.model.NewsResponseDTO;
import com.fpt.sba301.slot16.service.NewsService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NewsController.class)
class NewsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private NewsService newsService;

    @Test
    @DisplayName("GET /api/news returns 200 OK and list of articles")
    void testGetAllNews_Success() throws Exception {
        NewsResponseDTO article = new NewsResponseDTO(1L, "Spring Boot Testing", "Content", "Prof. Phuc", "Tech", LocalDateTime.now());
        when(newsService.getAllNews(null, null)).thenReturn(List.of(article));

        mockMvc.perform(get("/api/news"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].title").value("Spring Boot Testing"));

        verify(newsService, times(1)).getAllNews(null, null);
    }

    @Test
    @DisplayName("GET /api/news/{id} returns 200 OK when item exists")
    void testGetNewsById_Found() throws Exception {
        NewsResponseDTO article = new NewsResponseDTO(1L, "Spring Boot Testing", "Content", "Prof. Phuc", "Tech", LocalDateTime.now());
        when(newsService.getNewsById(1L)).thenReturn(article);

        mockMvc.perform(get("/api/news/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Spring Boot Testing"));

        verify(newsService, times(1)).getNewsById(1L);
    }

    @Test
    @DisplayName("GET /api/news/{id} returns 404 NOT FOUND when item does not exist")
    void testGetNewsById_NotFound() throws Exception {
        when(newsService.getNewsById(999L)).thenThrow(new NewsNotFoundException("News article with ID #999 does not exist."));

        mockMvc.perform(get("/api/news/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"));

        verify(newsService, times(1)).getNewsById(999L);
    }

    @Test
    @DisplayName("POST /api/news returns 201 CREATED with valid payload")
    void testCreateNews_Success() throws Exception {
        NewsRequestDTO request = new NewsRequestDTO("New Architecture Guide", "Extensive content", "Prof. Phuc", "Engineering");
        NewsResponseDTO response = new NewsResponseDTO(10L, "New Architecture Guide", "Extensive content", "Prof. Phuc", "Engineering", LocalDateTime.now());

        when(newsService.createNews(any(NewsRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/news")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/news/10"))
                .andExpect(jsonPath("$.id").value(10L))
                .andExpect(jsonPath("$.title").value("New Architecture Guide"));

        verify(newsService, times(1)).createNews(any(NewsRequestDTO.class));
    }

    @Test
    @DisplayName("POST /api/news returns 400 BAD REQUEST when mandatory fields are missing")
    void testCreateNews_ValidationError() throws Exception {
        NewsRequestDTO invalidRequest = new NewsRequestDTO("", "", "", "");

        mockMvc.perform(post("/api/news")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));

        verify(newsService, never()).createNews(any());
    }

    @Test
    @DisplayName("PUT /api/news/{id} returns 200 OK with updated entity")
    void testUpdateNews_Success() throws Exception {
        NewsRequestDTO request = new NewsRequestDTO("Updated Architecture", "New Content", "Author", "Tech");
        NewsResponseDTO response = new NewsResponseDTO(1L, "Updated Architecture", "New Content", "Author", "Tech", LocalDateTime.now());

        when(newsService.updateNews(eq(1L), any(NewsRequestDTO.class))).thenReturn(response);

        mockMvc.perform(put("/api/news/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Architecture"));

        verify(newsService, times(1)).updateNews(eq(1L), any(NewsRequestDTO.class));
    }

    @Test
    @DisplayName("DELETE /api/news/{id} returns 204 NO CONTENT")
    void testDeleteNews_Success() throws Exception {
        doNothing().when(newsService).deleteNews(1L);

        mockMvc.perform(delete("/api/news/1"))
                .andExpect(status().isNoContent());

        verify(newsService, times(1)).deleteNews(1L);
    }
}
