/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Repository: NewsArticleRepository
 */
package com.badmintion.backend.repository;

import com.badmintion.backend.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {

    // Kiểm tra xem Account đã tạo bài viết nào chưa (Ràng buộc xóa Account)
    boolean existsByCreatedBy_AccountID(Short accountID);

    // Kiểm tra xem Category đã có bài viết nào liên kết chưa (Ràng buộc xóa Category)
    boolean existsByCategory_CategoryID(Short categoryID);

    // Lấy danh sách tin tức công khai đang active
    List<NewsArticle> findByNewsStatusTrueOrderByCreatedDateDesc();

    // Lấy danh sách tin tức do một nhân viên cụ thể tạo (News history)
    List<NewsArticle> findByCreatedBy_AccountIDOrderByCreatedDateDesc(Short accountID);

    // Lấy tất cả tin tức sắp xếp ngày tạo mới nhất
    List<NewsArticle> findAllByOrderByCreatedDateDesc();

    // Tìm kiếm tin tức công khai theo từ khóa
    @Query("SELECT n FROM NewsArticle n WHERE n.newsStatus = true AND (" +
           "LOWER(n.newsTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.headline) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.newsContent) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<NewsArticle> searchPublicArticles(@Param("keyword") String keyword);

    // Tìm kiếm tất cả tin tức theo từ khóa
    @Query("SELECT n FROM NewsArticle n WHERE " +
           "LOWER(n.newsTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.headline) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.newsContent) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<NewsArticle> searchAllArticles(@Param("keyword") String keyword);
}
