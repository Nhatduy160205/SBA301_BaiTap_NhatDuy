/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Service Implementation: NewsArticleServiceImpl
 */
package com.badmintion.backend.service.impl;

import com.badmintion.backend.dto.request.NewsArticleRequest;
import com.badmintion.backend.dto.response.NewsArticleResponse;
import com.badmintion.backend.entity.Category;
import com.badmintion.backend.entity.NewsArticle;
import com.badmintion.backend.entity.SystemAccount;
import com.badmintion.backend.entity.Tag;
import com.badmintion.backend.exception.BusinessException;
import com.badmintion.backend.exception.ResourceNotFoundException;
import com.badmintion.backend.repository.CategoryRepository;
import com.badmintion.backend.repository.NewsArticleRepository;
import com.badmintion.backend.repository.SystemAccountRepository;
import com.badmintion.backend.repository.TagRepository;
import com.badmintion.backend.service.NewsArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NewsArticleServiceImpl implements NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final CategoryRepository categoryRepository;
    private final SystemAccountRepository accountRepository;
    private final TagRepository tagRepository;

    @Override
    @Transactional(readOnly = true)
    public List<NewsArticleResponse> getPublicArticles(String keyword) {
        List<NewsArticle> list;
        if (keyword != null && !keyword.trim().isEmpty()) {
            list = newsArticleRepository.searchPublicArticles(keyword.trim());
        } else {
            list = newsArticleRepository.findByNewsStatusTrueOrderByCreatedDateDesc();
        }
        return list.stream().map(NewsArticleResponse::fromEntity).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public NewsArticleResponse getPublicArticleById(String id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .filter(a -> Boolean.TRUE.equals(a.getNewsStatus()))
                .orElseThrow(() -> new ResourceNotFoundException("Bài viết không tồn tại hoặc đã bị ẩn"));
        return NewsArticleResponse.fromEntity(article);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NewsArticleResponse> getAllArticles(String keyword) {
        List<NewsArticle> list;
        if (keyword != null && !keyword.trim().isEmpty()) {
            list = newsArticleRepository.searchAllArticles(keyword.trim());
        } else {
            list = newsArticleRepository.findAllByOrderByCreatedDateDesc();
        }
        return list.stream().map(NewsArticleResponse::fromEntity).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<NewsArticleResponse> getArticlesByStaff(Short staffId) {
        return newsArticleRepository.findByCreatedBy_AccountIDOrderByCreatedDateDesc(staffId)
                .stream().map(NewsArticleResponse::fromEntity).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public NewsArticleResponse getArticleById(String id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết với ID: " + id));
        return NewsArticleResponse.fromEntity(article);
    }

    @Override
    @Transactional
    public NewsArticleResponse createArticle(NewsArticleRequest request) {
        // Sinh ID tự động nếu client không truyền
        String articleId = request.getNewsArticleID();
        if (articleId == null || articleId.trim().isEmpty()) {
            articleId = "NA" + System.currentTimeMillis() % 1000000;
        } else {
            articleId = articleId.trim();
            if (newsArticleRepository.existsById(articleId)) {
                throw new BusinessException("Mã bài viết '" + articleId + "' đã tồn tại!");
            }
        }

        Category category = categoryRepository.findById(request.getCategoryID())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại"));

        if (request.getCreatedByID() == null) {
            throw new BusinessException("Thiếu thông tin người tạo bài viết");
        }

        SystemAccount createdBy = accountRepository.findById(request.getCreatedByID())
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản người tạo không tồn tại"));

        // Xử lý Tags
        Set<Tag> tags = new HashSet<>();
        if (request.getTagIDs() != null && !request.getTagIDs().isEmpty()) {
            tags.addAll(tagRepository.findAllById(request.getTagIDs()));
        }

        NewsArticle article = NewsArticle.builder()
                .newsArticleID(articleId)
                .newsTitle(request.getNewsTitle().trim())
                .headline(request.getHeadline())
                .createdDate(LocalDateTime.now())
                .newsContent(request.getNewsContent())
                .newsSource(request.getNewsSource())
                .category(category)
                .newsStatus(request.getNewsStatus() != null ? request.getNewsStatus() : true)
                .createdBy(createdBy)
                .updatedBy(createdBy)
                .modifiedDate(LocalDateTime.now())
                .tags(tags)
                .build();

        return NewsArticleResponse.fromEntity(newsArticleRepository.save(article));
    }

    @Override
    @Transactional
    public NewsArticleResponse updateArticle(String id, NewsArticleRequest request) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết với ID: " + id));

        Category category = categoryRepository.findById(request.getCategoryID())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại"));

        SystemAccount updatedBy = null;
        if (request.getUpdatedByID() != null) {
            updatedBy = accountRepository.findById(request.getUpdatedByID()).orElse(null);
        }

        article.setNewsTitle(request.getNewsTitle().trim());
        article.setHeadline(request.getHeadline());
        article.setNewsContent(request.getNewsContent());
        article.setNewsSource(request.getNewsSource());
        article.setCategory(category);
        if (request.getNewsStatus() != null) {
            article.setNewsStatus(request.getNewsStatus());
        }
        if (updatedBy != null) {
            article.setUpdatedBy(updatedBy);
        }
        article.setModifiedDate(LocalDateTime.now());

        // Cập nhật Tags
        if (request.getTagIDs() != null) {
            Set<Tag> newTags = new HashSet<>(tagRepository.findAllById(request.getTagIDs()));
            article.setTags(newTags);
        }

        return NewsArticleResponse.fromEntity(newsArticleRepository.save(article));
    }

    @Override
    @Transactional
    public void deleteArticle(String id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết với ID: " + id));
        newsArticleRepository.delete(article);
    }
}
