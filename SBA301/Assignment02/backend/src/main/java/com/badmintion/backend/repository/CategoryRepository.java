/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Repository: CategoryRepository
 */
package com.badmintion.backend.repository;

import com.badmintion.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Short> {

    List<Category> findByIsActiveTrue();

    @Query("SELECT c FROM Category c WHERE " +
           "LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.categoryDesciption) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Category> searchCategories(@Param("keyword") String keyword);
}
