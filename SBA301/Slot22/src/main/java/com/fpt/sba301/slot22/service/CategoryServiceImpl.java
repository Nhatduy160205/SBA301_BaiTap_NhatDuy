package com.fpt.sba301.slot22.service;

import com.fpt.sba301.slot22.dto.CategoryRequest;
import com.fpt.sba301.slot22.dto.CategoryResponse;
import com.fpt.sba301.slot22.entity.Category;
import com.fpt.sba301.slot22.exception.BusinessConflictException;
import com.fpt.sba301.slot22.exception.ResourceNotFoundException;
import com.fpt.sba301.slot22.repository.CategoryRepository;
import com.fpt.sba301.slot22.repository.NewsArticleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repository;
    private final NewsArticleRepository newsArticleRepository;

    public CategoryServiceImpl(CategoryRepository repository, NewsArticleRepository newsArticleRepository) {
        this.repository = repository;
        this.newsArticleRepository = newsArticleRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CategoryResponse> findAll(String keyword, Pageable pageable) {
        Page<Category> page = (keyword == null || keyword.isBlank())
                ? repository.findAll(pageable)
                : repository.findByCategoryNameContainingIgnoreCase(keyword.trim(), pageable);
        return page.map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getById(short id) {
        return toResponse(findEntity(id));
    }

    @Override
    public CategoryResponse create(CategoryRequest request) {
        validateRequest(request);
        // Business Rule: CategoryName must be unique
        if (repository.existsByCategoryNameIgnoreCase(request.categoryName().trim())) {
            throw new BusinessConflictException("Category name already exists: " + request.categoryName());
        }

        Category c = new Category();
        apply(c, request);
        return toResponse(repository.save(c));
    }

    @Override
    public CategoryResponse update(short id, CategoryRequest request) {
        validateRequest(request);
        Category c = findEntity(id);

        // Business Rule: CategoryName unique (excluding self)
        repository.findByCategoryNameIgnoreCase(request.categoryName().trim())
                .ifPresent(existing -> {
                    if (!existing.getCategoryId().equals(id)) {
                        throw new BusinessConflictException("Category name already exists: " + request.categoryName());
                    }
                });

        apply(c, request);
        return toResponse(repository.save(c));
    }

    @Override
    public void delete(short id) {
        Category c = findEntity(id);

        // Business Rule from Assignment 02: Cannot delete category referenced by NewsArticle
        if (newsArticleRepository.existsByCategory_CategoryId(id)) {
            throw new BusinessConflictException("Category " + id + " is used by one or more news articles and cannot be deleted");
        }

        repository.delete(c);
    }

    private Category findEntity(short id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category " + id + " not found"));
    }

    private void validateRequest(CategoryRequest r) {
        if (r == null) {
            throw new IllegalArgumentException("Category request body cannot be null");
        }
        if (r.categoryName() == null || r.categoryName().trim().isEmpty()) {
            throw new IllegalArgumentException("Category name is required and cannot be blank");
        }
        if (r.categoryDescription() == null || r.categoryDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Category description is required and cannot be blank");
        }
    }

    private void apply(Category c, CategoryRequest r) {
        c.setCategoryName(r.categoryName().trim());
        c.setCategoryDescription(r.categoryDescription().trim());
        c.setParentCategoryId(r.parentCategoryId());
        c.setActive(r.active() == null ? Boolean.TRUE : r.active());
    }

    private CategoryResponse toResponse(Category c) {
        return new CategoryResponse(
                c.getCategoryId(),
                c.getCategoryName(),
                c.getCategoryDescription(),
                c.getParentCategoryId(),
                c.getActive()
        );
    }
}
