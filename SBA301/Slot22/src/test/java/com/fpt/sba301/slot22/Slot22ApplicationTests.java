package com.fpt.sba301.slot22;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fpt.sba301.slot22.dto.CategoryRequest;
import com.fpt.sba301.slot22.entity.Category;
import com.fpt.sba301.slot22.entity.NewsArticle;
import com.fpt.sba301.slot22.repository.CategoryRepository;
import com.fpt.sba301.slot22.repository.NewsArticleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class Slot22ApplicationTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private NewsArticleRepository newsArticleRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Category seed1;
    private Category seed2;

    @BeforeEach
    void setUp() {
        newsArticleRepository.deleteAll();
        categoryRepository.deleteAll();

        seed1 = categoryRepository.save(new Category(null, "Academic News", "Announcements", null, true));
        seed2 = categoryRepository.save(new Category(null, "Student Affairs", "Events", null, true));
    }

    // T01: GET /api/categories -> 200
    @Test
    void t01_getCategories_returns200() throws Exception {
        mvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(2))));
    }

    // T02: GET /api/categories/{id} -> 200
    @Test
    void t02_getExistingId_returns200() throws Exception {
        mvc.perform(get("/api/categories/" + seed1.getCategoryId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categoryName", is("Academic News")));
    }

    // T03: GET /api/categories/{missingId} -> 404
    @Test
    void t03_getMissingId_returns404() throws Exception {
        mvc.perform(get("/api/categories/9999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code", is("NOT_FOUND")));
    }

    // T04: POST valid -> 201
    @Test
    void t04_postValid_returns201() throws Exception {
        CategoryRequest req = new CategoryRequest("Campus Safety", "Safety info", null, true);
        mvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.categoryId", notNullValue()))
                .andExpect(jsonPath("$.categoryName", is("Campus Safety")));
    }

    // T05: POST invalid blank name -> 400
    @Test
    void t05_postInvalid_returns400() throws Exception {
        CategoryRequest req = new CategoryRequest("", "Description", null, true);
        mvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    // T06: POST duplicate name -> 409
    @Test
    void t06_postDuplicate_returns409() throws Exception {
        CategoryRequest req = new CategoryRequest("Academic News", "Duplicate test", null, true);
        mvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code", is("CONFLICT")));
    }

    // T07: PUT existing -> 200
    @Test
    void t07_putExisting_returns200() throws Exception {
        CategoryRequest req = new CategoryRequest("Academic & Research News", "Updated desc", null, true);
        mvc.perform(put("/api/categories/" + seed1.getCategoryId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categoryName", is("Academic & Research News")));
    }

    // T08: PUT missing -> 404
    @Test
    void t08_putMissing_returns404() throws Exception {
        CategoryRequest req = new CategoryRequest("Nonexistent", "Desc", null, true);
        mvc.perform(put("/api/categories/9999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNotFound());
    }

    // T09: DELETE free category -> 204
    @Test
    void t09_deleteFreeCategory_returns204() throws Exception {
        mvc.perform(delete("/api/categories/" + seed2.getCategoryId()))
                .andExpect(status().isNoContent());
    }

    // T10: DELETE referenced category -> 409 Conflict (Business Rule!)
    @Test
    void t10_deleteReferencedCategory_returns409() throws Exception {
        // Create referencing article
        newsArticleRepository.save(new NewsArticle("ARTICLE01", "Title", "Headline", seed1, true));

        mvc.perform(delete("/api/categories/" + seed1.getCategoryId()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code", is("CONFLICT")));
    }

    // T11: Search keyword -> 200
    @Test
    void t11_searchKeyword_returns200() throws Exception {
        mvc.perform(get("/api/categories?keyword=Academic"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].categoryName", is("Academic News")));
    }

    // T12: Pagination -> 200
    @Test
    void t12_pagination_returns200() throws Exception {
        mvc.perform(get("/api/categories?page=0&size=1&sort=categoryName,asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.totalElements", is(2)));
    }
}
