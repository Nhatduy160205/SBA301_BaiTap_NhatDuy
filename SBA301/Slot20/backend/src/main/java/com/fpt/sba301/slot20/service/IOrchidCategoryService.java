package com.fpt.sba301.slot20.service;

import com.fpt.sba301.slot20.entity.OrchidCategory;
import java.util.List;

public interface IOrchidCategoryService {
    List<OrchidCategory> getAllCategories();
    OrchidCategory getCategoryById(Long id);
    OrchidCategory createCategory(OrchidCategory category);
}
