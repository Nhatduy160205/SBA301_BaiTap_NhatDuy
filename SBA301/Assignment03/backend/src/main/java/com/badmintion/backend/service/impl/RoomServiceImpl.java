package com.badmintion.backend.service.impl;

import com.badmintion.backend.dto.RoomDTO;
import com.badmintion.backend.entity.RoomInformation;
import com.badmintion.backend.entity.RoomType;
import com.badmintion.backend.exception.BadRequestException;
import com.badmintion.backend.exception.ResourceNotFoundException;
import com.badmintion.backend.repository.BookingDetailRepository;
import com.badmintion.backend.repository.RoomInformationRepository;
import com.badmintion.backend.repository.RoomTypeRepository;
import com.badmintion.backend.service.RoomService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomInformationRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final BookingDetailRepository bookingDetailRepository;

    public RoomServiceImpl(RoomInformationRepository roomRepository,
                           RoomTypeRepository roomTypeRepository,
                           BookingDetailRepository bookingDetailRepository) {
        this.roomRepository = roomRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.bookingDetailRepository = bookingDetailRepository;
    }

    private RoomDTO mapToDTO(RoomInformation room) {
        return RoomDTO.builder()
                .roomID(room.getRoomID())
                .roomNumber(room.getRoomNumber())
                .roomDetailDescription(room.getRoomDetailDescription())
                .roomMaxCapacity(room.getRoomMaxCapacity())
                .roomTypeID(room.getRoomType().getRoomTypeID())
                .roomTypeName(room.getRoomType().getRoomTypeName())
                .roomStatus(room.getRoomStatus())
                .roomPricePerDay(room.getRoomPricePerDay())
                .build();
    }

    @Override
    public List<RoomDTO> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomDTO> getActiveRooms() {
        return roomRepository.findByRoomStatus(1).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RoomDTO getRoomById(Integer id) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));
        return mapToDTO(room);
    }

    @Override
    public List<RoomDTO> searchRooms(String roomNumber, Integer roomTypeID, Integer roomStatus, BigDecimal maxPrice) {
        String queryNumber = (roomNumber != null && !roomNumber.isBlank()) ? roomNumber.trim() : null;
        return roomRepository.searchRooms(queryNumber, roomTypeID, roomStatus, maxPrice)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RoomDTO createRoom(RoomDTO dto) {
        if (roomRepository.existsByRoomNumber(dto.getRoomNumber().trim())) {
            throw new BadRequestException("Room number already exists: " + dto.getRoomNumber());
        }

        RoomType roomType = roomTypeRepository.findById(dto.getRoomTypeID())
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found with ID: " + dto.getRoomTypeID()));

        RoomInformation room = RoomInformation.builder()
                .roomNumber(dto.getRoomNumber().trim())
                .roomDetailDescription(dto.getRoomDetailDescription())
                .roomMaxCapacity(dto.getRoomMaxCapacity())
                .roomType(roomType)
                .roomStatus(dto.getRoomStatus() != null ? dto.getRoomStatus() : 1)
                .roomPricePerDay(dto.getRoomPricePerDay())
                .build();

        room = roomRepository.save(room);
        return mapToDTO(room);
    }

    @Override
    @Transactional
    public RoomDTO updateRoom(Integer id, RoomDTO dto) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));

        if (roomRepository.existsByRoomNumberAndRoomIDNot(dto.getRoomNumber().trim(), id)) {
            throw new BadRequestException("Room number already in use by another room: " + dto.getRoomNumber());
        }

        RoomType roomType = roomTypeRepository.findById(dto.getRoomTypeID())
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found with ID: " + dto.getRoomTypeID()));

        room.setRoomNumber(dto.getRoomNumber().trim());
        room.setRoomDetailDescription(dto.getRoomDetailDescription());
        room.setRoomMaxCapacity(dto.getRoomMaxCapacity());
        room.setRoomType(roomType);
        if (dto.getRoomStatus() != null) {
            room.setRoomStatus(dto.getRoomStatus());
        }
        room.setRoomPricePerDay(dto.getRoomPricePerDay());

        room = roomRepository.save(room);
        return mapToDTO(room);
    }

    /**
     * Requirement:
     * "The delete action will delete room information in the case this information is not belong
     * to any renting transaction. If the room information is already stored in a booking detail,
     * just change the status."
     */
    @Override
    @Transactional
    public Map<String, Object> deleteRoom(Integer id) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));

        boolean hasBookingDetails = bookingDetailRepository.existsByRoomInformation_RoomID(id);

        Map<String, Object> response = new HashMap<>();
        if (hasBookingDetails) {
            // Room is referenced in renting transactions -> Soft delete / Deactivate
            room.setRoomStatus(0);
            roomRepository.save(room);
            response.put("action", "DEACTIVATED");
            response.put("message", "Room has booking transaction history. Status has been changed to inactive (0).");
            response.put("roomID", id);
        } else {
            // Room is not in any transaction -> Hard delete
            roomRepository.delete(room);
            response.put("action", "DELETED");
            response.put("message", "Room has been permanently deleted from database.");
            response.put("roomID", id);
        }
        return response;
    }
}

