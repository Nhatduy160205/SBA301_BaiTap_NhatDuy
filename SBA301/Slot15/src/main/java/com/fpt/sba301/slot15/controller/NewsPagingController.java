package com.fpt.sba301.slot15.controller;

import com.fpt.sba301.slot15.dto.NewsV1DTO;
import com.fpt.sba301.slot15.service.NewsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/news")
public class NewsPagingController {
    private final NewsService service;

    public NewsPagingController(NewsService service) {
        this.service = service;
    }

    /**
     * Page pagination: returns content along with totalElements and totalPages
     * Example: /api/news?page=0&size=5&sort=createdAt,desc
     */
    @GetMapping
    public ResponseEntity<Page<NewsV1DTO>> getNewsPage(
            @PageableDefault(page = 0, size = 10)
            @SortDefault(sort = "id", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(service.getNewsPage(pageable));
    }

    /**
     * Slice pagination: does NOT execute expensive COUNT(*) query, only checks if hasNext exists
     * Example: /api/news/slice?page=0&size=10
     */
    @GetMapping("/slice")
    public ResponseEntity<Slice<NewsV1DTO>> getActiveNewsSlice(
            @PageableDefault(page = 0, size = 10)
            @SortDefault(sort = "id", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(service.getActiveNewsSlice(pageable));
    }
}
