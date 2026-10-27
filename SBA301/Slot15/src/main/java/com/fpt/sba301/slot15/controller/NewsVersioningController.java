package com.fpt.sba301.slot15.controller;

import com.fpt.sba301.slot15.dto.NewsV1DTO;
import com.fpt.sba301.slot15.dto.NewsV2DTO;
import com.fpt.sba301.slot15.service.NewsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class NewsVersioningController {
    private final NewsService service;

    public NewsVersioningController(NewsService service) {
        this.service = service;
    }

    // 1. URI Path Versioning: /api/v1/news vs /api/v2/news
    @GetMapping("/v1/news")
    public ResponseEntity<List<NewsV1DTO>> getNewsV1Path() {
        return ResponseEntity.ok(service.getAllV1());
    }

    @GetMapping("/v2/news")
    public ResponseEntity<List<NewsV2DTO>> getNewsV2Path() {
        return ResponseEntity.ok(service.getAllV2());
    }

    @GetMapping("/v1/news/{id}")
    public ResponseEntity<NewsV1DTO> getNewsV1PathById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getV1ById(id));
    }

    @GetMapping("/v2/news/{id}")
    public ResponseEntity<NewsV2DTO> getNewsV2PathById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getV2ById(id));
    }

    // 2. Query Parameter Versioning: /api/versioned-news?version=1
    @GetMapping(value = "/versioned-news", params = "version=1")
    public ResponseEntity<List<NewsV1DTO>> getNewsV1Param() {
        return ResponseEntity.ok(service.getAllV1());
    }

    @GetMapping(value = "/versioned-news", params = "version=2")
    public ResponseEntity<List<NewsV2DTO>> getNewsV2Param() {
        return ResponseEntity.ok(service.getAllV2());
    }

    // 3. Header Versioning: X-API-Version=1 vs 2
    @GetMapping(value = "/versioned-news", headers = "X-API-Version=1")
    public ResponseEntity<List<NewsV1DTO>> getNewsV1Header() {
        return ResponseEntity.ok(service.getAllV1());
    }

    @GetMapping(value = "/versioned-news", headers = "X-API-Version=2")
    public ResponseEntity<List<NewsV2DTO>> getNewsV2Header() {
        return ResponseEntity.ok(service.getAllV2());
    }

    // 4. Content Negotiation / Media Type Versioning
    @GetMapping(value = "/versioned-news", produces = "application/vnd.fpt.news.v1+json")
    public ResponseEntity<List<NewsV1DTO>> getNewsV1MediaType() {
        return ResponseEntity.ok(service.getAllV1());
    }

    @GetMapping(value = "/versioned-news", produces = "application/vnd.fpt.news.v2+json")
    public ResponseEntity<List<NewsV2DTO>> getNewsV2MediaType() {
        return ResponseEntity.ok(service.getAllV2());
    }
}
