package com.fpt.sba301.slot20.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "orchids")
public class Orchid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orchid_id")
    private Long orchidID;

    @Column(name = "orchid_name", nullable = false, length = 150)
    private String orchidName;

    @Column(name = "is_natural")
    private Boolean isNatural;

    @Column(name = "is_attractive")
    private Boolean isAttractive;

    @Column(name = "orchid_description", length = 1000)
    private String orchidDescription;

    @Column(name = "orchid_url", length = 2048)
    private String orchidURL;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private OrchidCategory orchidCategory;

    public Orchid() {
    }

    public Orchid(Long orchidID, String orchidName, Boolean isNatural, Boolean isAttractive,
                  String orchidDescription, String orchidURL, OrchidCategory orchidCategory) {
        this.orchidID = orchidID;
        this.orchidName = orchidName;
        this.isNatural = isNatural;
        this.isAttractive = isAttractive;
        this.orchidDescription = orchidDescription;
        this.orchidURL = orchidURL;
        this.orchidCategory = orchidCategory;
    }

    public Long getOrchidID() {
        return orchidID;
    }

    public void setOrchidID(Long orchidID) {
        this.orchidID = orchidID;
    }

    public String getOrchidName() {
        return orchidName;
    }

    public void setOrchidName(String orchidName) {
        this.orchidName = orchidName;
    }

    public Boolean getIsNatural() {
        return isNatural;
    }

    public void setIsNatural(Boolean natural) {
        isNatural = natural;
    }

    public Boolean getIsAttractive() {
        return isAttractive;
    }

    public void setIsAttractive(Boolean attractive) {
        isAttractive = attractive;
    }

    public String getOrchidDescription() {
        return orchidDescription;
    }

    public void setOrchidDescription(String orchidDescription) {
        this.orchidDescription = orchidDescription;
    }

    public String getOrchidURL() {
        return orchidURL;
    }

    public void setOrchidURL(String orchidURL) {
        this.orchidURL = orchidURL;
    }

    public OrchidCategory getOrchidCategory() {
        return orchidCategory;
    }

    public void setOrchidCategory(OrchidCategory orchidCategory) {
        this.orchidCategory = orchidCategory;
    }
}
