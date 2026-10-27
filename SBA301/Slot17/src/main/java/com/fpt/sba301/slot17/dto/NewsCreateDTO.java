package com.fpt.sba301.slot17.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class NewsCreateDTO {

    @NotBlank(message = "Title cannot be blank")
    private String title;

    private String content;

    @NotNull(message = "categoryId is required")
    private Long categoryId;

    private List<String> tagNames;

    public NewsCreateDTO() {}

    public NewsCreateDTO(String title, String content, Long categoryId, List<String> tagNames) {
        this.title = title;
        this.content = content;
        this.categoryId = categoryId;
        this.tagNames = tagNames;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public List<String> getTagNames() { return tagNames; }
    public void setTagNames(List<String> tagNames) { this.tagNames = tagNames; }
}
