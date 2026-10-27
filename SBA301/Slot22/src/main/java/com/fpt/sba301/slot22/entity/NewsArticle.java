package com.fpt.sba301.slot22.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "NewsArticle")
public class NewsArticle {

    @Id
    @Column(name = "NewsArticleID", length = 20)
    private String newsArticleId;

    @Column(name = "NewsTitle", length = 170)
    private String newsTitle;

    @Column(name = "Headline", length = 150)
    private String headline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CategoryID")
    private Category category;

    @Column(name = "NewsStatus")
    private Boolean newsStatus;

    public NewsArticle() {
    }

    public NewsArticle(String newsArticleId, String newsTitle, String headline, Category category, Boolean newsStatus) {
        this.newsArticleId = newsArticleId;
        this.newsTitle = newsTitle;
        this.headline = headline;
        this.category = category;
        this.newsStatus = newsStatus;
    }

    public String getNewsArticleId() {
        return newsArticleId;
    }

    public void setNewsArticleId(String newsArticleId) {
        this.newsArticleId = newsArticleId;
    }

    public String getNewsTitle() {
        return newsTitle;
    }

    public void setNewsTitle(String newsTitle) {
        this.newsTitle = newsTitle;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Boolean getNewsStatus() {
        return newsStatus;
    }

    public void setNewsStatus(Boolean newsStatus) {
        this.newsStatus = newsStatus;
    }
}
