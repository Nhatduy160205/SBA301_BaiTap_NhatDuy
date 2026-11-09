package com.badmintion.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDTO {

    private Integer roomID;

    @NotBlank(message = "Room number is required")
    private String roomNumber;

    private String roomDetailDescription;

    @NotNull(message = "Room max capacity is required")
    @Min(value = 1, message = "Max capacity must be at least 1")
    private Integer roomMaxCapacity;

    @NotNull(message = "Room type ID is required")
    private Integer roomTypeID;

    private String roomTypeName;

    private Integer roomStatus; // 1: Active, 0: Inactive

    @NotNull(message = "Room price per day is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price per day must be greater than 0")
    private BigDecimal roomPricePerDay;
}

