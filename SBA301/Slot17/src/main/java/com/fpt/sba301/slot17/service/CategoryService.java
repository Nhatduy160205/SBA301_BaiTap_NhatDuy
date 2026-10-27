package com.fpt.sba301.slot17.service;

import com.fpt.sba301.slot17.dto.CategoryDTO;
import com.fpt.sba301.slot17.entity.Category;
import com.fpt.sba301.slot17.exception.ResourceNotFoundException;
import com.fpt.sba301.slot17.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<CategoryDTO> getActiveCategories() {
        return categoryRepository.findByActiveTrueOrderByNameAsc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return toDTO(category);
    }

    @Transactional
    public CategoryDTO createCategory(String name, String description) {
        String normalized = name == null ? "" : name.trim();
        if (normalized.isBlank()) {
            throw new IllegalArgumentException("Category name is required and cannot be blank");
        }
        if (categoryRepository.existsByNameIgnoreCase(normalized)) {
            throw new IllegalArgumentException("Category name already exists: " + normalized);
        }
        Category category = new Category(normalized, description);
        Category saved = categoryRepository.save(category);
        return toDTO(saved);
    }

    @Transactional
    public CategoryDTO updateCategory(Long id, String name, String description, Boolean active) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        String normalized = name == null ? "" : name.trim();
        if (normalized.isBlank()) {
            throw new IllegalArgumentException("Category name is required and cannot be blank");
        }

        if (!category.getName().equalsIgnoreCase(normalized) && categoryRepository.existsByNameIgnoreCase(normalized)) {
            throw new IllegalArgumentException("Category name already exists: " + normalized);
        }

        category.setName(normalized);
        if (description != null) {
            category.setDescription(description);
        }
        if (active != null) {
            category.setActive(active);
        }

        return toDTO(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        // Business Rule: Cannot delete category if it has associated news items
        if (!category.getNewsItems().isEmpty()) {
            throw new IllegalArgumentException("Cannot delete category because it contains " + category.getNewsItems().size() + " news items");
        }

        categoryRepository.delete(category);
    }

    public CategoryDTO toDTO(Category category) {
        return new CategoryDTO(category.getId(), category.getName(), category.getDescription(), category.isActive());
    }
}
