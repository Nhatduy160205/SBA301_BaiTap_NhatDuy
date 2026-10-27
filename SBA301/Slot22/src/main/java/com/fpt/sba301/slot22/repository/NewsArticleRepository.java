package com.fpt.sba301.slot22.repository;

import com.fpt.sba301.slot22.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {
    boolean existsByCategory_CategoryId(Short categoryId);
}
