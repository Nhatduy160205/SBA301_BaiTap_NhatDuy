/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Entity: SystemAccount
 */
package com.badmintion.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "SystemAccount")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AccountID")
    private Short accountID;

    @Column(name = "AccountName", nullable = false, length = 100)
    private String accountName;

    @Column(name = "AccountEmail", nullable = false, unique = true, length = 150)
    private String accountEmail;

    @Column(name = "AccountRole", nullable = false)
    private Integer accountRole; // 1: Admin, 2: Staff

    @Column(name = "AccountPassword", nullable = false, length = 255)
    private String accountPassword;

    @JsonIgnore
    @OneToMany(mappedBy = "createdBy", fetch = FetchType.LAZY)
    private List<NewsArticle> createdArticles;

    @JsonIgnore
    @OneToMany(mappedBy = "updatedBy", fetch = FetchType.LAZY)
    private List<NewsArticle> updatedArticles;
}
