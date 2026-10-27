package com.fpt.sba301.slot14.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Represents a published or draft news article entity in FUNewsManagementSystem")
public class NewsDTO {

    @Schema(description = "Unique numeric identifier of the news article", example = "1")
    private Long id;

    @Schema(description = "Headline title of the article", example = "Spring Boot 3 REST Best Practices")
    private String title;

    @Schema(description = "Body text and content of the article", example = "Exploring 3-layer architecture and OpenAPI documentation.")
    private String content;

    @Schema(description = "Full name of the article author", example = "Prof. Phuc")
    private String author;

    @Schema(description = "Category taxonomy classification", example = "Technology")
    private String category;

    @Schema(description = "Publication timestamp", example = "2026-10-02T14:30:00")
    private LocalDateTime publishedAt;

    public NewsDTO() {
    }

    public NewsDTO(Long id, String title, String content, String author, String category, LocalDateTime publishedAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.category = category;
        this.publishedAt = publishedAt;
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

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }
}
