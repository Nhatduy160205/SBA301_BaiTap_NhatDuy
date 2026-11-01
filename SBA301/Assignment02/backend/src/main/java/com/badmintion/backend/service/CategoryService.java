/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Service: CategoryService
 */
package com.badmintion.backend.service;

import com.badmintion.backend.dto.request.CategoryRequest;
import com.badmintion.backend.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories(String keyword, Boolean activeOnly);
    CategoryResponse getCategoryById(Short id);
    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse updateCategory(Short id, CategoryRequest request);
    void deleteCategory(Short id);
}
