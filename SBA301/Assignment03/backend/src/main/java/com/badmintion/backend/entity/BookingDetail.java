package com.badmintion.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "BookingDetail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDetail {

    @EmbeddedId
    private BookingDetailId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("bookingReservationID")
    @JoinColumn(name = "BookingReservationID", nullable = false)
    @JsonIgnore
    private BookingReservation bookingReservation;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("roomID")
    @JoinColumn(name = "RoomID", nullable = false)
    private RoomInformation roomInformation;

    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "EndDate", nullable = false)
    private LocalDate endDate;

    @Column(name = "ActualPrice", precision = 18, scale = 2, nullable = false)
    private BigDecimal actualPrice;
}

