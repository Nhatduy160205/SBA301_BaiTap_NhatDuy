package com.example.orchid.services;

import com.example.orchid.pojos.OrchidCategory;
import com.example.orchid.repositories.IOrchidCategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class OrchidCategoryService implements IOrchidCategoryService {

    private final IOrchidCategoryRepository categoryRepository;

    public OrchidCategoryService(IOrchidCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<OrchidCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Optional<OrchidCategory> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    @Override
    @Transactional
    public OrchidCategory createCategory(OrchidCategory category) {
        if (category == null || category.getCategoryName() == null || category.getCategoryName().trim().isEmpty()) {
            throw new IllegalArgumentException("categoryName is required and cannot be empty");
        }
        String trimmedName = category.getCategoryName().trim();
        if (categoryRepository.existsByCategoryNameIgnoreCase(trimmedName)) {
            throw new IllegalArgumentException("Category name already exists: " + trimmedName);
        }
        category.setCategoryId(null);
        category.setCategoryName(trimmedName);
        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public Optional<OrchidCategory> updateCategory(Long id, OrchidCategory category) {
        if (category == null || category.getCategoryName() == null || category.getCategoryName().trim().isEmpty()) {
            throw new IllegalArgumentException("categoryName is required and cannot be empty");
        }
        return categoryRepository.findById(id).map(existing -> {
            String trimmedName = category.getCategoryName().trim();
            existing.setCategoryName(trimmedName);
            return categoryRepository.save(existing);
        });
    }

    @Override
    @Transactional
    public boolean deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            return false;
        }
        categoryRepository.deleteById(id);
        return true;
    }
}
