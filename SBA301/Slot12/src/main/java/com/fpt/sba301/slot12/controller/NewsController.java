package com.fpt.sba301.slot12.controller;

import com.fpt.sba301.slot12.model.ApiResponse;
import com.fpt.sba301.slot12.model.News;
import com.fpt.sba301.slot12.service.NewsService;
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
    public ResponseEntity<ApiResponse<List<News>>> getAllNews(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId) {
        List<News> news = newsService.getAllNews(keyword, categoryId);
        return ResponseEntity.ok(ApiResponse.ok("Retrieved news articles successfully.", news));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<News>> getNewsById(@PathVariable Long id) {
        News news = newsService.getNewsById(id);
        return ResponseEntity.ok(ApiResponse.ok("Found news article.", news));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<News>> createNews(@RequestBody News input) {
        News created = newsService.createNews(input);
        URI location = URI.create("/api/news/" + created.getId());
        return ResponseEntity.created(location)
                .body(ApiResponse.ok("News article created successfully.", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<News>> updateNews(@PathVariable Long id, @RequestBody News input) {
        News updated = newsService.updateNews(id, input);
        return ResponseEntity.ok(ApiResponse.ok("News article updated successfully.", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
