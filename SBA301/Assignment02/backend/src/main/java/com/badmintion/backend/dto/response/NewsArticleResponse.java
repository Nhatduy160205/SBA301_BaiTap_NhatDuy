/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * DTO: NewsArticleResponse
 */
package com.badmintion.backend.dto.response;

import com.badmintion.backend.entity.NewsArticle;
import com.badmintion.backend.entity.Tag;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticleResponse {
    private String newsArticleID;
    private String newsTitle;
    private String headline;
    private LocalDateTime createdDate;
    private String newsContent;
    private String newsSource;
    private Short categoryID;
    private String categoryName;
    private Boolean newsStatus;
    private Short createdByID;
    private String createdByName;
    private Short updatedByID;
    private String updatedByName;
    private LocalDateTime modifiedDate;
    private List<TagDto> tags;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TagDto {
        private Integer tagID;
        private String tagName;
        private String note;
    }

    public static NewsArticleResponse fromEntity(NewsArticle article) {
        if (article == null) return null;
        return NewsArticleResponse.builder()
                .newsArticleID(article.getNewsArticleID())
                .newsTitle(article.getNewsTitle())
                .headline(article.getHeadline())
                .createdDate(article.getCreatedDate())
                .newsContent(article.getNewsContent())
                .newsSource(article.getNewsSource())
                .categoryID(article.getCategory() != null ? article.getCategory().getCategoryID() : null)
                .categoryName(article.getCategory() != null ? article.getCategory().getCategoryName() : null)
                .newsStatus(article.getNewsStatus())
                .createdByID(article.getCreatedBy() != null ? article.getCreatedBy().getAccountID() : null)
                .createdByName(article.getCreatedBy() != null ? article.getCreatedBy().getAccountName() : null)
                .updatedByID(article.getUpdatedBy() != null ? article.getUpdatedBy().getAccountID() : null)
                .updatedByName(article.getUpdatedBy() != null ? article.getUpdatedBy().getAccountName() : null)
                .modifiedDate(article.getModifiedDate())
                .tags(article.getTags() != null ?
                        article.getTags().stream().map(t -> TagDto.builder()
                                .tagID(t.getTagID())
                                .tagName(t.getTagName())
                                .note(t.getNote())
                                .build()).collect(Collectors.toList()) : Collections.emptyList())
                .build();
    }
}
