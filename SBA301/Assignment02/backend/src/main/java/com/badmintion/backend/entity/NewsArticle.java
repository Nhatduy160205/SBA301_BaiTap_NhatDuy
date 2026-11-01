/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Entity: NewsArticle
 */
package com.badmintion.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "NewsArticle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticle {

    @Id
    @Column(name = "NewsArticleID", length = 20)
    private String newsArticleID;

    @Column(name = "NewsTitle", nullable = false, length = 250)
    private String newsTitle;

    @Column(name = "Headline", length = 255)
    private String headline;

    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    @Column(name = "NewsContent", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String newsContent;

    @Column(name = "NewsSource", length = 150)
    private String newsSource;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CategoryID", nullable = false)
    private Category category;

    @Column(name = "NewsStatus")
    private Boolean newsStatus = true; // 1: Active, 0: Inactive

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CreatedByID", nullable = false)
    private SystemAccount createdBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "UpdatedByID")
    private SystemAccount updatedBy;

    @Column(name = "ModifiedDate")
    private LocalDateTime modifiedDate;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "NewsTag",
        joinColumns = @JoinColumn(name = "NewsArticleID"),
        inverseJoinColumns = @JoinColumn(name = "TagID")
    )
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();
}
