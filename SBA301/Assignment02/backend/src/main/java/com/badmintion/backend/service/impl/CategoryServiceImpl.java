/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Service Implementation: CategoryServiceImpl
 */
package com.badmintion.backend.service.impl;

import com.badmintion.backend.dto.request.CategoryRequest;
import com.badmintion.backend.dto.response.CategoryResponse;
import com.badmintion.backend.entity.Category;
import com.badmintion.backend.exception.BusinessException;
import com.badmintion.backend.exception.ResourceNotFoundException;
import com.badmintion.backend.repository.CategoryRepository;
import com.badmintion.backend.repository.NewsArticleRepository;
import com.badmintion.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final NewsArticleRepository newsArticleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories(String keyword, Boolean activeOnly) {
        List<Category> list;
        if (keyword != null && !keyword.trim().isEmpty()) {
            list = categoryRepository.searchCategories(keyword.trim());
        } else if (Boolean.TRUE.equals(activeOnly)) {
            list = categoryRepository.findByIsActiveTrue();
        } else {
            list = categoryRepository.findAll();
        }
        return list.stream().map(CategoryResponse::fromEntity).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Short id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));
        return CategoryResponse.fromEntity(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category parent = null;
        if (request.getParentCategoryID() != null) {
            parent = categoryRepository.findById(request.getParentCategoryID()).orElse(null);
        }

        Category category = Category.builder()
                .categoryName(request.getCategoryName().trim())
                .categoryDesciption(request.getCategoryDesciption())
                .parentCategory(parent)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        return CategoryResponse.fromEntity(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Short id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

        Category parent = null;
        if (request.getParentCategoryID() != null) {
            if (request.getParentCategoryID().equals(id)) {
                throw new BusinessException("Danh mục cha không thể là chính danh mục này");
            }
            parent = categoryRepository.findById(request.getParentCategoryID()).orElse(null);
        }

        category.setCategoryName(request.getCategoryName().trim());
        category.setCategoryDesciption(request.getCategoryDesciption());
        category.setParentCategory(parent);
        if (request.getIsActive() != null) {
            category.setIsActive(request.getIsActive());
        }

        return CategoryResponse.fromEntity(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(Short id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

        // RÀNG BUỘC THEO ĐỀ BÀI:
        // "The delete action will delete an item in the case this item is not belong to any news articles.
        // If the item is already stored in a news article cannot delete."
        boolean hasArticles = newsArticleRepository.existsByCategory_CategoryID(id);
        if (hasArticles) {
            throw new BusinessException("Không thể xóa danh mục này! Đang có bài viết tin tức thuộc danh mục này.");
        }

        categoryRepository.delete(category);
    }
}
