package com.badmintion.backend.repository;

import com.badmintion.backend.entity.RoomInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface RoomInformationRepository extends JpaRepository<RoomInformation, Integer> {

    List<RoomInformation> findByRoomStatus(Integer roomStatus);

    boolean existsByRoomNumber(String roomNumber);

    boolean existsByRoomNumberAndRoomIDNot(String roomNumber, Integer roomID);

    @Query("SELECT r FROM RoomInformation r WHERE " +
           "(:roomNumber IS NULL OR LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :roomNumber, '%'))) AND " +
           "(:roomTypeID IS NULL OR r.roomType.roomTypeID = :roomTypeID) AND " +
           "(:roomStatus IS NULL OR r.roomStatus = :roomStatus) AND " +
           "(:maxPrice IS NULL OR r.roomPricePerDay <= :maxPrice)")
    List<RoomInformation> searchRooms(@Param("roomNumber") String roomNumber,
                                      @Param("roomTypeID") Integer roomTypeID,
                                      @Param("roomStatus") Integer roomStatus,
                                      @Param("maxPrice") BigDecimal maxPrice);
}

