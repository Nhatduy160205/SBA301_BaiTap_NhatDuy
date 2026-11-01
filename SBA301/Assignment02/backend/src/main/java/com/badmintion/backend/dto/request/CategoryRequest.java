/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * DTO: CategoryRequest
 */
package com.badmintion.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRequest {

    @NotBlank(message = "Tên danh mục không được để trống")
    private String categoryName;

    private String categoryDesciption;

    private Short parentCategoryID;

    @Builder.Default
    private Boolean isActive = true;
}
