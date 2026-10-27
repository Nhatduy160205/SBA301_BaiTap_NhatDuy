package com.fpt.sba301.slot14.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Request payload for creating or replacing a news article")
public class NewsCreateDTO {

    @Schema(description = "Title of the news article", example = "Deep Learning Trends in 2026", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Title must not be blank")
    @Size(min = 5, max = 150, message = "Title must be between 5 and 150 characters")
    private String title;

    @Schema(description = "Full article content and text", example = "Comprehensive breakdown of agentic workflows and transformer architectures.", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Content must not be blank")
    private String content;

    @Schema(description = "Author name", example = "Dr. Alan Turing", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Author is required")
    private String author;

    @Schema(description = "Assigned category", example = "AI & Data Science", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Category is required")
    private String category;

    public NewsCreateDTO() {
    }

    public NewsCreateDTO(String title, String content, String author, String category) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.category = category;
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
