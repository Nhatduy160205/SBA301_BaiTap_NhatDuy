package com.badmintion.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDetailId implements Serializable {

    @Column(name = "BookingReservationID")
    private Integer bookingReservationID;

    @Column(name = "RoomID")
    private Integer roomID;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BookingDetailId that)) return false;
        return Objects.equals(bookingReservationID, that.bookingReservationID) &&
                Objects.equals(roomID, that.roomID);
    }

    @Override
    public int hashCode() {
        return Objects.hash(bookingReservationID, roomID);
    }
}

