package com.badmintion.backend.controller;

import com.badmintion.backend.dto.BookingRequest;
import com.badmintion.backend.dto.BookingResponse;
import com.badmintion.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Customer or Staff creates booking
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request,
                                                         Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(request, authentication.getName()));
    }

    // Customer views their own booking history
    @GetMapping("/my-history")
    public ResponseEntity<List<BookingResponse>> getMyBookingHistory(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getCustomerBookings(authentication.getName()));
    }

    // Staff manages all bookings
    @GetMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<BookingResponse>> searchBookings(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status) {
        return ResponseEntity.ok(bookingService.searchBookings(keyword, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, Integer> body) {
        Integer status = body.get("status");
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<Void> deleteBooking(@PathVariable Integer id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}

