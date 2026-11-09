package com.badmintion.backend.service;

import com.badmintion.backend.dto.BookingRequest;
import com.badmintion.backend.dto.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(BookingRequest request, String userEmail);
    List<BookingResponse> getAllBookings();
    List<BookingResponse> searchBookings(String keyword, Integer status);
    List<BookingResponse> getCustomerBookings(String userEmail);
    BookingResponse getBookingById(Integer id);
    BookingResponse updateBookingStatus(Integer id, Integer status);
    void deleteBooking(Integer id);
}

