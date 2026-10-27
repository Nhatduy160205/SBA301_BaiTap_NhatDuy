package com.fpt.sba301.slot20.repository;

import com.fpt.sba301.slot20.entity.Orchid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IOrchidRepository extends JpaRepository<Orchid, Long> {
    List<Orchid> findByOrchidNameContainingIgnoreCase(String name);
    List<Orchid> findByOrchidCategory_CategoryId(Long categoryId);
}
