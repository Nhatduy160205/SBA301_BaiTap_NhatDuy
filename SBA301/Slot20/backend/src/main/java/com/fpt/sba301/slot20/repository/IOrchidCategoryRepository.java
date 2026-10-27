package com.fpt.sba301.slot20.repository;

import com.fpt.sba301.slot20.entity.OrchidCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IOrchidCategoryRepository extends JpaRepository<OrchidCategory, Long> {
    Optional<OrchidCategory> findByCategoryName(String categoryName);
    boolean existsByCategoryName(String categoryName);
}
