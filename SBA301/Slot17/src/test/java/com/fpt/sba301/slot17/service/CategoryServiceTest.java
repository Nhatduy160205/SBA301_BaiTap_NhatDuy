package com.fpt.sba301.slot17.service;

import com.fpt.sba301.slot17.dto.CategoryDTO;
import com.fpt.sba301.slot17.entity.Category;
import com.fpt.sba301.slot17.entity.News;
import com.fpt.sba301.slot17.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category category;

    @BeforeEach
    void setUp() {
        category = new Category(1L, "Technology", "Tech news", true);
    }

    @Test
    @DisplayName("createCategory with blank name should throw IllegalArgumentException")
    void createCategory_BlankName_ShouldThrow() {
        assertThatThrownBy(() -> categoryService.createCategory("   ", "desc"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Category name is required");

        verify(categoryRepository, never()).save(any());
    }

    @Test
    @DisplayName("createCategory with duplicate name should throw IllegalArgumentException")
    void createCategory_DuplicateName_ShouldThrow() {
        when(categoryRepository.existsByNameIgnoreCase("Technology")).thenReturn(true);

        assertThatThrownBy(() -> categoryService.createCategory("Technology", "desc"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Category name already exists");

        verify(categoryRepository, never()).save(any());
    }

    @Test
    @DisplayName("createCategory with valid name should save and return DTO")
    void createCategory_Valid_ShouldSave() {
        when(categoryRepository.existsByNameIgnoreCase("Technology")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        CategoryDTO result = categoryService.createCategory("Technology", "Tech news");

        assertThat(result.getName()).isEqualTo("Technology");
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    @DisplayName("deleteCategory with existing news items should throw IllegalArgumentException")
    void deleteCategory_WithNews_ShouldThrow() {
        category.addNews(new News("Sample News", "Content", category));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        assertThatThrownBy(() -> categoryService.deleteCategory(1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Cannot delete category because it contains");

        verify(categoryRepository, never()).delete(any());
    }
}
