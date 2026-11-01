/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * DTO: CategoryResponse
 */
package com.badmintion.backend.dto.response;

import com.badmintion.backend.entity.Category;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {
    private Short categoryID;
    private String categoryName;
    private String categoryDesciption;
    private Short parentCategoryID;
    private String parentCategoryName;
    private Boolean isActive;

    public static CategoryResponse fromEntity(Category category) {
        if (category == null) return null;
        return CategoryResponse.builder()
                .categoryID(category.getCategoryID())
                .categoryName(category.getCategoryName())
                .categoryDesciption(category.getCategoryDesciption())
                .parentCategoryID(category.getParentCategory() != null ? category.getParentCategory().getCategoryID() : null)
                .parentCategoryName(category.getParentCategory() != null ? category.getParentCategory().getCategoryName() : null)
                .isActive(category.getIsActive())
                .build();
    }
}
