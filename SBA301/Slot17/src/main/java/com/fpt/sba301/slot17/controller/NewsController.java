package com.fpt.sba301.slot17.controller;

import com.fpt.sba301.slot17.dto.NewsCreateDTO;
import com.fpt.sba301.slot17.dto.NewsDTO;
import com.fpt.sba301.slot17.service.NewsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public ResponseEntity<List<NewsDTO>> getAllNews(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Long categoryId) {
        if (title != null && !title.isBlank()) {
            return ResponseEntity.ok(newsService.searchByTitle(title));
        }
        if (categoryId != null) {
            return ResponseEntity.ok(newsService.getNewsByCategory(categoryId));
        }
        return ResponseEntity.ok(newsService.getAllNews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsDTO> getNewsById(@PathVariable Long id) {
        return ResponseEntity.ok(newsService.getNewsById(id));
    }

    @PostMapping
    public ResponseEntity<NewsDTO> createNews(@Valid @RequestBody NewsCreateDTO createDTO) {
        NewsDTO created = newsService.createNews(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsDTO> updateNews(@PathVariable Long id, @Valid @RequestBody NewsCreateDTO updateDTO) {
        NewsDTO updated = newsService.updateNews(id, updateDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }
}
