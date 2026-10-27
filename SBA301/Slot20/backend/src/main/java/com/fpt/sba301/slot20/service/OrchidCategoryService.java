package com.fpt.sba301.slot20.service;

import com.fpt.sba301.slot20.entity.OrchidCategory;
import com.fpt.sba301.slot20.exception.ResourceNotFoundException;
import com.fpt.sba301.slot20.repository.IOrchidCategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class OrchidCategoryService implements IOrchidCategoryService {

    private final IOrchidCategoryRepository categoryRepository;

    public OrchidCategoryService(IOrchidCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrchidCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public OrchidCategory getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    }

    @Override
    public OrchidCategory createCategory(OrchidCategory category) {
        if (category.getCategoryName() == null || category.getCategoryName().trim().isEmpty()) {
            throw new IllegalArgumentException("categoryName is required and cannot be blank");
        }
        if (categoryRepository.existsByCategoryName(category.getCategoryName().trim())) {
            throw new IllegalArgumentException("Category name already exists: " + category.getCategoryName());
        }
        category.setCategoryName(category.getCategoryName().trim());
        return categoryRepository.save(category);
    }
}
