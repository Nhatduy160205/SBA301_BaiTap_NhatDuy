package com.badmintion.backend.service;

import com.badmintion.backend.entity.RoomType;

import java.util.List;

public interface RoomTypeService {
    List<RoomType> getAllRoomTypes();
    RoomType getRoomTypeById(Integer id);
    RoomType createRoomType(RoomType roomType);
    RoomType updateRoomType(Integer id, RoomType roomType);
    void deleteRoomType(Integer id);
}

