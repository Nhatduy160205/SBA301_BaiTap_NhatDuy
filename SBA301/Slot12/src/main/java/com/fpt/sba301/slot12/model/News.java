package com.fpt.sba301.slot12.model;

import java.time.LocalDateTime;

public class News {
    private Long id;
    private String title;
    private String content;
    private String author;
    private Long categoryId;
    private LocalDateTime publishedAt;
    private String status; // DRAFT, PUBLISHED, ARCHIVED

    public News() {
        this.publishedAt = LocalDateTime.now();
        this.status = "PUBLISHED";
    }

    public News(Long id, String title, String content, String author, Long categoryId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.categoryId = categoryId;
        this.publishedAt = LocalDateTime.now();
        this.status = "PUBLISHED";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
