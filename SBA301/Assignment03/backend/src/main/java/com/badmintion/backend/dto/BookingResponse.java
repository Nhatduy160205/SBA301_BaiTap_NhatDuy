package com.badmintion.backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Integer bookingReservationID;
    private LocalDate bookingDate;
    private BigDecimal totalPrice;
    private Integer customerID;
    private String customerFullName;
    private String customerEmail;
    private Integer bookingStatus;
    private List<BookingDetailItemDTO> bookingDetails;
}

