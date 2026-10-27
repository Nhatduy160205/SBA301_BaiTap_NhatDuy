package com.fpt.sba301.slot17.repository;

import com.fpt.sba301.slot17.entity.Category;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class CategoryRepositoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    @DisplayName("should find category by name ignoring case")
    void shouldFindCategoryIgnoringCase() {
        categoryRepository.save(new Category("Science", "Scientific discovery"));

        Optional<Category> found = categoryRepository.findByNameIgnoreCase("science");

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Science");
    }

    @Test
    @DisplayName("should find active categories ordered by name ascending")
    void shouldFindActiveCategoriesOrdered() {
        categoryRepository.save(new Category("Zeta", "Desc", true));
        categoryRepository.save(new Category("Alpha", "Desc", true));
        categoryRepository.save(new Category("Beta", "Desc", false));

        List<Category> activeList = categoryRepository.findByActiveTrueOrderByNameAsc();

        assertThat(activeList).hasSize(2);
        assertThat(activeList.get(0).getName()).isEqualTo("Alpha");
        assertThat(activeList.get(1).getName()).isEqualTo("Zeta");
    }
}
