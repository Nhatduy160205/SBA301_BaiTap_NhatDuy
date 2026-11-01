/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Controller: NewsArticleController
 */
package com.badmintion.backend.controller;

import com.badmintion.backend.dto.request.NewsArticleRequest;
import com.badmintion.backend.dto.response.ApiResponse;
import com.badmintion.backend.dto.response.NewsArticleResponse;
import com.badmintion.backend.service.NewsArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsArticleController {

    private final NewsArticleService newsArticleService;

    // Xem tin tức công khai (Active = true), không cần đăng nhập
    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<NewsArticleResponse>>> getPublicArticles(
            @RequestParam(required = false) String keyword) {
        List<NewsArticleResponse> list = newsArticleService.getPublicArticles(keyword);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    // Xem chi tiết tin tức công khai
    @GetMapping("/public/{id}")
    public ResponseEntity<ApiResponse<NewsArticleResponse>> getPublicArticleById(@PathVariable String id) {
        NewsArticleResponse response = newsArticleService.getPublicArticleById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    // Lấy toàn bộ danh sách tin tức cho Staff quản lý
    @GetMapping
    public ResponseEntity<ApiResponse<List<NewsArticleResponse>>> getAllArticles(
            @RequestParam(required = false) String keyword) {
        List<NewsArticleResponse> list = newsArticleService.getAllArticles(keyword);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    // Lấy lịch sử tin tức do Staff hiện tại tạo
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<NewsArticleResponse>>> getMyHistory(
            @RequestParam Short staffId) {
        List<NewsArticleResponse> list = newsArticleService.getArticlesByStaff(staffId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    // Chi tiết tin tức
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NewsArticleResponse>> getArticleById(@PathVariable String id) {
        NewsArticleResponse response = newsArticleService.getArticleById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    // Tạo tin tức mới
    @PostMapping
    public ResponseEntity<ApiResponse<NewsArticleResponse>> createArticle(
            @Valid @RequestBody NewsArticleRequest request) {
        NewsArticleResponse response = newsArticleService.createArticle(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Tạo bài viết tin tức thành công", response));
    }

    // Cập nhật tin tức
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NewsArticleResponse>> updateArticle(
            @PathVariable String id,
            @Valid @RequestBody NewsArticleRequest request) {
        NewsArticleResponse response = newsArticleService.updateArticle(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật bài viết tin tức thành công", response));
    }

    // Xóa tin tức
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteArticle(@PathVariable String id) {
        newsArticleService.deleteArticle(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa bài viết tin tức thành công", null));
    }
}
