package com.badmintion.backend.repository;

import com.badmintion.backend.entity.BookingDetail;
import com.badmintion.backend.entity.BookingDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, BookingDetailId> {

    // Check if room belongs to any renting transaction (Special business requirement in PDF!)
    boolean existsByRoomInformation_RoomID(Integer roomID);

    List<BookingDetail> findByBookingReservation_BookingReservationID(Integer bookingReservationID);

    // Check overlapping bookings for a room (excluding cancelled reservations status = 0)
    @Query("SELECT bd FROM BookingDetail bd " +
           "WHERE bd.roomInformation.roomID = :roomID " +
           "AND bd.bookingReservation.bookingStatus <> 0 " +
           "AND bd.startDate <= :endDate AND bd.endDate >= :startDate")
    List<BookingDetail> findOverlappingBookings(@Param("roomID") Integer roomID,
                                               @Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate);
}

