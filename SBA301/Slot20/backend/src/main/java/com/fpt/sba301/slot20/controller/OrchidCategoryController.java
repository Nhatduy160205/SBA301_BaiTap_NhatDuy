package com.fpt.sba301.slot20.controller;

import com.fpt.sba301.slot20.entity.OrchidCategory;
import com.fpt.sba301.slot20.service.IOrchidCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/categories", "/api/categories"})
public class OrchidCategoryController {

    private final IOrchidCategoryService categoryService;

    public OrchidCategoryController(IOrchidCategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping({"", "/"})
    public ResponseEntity<List<OrchidCategory>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrchidCategory> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PostMapping({"", "/"})
    public ResponseEntity<OrchidCategory> createCategory(@RequestBody OrchidCategory category) {
        OrchidCategory created = categoryService.createCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
