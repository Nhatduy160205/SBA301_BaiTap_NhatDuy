/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Entity: Category
 */
package com.badmintion.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "Category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID")
    private Short categoryID;

    @Column(name = "CategoryName", nullable = false, length = 150)
    private String categoryName;

    @Column(name = "CategoryDesciption", length = 255)
    private String categoryDesciption;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ParentCategoryID")
    private Category parentCategory;

    @Column(name = "IsActive")
    @Builder.Default
    private Boolean isActive = true;

    @JsonIgnore
    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<NewsArticle> articles;
}
