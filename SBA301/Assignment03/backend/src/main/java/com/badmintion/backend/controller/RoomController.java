package com.badmintion.backend.controller;

import com.badmintion.backend.dto.RoomDTO;
import com.badmintion.backend.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // Public endpoint: Do not need authentication to view room information
    @GetMapping
    public ResponseEntity<List<RoomDTO>> getAllRooms(@RequestParam(value = "activeOnly", defaultValue = "false") boolean activeOnly) {
        if (activeOnly) {
            return ResponseEntity.ok(roomService.getActiveRooms());
        }
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/search")
    public ResponseEntity<List<RoomDTO>> searchRooms(
            @RequestParam(required = false) String roomNumber,
            @RequestParam(required = false) Integer roomTypeID,
            @RequestParam(required = false) Integer roomStatus,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return ResponseEntity.ok(roomService.searchRooms(roomNumber, roomTypeID, roomStatus, maxPrice));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDTO> getRoomById(@PathVariable Integer id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    // Staff-only endpoints
    @PostMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<RoomDTO> createRoom(@Valid @RequestBody RoomDTO roomDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roomService.createRoom(roomDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<RoomDTO> updateRoom(@PathVariable Integer id, @Valid @RequestBody RoomDTO roomDTO) {
        return ResponseEntity.ok(roomService.updateRoom(id, roomDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<Map<String, Object>> deleteRoom(@PathVariable Integer id) {
        return ResponseEntity.ok(roomService.deleteRoom(id));
    }
}

