package com.fpt.sba301.slot17.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fpt.sba301.slot17.dto.CategoryDTO;
import com.fpt.sba301.slot17.dto.NewsCreateDTO;
import com.fpt.sba301.slot17.dto.NewsDTO;
import com.fpt.sba301.slot17.exception.GlobalExceptionHandler;
import com.fpt.sba301.slot17.service.NewsService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NewsController.class)
@Import(GlobalExceptionHandler.class)
class NewsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private NewsService newsService;

    @Test
    @DisplayName("GET /api/news should return 200 and list")
    void getAllNews_ShouldReturn200() throws Exception {
        CategoryDTO cat = new CategoryDTO(1L, "Tech", "Tech desc", true);
        NewsDTO news = new NewsDTO(1L, "Spring Boot News", "Content", cat, Collections.emptyList());

        when(newsService.getAllNews()).thenReturn(List.of(news));

        mockMvc.perform(get("/api/news"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Spring Boot News")));
    }

    @Test
    @DisplayName("POST /api/news with valid body should return 201")
    void createNews_Valid_ShouldReturn201() throws Exception {
        CategoryDTO cat = new CategoryDTO(1L, "Tech", "Tech desc", true);
        NewsDTO news = new NewsDTO(1L, "Spring Boot News", "Content", cat, Collections.emptyList());
        NewsCreateDTO createDTO = new NewsCreateDTO("Spring Boot News", "Content", 1L, List.of("Java"));

        when(newsService.createNews(any(NewsCreateDTO.class))).thenReturn(news);

        mockMvc.perform(post("/api/news")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Spring Boot News")));
    }
}
