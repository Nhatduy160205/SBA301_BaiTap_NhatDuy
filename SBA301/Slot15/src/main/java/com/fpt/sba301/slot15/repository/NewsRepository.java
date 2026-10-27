package com.fpt.sba301.slot15.repository;

import com.fpt.sba301.slot15.model.NewsEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsRepository extends JpaRepository<NewsEntity, Long> {
    Slice<NewsEntity> findByActiveTrue(Pageable pageable);
    Page<NewsEntity> findByCategoryIgnoreCase(String category, Pageable pageable);
    Page<NewsEntity> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);
}
