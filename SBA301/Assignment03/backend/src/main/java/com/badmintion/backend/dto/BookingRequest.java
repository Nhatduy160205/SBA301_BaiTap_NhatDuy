package com.badmintion.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {

    // Can be null if booking by logged in customer; Staff can book on behalf of customer by passing customerID
    private Integer customerID;

    private Integer bookingStatus; // Default to 1 (Confirmed)

    @NotEmpty(message = "At least one room must be selected for booking")
    @Valid
    private List<BookingDetailItemDTO> bookingDetails;
}

