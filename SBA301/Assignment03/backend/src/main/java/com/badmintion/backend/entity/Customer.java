package com.badmintion.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "Customer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CustomerID")
    private Integer customerID;

    @Column(name = "CustomerFullName", length = 100, nullable = false)
    private String customerFullName;

    @Column(name = "Telephone", length = 20)
    private String telephone;

    @Column(name = "EmailAddress", length = 150, nullable = false, unique = true)
    private String emailAddress;

    @Column(name = "CustomerBirthday")
    private LocalDate customerBirthday;

    @Column(name = "CustomerStatus")
    private Integer customerStatus; // 1: Active, 0: Inactive

    @Column(name = "Password", length = 255, nullable = false)
    private String password;
}

