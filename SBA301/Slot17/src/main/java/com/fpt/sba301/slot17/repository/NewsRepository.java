package com.fpt.sba301.slot17.repository;

import com.fpt.sba301.slot17.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    List<News> findByCategory_Id(Long categoryId);
    List<News> findByTitleContainingIgnoreCase(String keyword);
    boolean existsByTitleIgnoreCase(String title);
}
