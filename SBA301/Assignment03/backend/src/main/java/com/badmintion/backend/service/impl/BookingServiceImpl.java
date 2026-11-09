package com.badmintion.backend.service.impl;

import com.badmintion.backend.dto.BookingDetailItemDTO;
import com.badmintion.backend.dto.BookingRequest;
import com.badmintion.backend.dto.BookingResponse;
import com.badmintion.backend.entity.*;
import com.badmintion.backend.exception.BadRequestException;
import com.badmintion.backend.exception.ResourceNotFoundException;
import com.badmintion.backend.repository.BookingDetailRepository;
import com.badmintion.backend.repository.BookingReservationRepository;
import com.badmintion.backend.repository.CustomerRepository;
import com.badmintion.backend.repository.RoomInformationRepository;
import com.badmintion.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingReservationRepository reservationRepository;
    private final BookingDetailRepository bookingDetailRepository;
    private final RoomInformationRepository roomRepository;
    private final CustomerRepository customerRepository;

    @Value("${hotel.staff.email}")
    private String staffEmail;

    public BookingServiceImpl(BookingReservationRepository reservationRepository,
                              BookingDetailRepository bookingDetailRepository,
                              RoomInformationRepository roomRepository,
                              CustomerRepository customerRepository) {
        this.reservationRepository = reservationRepository;
        this.bookingDetailRepository = bookingDetailRepository;
        this.roomRepository = roomRepository;
        this.customerRepository = customerRepository;
    }

    private BookingResponse mapToResponse(BookingReservation res) {
        List<BookingDetail> details = bookingDetailRepository.findByBookingReservation_BookingReservationID(res.getBookingReservationID());

        List<BookingDetailItemDTO> itemDTOs = details.stream().map(d -> BookingDetailItemDTO.builder()
                .roomID(d.getRoomInformation().getRoomID())
                .roomNumber(d.getRoomInformation().getRoomNumber())
                .roomTypeName(d.getRoomInformation().getRoomType() != null ? d.getRoomInformation().getRoomType().getRoomTypeName() : "")
                .startDate(d.getStartDate())
                .endDate(d.getEndDate())
                .actualPrice(d.getActualPrice())
                .build()).collect(Collectors.toList());

        return BookingResponse.builder()
                .bookingReservationID(res.getBookingReservationID())
                .bookingDate(res.getBookingDate())
                .totalPrice(res.getTotalPrice())
                .customerID(res.getCustomer() != null ? res.getCustomer().getCustomerID() : null)
                .customerFullName(res.getCustomer() != null ? res.getCustomer().getCustomerFullName() : "Unknown")
                .customerEmail(res.getCustomer() != null ? res.getCustomer().getEmailAddress() : "")
                .bookingStatus(res.getBookingStatus())
                .bookingDetails(itemDTOs)
                .build();
    }

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        if (request.getBookingDetails() == null || request.getBookingDetails().isEmpty()) {
            throw new BadRequestException("At least one room must be selected for booking");
        }

        Customer customer;
        if (staffEmail != null && staffEmail.equalsIgnoreCase(userEmail.trim())) {
            // Staff booking on behalf of customer
            if (request.getCustomerID() == null) {
                throw new BadRequestException("Staff must provide a valid customerID to create a booking");
            }
            customer = customerRepository.findById(request.getCustomerID())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerID()));
        } else {
            // Customer booking for themselves
            customer = customerRepository.findByEmailAddress(userEmail.trim())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + userEmail));
        }

        BigDecimal totalPrice = BigDecimal.ZERO;
        List<BookingDetail> detailsToSave = new ArrayList<>();

        // Create reservation header first
        BookingReservation reservation = BookingReservation.builder()
                .bookingDate(LocalDate.now())
                .totalPrice(BigDecimal.ZERO)
                .customer(customer)
                .bookingStatus(request.getBookingStatus() != null ? request.getBookingStatus() : 1)
                .build();

        reservation = reservationRepository.save(reservation);

        for (BookingDetailItemDTO item : request.getBookingDetails()) {
            RoomInformation room = roomRepository.findById(item.getRoomID())
                    .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + item.getRoomID()));

            if (room.getRoomStatus() != null && room.getRoomStatus() == 0) {
                throw new BadRequestException("Room " + room.getRoomNumber() + " is currently inactive and cannot be booked");
            }

            if (item.getStartDate().isAfter(item.getEndDate())) {
                throw new BadRequestException("Start date cannot be after end date for room " + room.getRoomNumber());
            }

            // Check if room is already booked in that range
            List<BookingDetail> conflicts = bookingDetailRepository.findOverlappingBookings(
                    room.getRoomID(), item.getStartDate(), item.getEndDate()
            );
            if (!conflicts.isEmpty()) {
                throw new BadRequestException("Room " + room.getRoomNumber() + " is already booked between " +
                        item.getStartDate() + " and " + item.getEndDate());
            }

            long days = ChronoUnit.DAYS.between(item.getStartDate(), item.getEndDate());
            if (days <= 0) days = 1; // Minimum 1 day rent

            BigDecimal roomTotal = room.getRoomPricePerDay().multiply(BigDecimal.valueOf(days));
            totalPrice = totalPrice.add(roomTotal);

            BookingDetail detail = BookingDetail.builder()
                    .id(new BookingDetailId(reservation.getBookingReservationID(), room.getRoomID()))
                    .bookingReservation(reservation)
                    .roomInformation(room)
                    .startDate(item.getStartDate())
                    .endDate(item.getEndDate())
                    .actualPrice(roomTotal)
                    .build();

            detailsToSave.add(detail);
        }

        bookingDetailRepository.saveAll(detailsToSave);

        reservation.setTotalPrice(totalPrice);
        reservation = reservationRepository.save(reservation);

        return mapToResponse(reservation);
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        return reservationRepository.findAllByOrderByBookingDateDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> searchBookings(String keyword, Integer status) {
        String query = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        return reservationRepository.searchReservations(query, status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getCustomerBookings(String userEmail) {
        Customer customer = customerRepository.findByEmailAddress(userEmail.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + userEmail));
        return reservationRepository.findByCustomer_CustomerIDOrderByBookingDateDesc(customer.getCustomerID())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponse getBookingById(Integer id) {
        BookingReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + id));
        return mapToResponse(reservation);
    }

    @Override
    @Transactional
    public BookingResponse updateBookingStatus(Integer id, Integer status) {
        BookingReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + id));
        reservation.setBookingStatus(status);
        reservation = reservationRepository.save(reservation);
        return mapToResponse(reservation);
    }

    @Override
    @Transactional
    public void deleteBooking(Integer id) {
        BookingReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found with ID: " + id));
        reservationRepository.delete(reservation);
    }
}

