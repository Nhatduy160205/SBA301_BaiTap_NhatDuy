-- ===================================================================
-- DATABASE SETUP SCRIPT FOR FUMiniHotelSystem (Assignment 03 SBA301)
-- Database name: A3TranNhatDuy_CE190982
-- ===================================================================

USE master;
GO

-- 1. Create Database if not exists
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'A3TranNhatDuy_CE190982')
BEGIN
    CREATE DATABASE A3TranNhatDuy_CE190982;
END
GO

USE A3TranNhatDuy_CE190982;
GO

-- 2. Create Tables (Spring Data JPA will also auto-create these if ddl-auto=update)

IF OBJECT_ID('dbo.BookingDetail', 'U') IS NOT NULL DROP TABLE dbo.BookingDetail;
IF OBJECT_ID('dbo.BookingReservation', 'U') IS NOT NULL DROP TABLE dbo.BookingReservation;
IF OBJECT_ID('dbo.RoomInformation', 'U') IS NOT NULL DROP TABLE dbo.RoomInformation;
IF OBJECT_ID('dbo.RoomType', 'U') IS NOT NULL DROP TABLE dbo.RoomType;
IF OBJECT_ID('dbo.Customer', 'U') IS NOT NULL DROP TABLE dbo.Customer;
GO

-- Table: RoomType
CREATE TABLE RoomType (
    RoomTypeID INT IDENTITY(1,1) PRIMARY KEY,
    RoomTypeName NVARCHAR(100) NOT NULL,
    TypeDescription NVARCHAR(500),
    TypeNote NVARCHAR(500)
);
GO

-- Table: RoomInformation
CREATE TABLE RoomInformation (
    RoomID INT IDENTITY(1,1) PRIMARY KEY,
    RoomNumber NVARCHAR(50) NOT NULL UNIQUE,
    RoomDetailDescription NVARCHAR(500),
    RoomMaxCapacity INT,
    RoomTypeID INT NOT NULL,
    RoomStatus INT DEFAULT 1, -- 1: Active, 0: Inactive
    RoomPricePerDay DECIMAL(18,2) NOT NULL,
    CONSTRAINT FK_RoomInformation_RoomType FOREIGN KEY (RoomTypeID) REFERENCES RoomType(RoomTypeID)
);
GO

-- Table: Customer
CREATE TABLE Customer (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerFullName NVARCHAR(100) NOT NULL,
    Telephone NVARCHAR(20),
    EmailAddress NVARCHAR(150) NOT NULL UNIQUE,
    CustomerBirthday DATE,
    CustomerStatus INT DEFAULT 1, -- 1: Active, 0: Inactive
    Password NVARCHAR(255) NOT NULL
);
GO

-- Table: BookingReservation
CREATE TABLE BookingReservation (
    BookingReservationID INT IDENTITY(1,1) PRIMARY KEY,
    BookingDate DATE NOT NULL,
    TotalPrice DECIMAL(18,2) NOT NULL,
    CustomerID INT NOT NULL,
    BookingStatus INT DEFAULT 1, -- 1: Confirmed, 2: Completed, 0: Cancelled
    CONSTRAINT FK_BookingReservation_Customer FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);
GO

-- Table: BookingDetail (Composite Primary Key)
CREATE TABLE BookingDetail (
    BookingReservationID INT NOT NULL,
    RoomID INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    ActualPrice DECIMAL(18,2) NOT NULL,
    PRIMARY KEY (BookingReservationID, RoomID),
    CONSTRAINT FK_BookingDetail_BookingReservation FOREIGN KEY (BookingReservationID) REFERENCES BookingReservation(BookingReservationID) ON DELETE CASCADE,
    CONSTRAINT FK_BookingDetail_RoomInformation FOREIGN KEY (RoomID) REFERENCES RoomInformation(RoomID)
);
GO

-- ===================================================================
-- SAMPLE DATA INSERTION
-- ===================================================================

-- 1. Room Types
INSERT INTO RoomType (RoomTypeName, TypeDescription, TypeNote) VALUES
(N'Standard Single', N'Cozy room with single bed, free Wi-Fi, air conditioning', N'Non-smoking'),
(N'Deluxe Double', N'Spacious double bed room with ocean view and balcony', N'Complimentary breakfast included'),
(N'Executive Suite', N'Luxury suite with private living room, king bed, and mini-bar', N'VIP services, 24/7 room service'),
(N'Family Room', N'Designed for families, includes two queen beds and children play area', N'Extra bed available on request');
GO

-- 2. Room Information
INSERT INTO RoomInformation (RoomNumber, RoomDetailDescription, RoomMaxCapacity, RoomTypeID, RoomStatus, RoomPricePerDay) VALUES
(N'R101', N'Standard Single Room - Floor 1', 1, 1, 1, 35.00),
(N'R102', N'Standard Single Room - Floor 1', 1, 1, 1, 35.00),
(N'R201', N'Deluxe Double Room - Floor 2 with balcony', 2, 2, 1, 65.00),
(N'R202', N'Deluxe Double Room - Floor 2 city view', 2, 2, 1, 60.00),
(N'R301', N'Executive Suite - Floor 3 penthouse view', 3, 3, 1, 120.00),
(N'R401', N'Family Suite - Floor 4 garden view', 4, 4, 1, 95.00);
GO

-- 3. Customer (Default password for customer is '123456')
-- Spring Boot CustomUserDetailsService supports both hashed and plain passwords!
INSERT INTO Customer (CustomerFullName, Telephone, EmailAddress, CustomerBirthday, CustomerStatus, Password) VALUES
(N'Nguyen Van Customer', N'0901234567', N'customer@gmail.com', '1998-05-15', 1, '123456'),
(N'Tran Thi Mai', N'0912345678', N'mai.tran@gmail.com', '2000-11-20', 1, '123456');
GO

PRINT 'MiniHotel Database setup completed successfully!';

