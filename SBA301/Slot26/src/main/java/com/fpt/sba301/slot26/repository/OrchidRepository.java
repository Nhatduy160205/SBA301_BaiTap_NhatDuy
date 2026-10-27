package com.fpt.sba301.slot26.repository;

import com.fpt.sba301.slot26.entity.Orchid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrchidRepository extends JpaRepository<Orchid, Integer> {
}