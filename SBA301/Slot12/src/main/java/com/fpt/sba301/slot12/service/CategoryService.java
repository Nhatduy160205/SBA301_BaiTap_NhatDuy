package com.fpt.sba301.slot12.service;

import com.fpt.sba301.slot12.model.Category;
import com.fpt.sba301.slot12.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Category #" + id + " not found."));
    }

    public Category createCategory(Category input) {
        if (input.getName() == null || input.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Category name is required.");
        }
        input.setId(null);
        return categoryRepository.save(input);
    }
}
