package com.fpt.sba301.slot17.dto;

import java.util.List;

public class NewsDTO {
    private Long id;
    private String title;
    private String content;
    private CategoryDTO category;
    private List<TagDTO> tags;

    public NewsDTO() {}

    public NewsDTO(Long id, String title, String content, CategoryDTO category, List<TagDTO> tags) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.category = category;
        this.tags = tags;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void getContent(String content) { this.content = content; }
    public CategoryDTO getCategory() { return category; }
    public void setCategory(CategoryDTO category) { this.category = category; }
    public List<TagDTO> getTags() { return tags; }
    public void setTags(List<TagDTO> tags) { this.tags = tags; }
}
