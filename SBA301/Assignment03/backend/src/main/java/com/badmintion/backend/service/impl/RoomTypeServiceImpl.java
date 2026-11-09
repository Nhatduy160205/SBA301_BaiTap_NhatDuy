package com.badmintion.backend.service.impl;

import com.badmintion.backend.entity.RoomType;
import com.badmintion.backend.exception.ResourceNotFoundException;
import com.badmintion.backend.repository.RoomTypeRepository;
import com.badmintion.backend.service.RoomTypeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoomTypeServiceImpl implements RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;

    public RoomTypeServiceImpl(RoomTypeRepository roomTypeRepository) {
        this.roomTypeRepository = roomTypeRepository;
    }

    @Override
    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepository.findAll();
    }

    @Override
    public RoomType getRoomTypeById(Integer id) {
        return roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found with ID: " + id));
    }

    @Override
    @Transactional
    public RoomType createRoomType(RoomType roomType) {
        return roomTypeRepository.save(roomType);
    }

    @Override
    @Transactional
    public RoomType updateRoomType(Integer id, RoomType roomType) {
        RoomType existing = getRoomTypeById(id);
        existing.setRoomTypeName(roomType.getRoomTypeName());
        existing.setTypeDescription(roomType.getTypeDescription());
        existing.setTypeNote(roomType.getTypeNote());
        return roomTypeRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteRoomType(Integer id) {
        RoomType existing = getRoomTypeById(id);
        roomTypeRepository.delete(existing);
    }
}

