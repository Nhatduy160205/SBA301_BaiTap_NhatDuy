/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Repository: SystemAccountRepository
 */
package com.badmintion.backend.repository;

import com.badmintion.backend.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemAccountRepository extends JpaRepository<SystemAccount, Short> {

    Optional<SystemAccount> findByAccountEmail(String email);

    boolean existsByAccountEmail(String email);

    @Query("SELECT a FROM SystemAccount a WHERE " +
           "LOWER(a.accountName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.accountEmail) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<SystemAccount> searchAccounts(@Param("keyword") String keyword);
}
