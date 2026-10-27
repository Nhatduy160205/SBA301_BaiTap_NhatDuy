package com.fpt.sba301.slot13.controller;

import com.fpt.sba301.slot13.model.NewsRequestDTO;
import com.fpt.sba301.slot13.model.NewsResponseDTO;
import com.fpt.sba301.slot13.service.NewsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {
    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public ResponseEntity<List<NewsResponseDTO>> getAllNews(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        List<NewsResponseDTO> newsList = newsService.getAllNews(search, category);
        return ResponseEntity.ok(newsList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsResponseDTO> getNewsById(@PathVariable Long id) {
        NewsResponseDTO news = newsService.getNewsById(id);
        return ResponseEntity.ok(news);
    }

    @PostMapping
    public ResponseEntity<NewsResponseDTO> createNews(@Valid @RequestBody NewsRequestDTO requestDTO) {
        NewsResponseDTO created = newsService.createNews(requestDTO);
        URI location = URI.create("/api/news/" + created.getId());
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsResponseDTO> updateNews(
            @PathVariable Long id,
            @Valid @RequestBody NewsRequestDTO requestDTO) {
        NewsResponseDTO updated = newsService.updateNews(id, requestDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
