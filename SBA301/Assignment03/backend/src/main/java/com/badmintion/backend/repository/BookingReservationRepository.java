package com.badmintion.backend.repository;

import com.badmintion.backend.entity.BookingReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingReservationRepository extends JpaRepository<BookingReservation, Integer> {

    List<BookingReservation> findByCustomer_CustomerIDOrderByBookingDateDesc(Integer customerID);

    List<BookingReservation> findAllByOrderByBookingDateDesc();

    @Query("SELECT b FROM BookingReservation b JOIN b.customer c WHERE " +
           "(:keyword IS NULL OR LOWER(c.customerFullName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(c.emailAddress) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:status IS NULL OR b.bookingStatus = :status) " +
           "ORDER BY b.bookingDate DESC")
    List<BookingReservation> searchReservations(@Param("keyword") String keyword, @Param("status") Integer status);
}

