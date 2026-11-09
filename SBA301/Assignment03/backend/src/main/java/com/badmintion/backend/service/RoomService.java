package com.badmintion.backend.service;

import com.badmintion.backend.dto.RoomDTO;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface RoomService {
    List<RoomDTO> getAllRooms();
    List<RoomDTO> getActiveRooms();
    RoomDTO getRoomById(Integer id);
    List<RoomDTO> searchRooms(String roomNumber, Integer roomTypeID, Integer roomStatus, BigDecimal maxPrice);
    RoomDTO createRoom(RoomDTO roomDTO);
    RoomDTO updateRoom(Integer id, RoomDTO roomDTO);
    Map<String, Object> deleteRoom(Integer id);
}

