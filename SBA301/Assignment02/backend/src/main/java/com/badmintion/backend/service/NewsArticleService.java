/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Service: NewsArticleService
 */
package com.badmintion.backend.service;

import com.badmintion.backend.dto.request.NewsArticleRequest;
import com.badmintion.backend.dto.response.NewsArticleResponse;

import java.util.List;

public interface NewsArticleService {
    List<NewsArticleResponse> getPublicArticles(String keyword);
    NewsArticleResponse getPublicArticleById(String id);
    List<NewsArticleResponse> getAllArticles(String keyword);
    List<NewsArticleResponse> getArticlesByStaff(Short staffId);
    NewsArticleResponse getArticleById(String id);
    NewsArticleResponse createArticle(NewsArticleRequest request);
    NewsArticleResponse updateArticle(String id, NewsArticleRequest request);
    void deleteArticle(String id);
}
