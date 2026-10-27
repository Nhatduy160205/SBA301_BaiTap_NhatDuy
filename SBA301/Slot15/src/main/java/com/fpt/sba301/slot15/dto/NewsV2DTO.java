package com.fpt.sba301.slot15.dto;

import com.fpt.sba301.slot15.model.NewsEntity;
import java.util.List;

public class NewsV2DTO {
    private Long id;
    private String headline;
    private String summary;
    private String fullContent;
    private String author;
    private String category;
    private List<String> tags;
    private int viewCount;
    private String formattedDate;

    public NewsV2DTO() {
    }

    public static NewsV2DTO fromEntity(NewsEntity entity) {
        NewsV2DTO dto = new NewsV2DTO();
        dto.setId(entity.getId());
        dto.setHeadline(entity.getTitle());
        dto.setFullContent(entity.getContent());

        // Compute summary in service/dto
        String content = entity.getContent();
        dto.setSummary(content.length() > 60 ? content.substring(0, 60) + "..." : content);

        dto.setAuthor(entity.getAuthor());
        dto.setCategory(entity.getCategory());
        dto.setTags(List.of(entity.getCategory(), "Trending", "FPT-News"));
        dto.setViewCount(entity.getViewCount());
        dto.setFormattedDate(entity.getCreatedAt().toString());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getFullContent() {
        return fullContent;
    }

    public void setFullContent(String fullContent) {
        this.fullContent = fullContent;
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

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public int getViewCount() {
        return viewCount;
    }

    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }

    public String getFormattedDate() {
        return formattedDate;
    }

    public void setFormattedDate(String formattedDate) {
        this.formattedDate = formattedDate;
    }
}
