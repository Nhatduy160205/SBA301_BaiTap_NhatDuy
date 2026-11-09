package com.badmintion.backend.config;

import com.badmintion.backend.entity.Customer;
import com.badmintion.backend.entity.RoomInformation;
import com.badmintion.backend.entity.RoomType;
import com.badmintion.backend.repository.CustomerRepository;
import com.badmintion.backend.repository.RoomInformationRepository;
import com.badmintion.backend.repository.RoomTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final RoomTypeRepository roomTypeRepository;
    private final RoomInformationRepository roomRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoomTypeRepository roomTypeRepository,
                           RoomInformationRepository roomRepository,
                           CustomerRepository customerRepository,
                           PasswordEncoder passwordEncoder) {
        this.roomTypeRepository = roomTypeRepository;
        this.roomRepository = roomRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            // Seed RoomTypes if table is empty
            if (roomTypeRepository.count() == 0) {
                RoomType standard = roomTypeRepository.save(RoomType.builder()
                        .roomTypeName("Standard Single")
                        .typeDescription("Cozy room with single bed, free Wi-Fi, air conditioning")
                        .typeNote("Non-smoking")
                        .build());

                RoomType deluxe = roomTypeRepository.save(RoomType.builder()
                        .roomTypeName("Deluxe Double")
                        .typeDescription("Spacious double bed room with ocean view and balcony")
                        .typeNote("Complimentary breakfast included")
                        .build());

                RoomType suite = roomTypeRepository.save(RoomType.builder()
                        .roomTypeName("Executive Suite")
                        .typeDescription("Luxury suite with private living room, king bed, and mini-bar")
                        .typeNote("VIP services, 24/7 room service")
                        .build());

                RoomType family = roomTypeRepository.save(RoomType.builder()
                        .roomTypeName("Family Room")
                        .typeDescription("Designed for families, includes two queen beds and children play area")
                        .typeNote("Extra bed available on request")
                        .build());

                // Seed RoomInformation
                if (roomRepository.count() == 0) {
                    roomRepository.saveAll(List.of(
                            RoomInformation.builder()
                                    .roomNumber("R101")
                                    .roomDetailDescription("Standard Single Room - Floor 1, garden view")
                                    .roomMaxCapacity(1)
                                    .roomType(standard)
                                    .roomStatus(1)
                                    .roomPricePerDay(new BigDecimal("35.00"))
                                    .build(),
                            RoomInformation.builder()
                                    .roomNumber("R102")
                                    .roomDetailDescription("Standard Single Room - Floor 1, quiet corner")
                                    .roomMaxCapacity(1)
                                    .roomType(standard)
                                    .roomStatus(1)
                                    .roomPricePerDay(new BigDecimal("35.00"))
                                    .build(),
                            RoomInformation.builder()
                                    .roomNumber("R201")
                                    .roomDetailDescription("Deluxe Double Room - Floor 2 with balcony and sea view")
                                    .roomMaxCapacity(2)
                                    .roomType(deluxe)
                                    .roomStatus(1)
                                    .roomPricePerDay(new BigDecimal("65.00"))
                                    .build(),
                            RoomInformation.builder()
                                    .roomNumber("R202")
                                    .roomDetailDescription("Deluxe Double Room - Floor 2 city view, smart TV")
                                    .roomMaxCapacity(2)
                                    .roomType(deluxe)
                                    .roomStatus(1)
                                    .roomPricePerDay(new BigDecimal("60.00"))
                                    .build(),
                            RoomInformation.builder()
                                    .roomNumber("R301")
                                    .roomDetailDescription("Executive Suite - Floor 3 penthouse view, jacuzzi")
                                    .roomMaxCapacity(3)
                                    .roomType(suite)
                                    .roomStatus(1)
                                    .roomPricePerDay(new BigDecimal("120.00"))
                                    .build(),
                            RoomInformation.builder()
                                    .roomNumber("R401")
                                    .roomDetailDescription("Family Suite - Floor 4, spacious living with kitchenette")
                                    .roomMaxCapacity(4)
                                    .roomType(family)
                                    .roomStatus(1)
                                    .roomPricePerDay(new BigDecimal("95.00"))
                                    .build()
                    ));
                }
            }

            // Seed sample Customer if customer table is empty
            if (customerRepository.count() == 0) {
                customerRepository.save(Customer.builder()
                        .customerFullName("Nguyen Van Customer")
                        .telephone("0901234567")
                        .emailAddress("customer@gmail.com")
                        .customerBirthday(LocalDate.of(1998, 5, 15))
                        .customerStatus(1)
                        .password(passwordEncoder.encode("123456"))
                        .build());
            }
        } catch (Exception e) {
            // Log but don't prevent application startup if DB is connecting
            System.err.println("Notice: DataInitializer skipped or DB table not ready yet: " + e.getMessage());
        }
    }
}

