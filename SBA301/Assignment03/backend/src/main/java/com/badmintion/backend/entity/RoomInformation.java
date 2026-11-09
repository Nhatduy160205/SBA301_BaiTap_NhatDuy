package com.badmintion.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "RoomInformation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomID")
    private Integer roomID;

    @Column(name = "RoomNumber", length = 50, nullable = false)
    private String roomNumber;

    @Column(name = "RoomDetailDescription", length = 500)
    private String roomDetailDescription;

    @Column(name = "RoomMaxCapacity")
    private Integer roomMaxCapacity;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "RoomTypeID", nullable = false)
    private RoomType roomType;

    @Column(name = "RoomStatus")
    private Integer roomStatus; // 1: Active/Available, 0: Inactive/Deleted

    @Column(name = "RoomPricePerDay", precision = 18, scale = 2)
    private BigDecimal roomPricePerDay;
}

