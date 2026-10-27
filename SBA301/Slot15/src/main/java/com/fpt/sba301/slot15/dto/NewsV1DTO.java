package com.fpt.sba301.slot15.dto;

import com.fpt.sba301.slot15.model.NewsEntity;

public class NewsV1DTO {
    private Long id;
    private String title;
    private String content;
    private String author;
    private String category;

    public NewsV1DTO() {
    }

    public NewsV1DTO(Long id, String title, String content, String author, String category) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.category = category;
    }

    public static NewsV1DTO fromEntity(NewsEntity entity) {
        return new NewsV1DTO(
                entity.getId(),
                entity.getTitle(),
                entity.getContent(),
                entity.getAuthor(),
                entity.getCategory()
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
}
