package com.example.orchid.pojos;

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

    @Column(name = "orchid_description", length = 1000)
    private String orchidDescription;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private OrchidCategory orchidCategory;

    @Column(name = "is_attractive")
    private Boolean isAttractive;

    @Column(name = "orchid_url", length = 500)
    private String orchidURL;

    public Orchid() {
    }

    public Orchid(Long orchidID, String orchidName, Boolean isNatural, String orchidDescription, OrchidCategory orchidCategory, Boolean isAttractive, String orchidURL) {
        this.orchidID = orchidID;
        this.orchidName = orchidName;
        this.isNatural = isNatural;
        this.orchidDescription = orchidDescription;
        this.orchidCategory = orchidCategory;
        this.isAttractive = isAttractive;
        this.orchidURL = orchidURL;
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

    public void setIsNatural(Boolean isNatural) {
        this.isNatural = isNatural;
    }

    public String getOrchidDescription() {
        return orchidDescription;
    }

    public void setOrchidDescription(String orchidDescription) {
        this.orchidDescription = orchidDescription;
    }

    public OrchidCategory getOrchidCategory() {
        return orchidCategory;
    }

    public void setOrchidCategory(OrchidCategory orchidCategory) {
        this.orchidCategory = orchidCategory;
    }

    public Boolean getIsAttractive() {
        return isAttractive;
    }

    public void setIsAttractive(Boolean isAttractive) {
        this.isAttractive = isAttractive;
    }

    public String getOrchidURL() {
        return orchidURL;
    }

    public void setOrchidURL(String orchidURL) {
        this.orchidURL = orchidURL;
    }

    @Override
    public String toString() {
        return "Orchid{" +
                "orchidID=" + orchidID +
                ", orchidName='" + orchidName + '\'' +
                ", isNatural=" + isNatural +
                ", orchidCategory=" + (orchidCategory != null ? orchidCategory.getCategoryName() : "null") +
                ", isAttractive=" + isAttractive +
                '}';
    }
}
