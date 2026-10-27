package com.example.orchid.services;

import com.example.orchid.pojos.OrchidCategory;
import java.util.List;
import java.util.Optional;

public interface IOrchidCategoryService {
    List<OrchidCategory> getAllCategories();
    Optional<OrchidCategory> getCategoryById(Long id);
    OrchidCategory createCategory(OrchidCategory category);
    Optional<OrchidCategory> updateCategory(Long id, OrchidCategory category);
    boolean deleteCategory(Long id);
}
