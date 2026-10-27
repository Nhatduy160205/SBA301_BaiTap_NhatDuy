package com.fpt.sba301.slot16.model;

import java.time.LocalDateTime;

public class NewsResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String author;
    private String category;
    private LocalDateTime createdAt;

    public NewsResponseDTO() {
    }

    public NewsResponseDTO(Long id, String title, String content, String author, String category, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.category = category;
        this.createdAt = createdAt;
    }

    public static NewsResponseDTO fromEntity(News news) {
        return new NewsResponseDTO(
                news.getId(),
                news.getTitle(),
                news.getContent(),
                news.getAuthor(),
                news.getCategory(),
                news.getCreatedAt()
        );
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
