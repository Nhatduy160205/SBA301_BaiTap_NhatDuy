package com.fpt.sba301.slot16.controller;

import com.fpt.sba301.slot16.model.NewsRequestDTO;
import com.fpt.sba301.slot16.model.NewsResponseDTO;
import com.fpt.sba301.slot16.service.NewsService;
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
        return ResponseEntity.ok(newsService.getAllNews(search, category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsResponseDTO> getNewsById(@PathVariable Long id) {
        return ResponseEntity.ok(newsService.getNewsById(id));
    }

    @PostMapping
    public ResponseEntity<NewsResponseDTO> createNews(@Valid @RequestBody NewsRequestDTO requestDTO) {
        NewsResponseDTO created = newsService.createNews(requestDTO);
        return ResponseEntity.created(URI.create("/api/news/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsResponseDTO> updateNews(
            @PathVariable Long id,
            @Valid @RequestBody NewsRequestDTO requestDTO) {
        return ResponseEntity.ok(newsService.updateNews(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
