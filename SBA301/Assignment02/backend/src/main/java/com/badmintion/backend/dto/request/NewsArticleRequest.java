/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * DTO: NewsArticleRequest
 */
package com.badmintion.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticleRequest {

    private String newsArticleID;

    @NotBlank(message = "Tiêu đề tin tức không được để trống")
    private String newsTitle;

    private String headline;

    @NotBlank(message = "Nội dung bài viết không được để trống")
    private String newsContent;

    private String newsSource;

    @NotNull(message = "Danh mục không được để trống")
    private Short categoryID;

    @Builder.Default
    private Boolean newsStatus = true;

    private Short createdByID;

    private Short updatedByID;

    private List<Integer> tagIDs;
}
