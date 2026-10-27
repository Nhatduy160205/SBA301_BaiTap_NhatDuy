USE master;
GO

-- 1. Tạo Database SBA301_OrchidDB nếu chưa tồn tại
IF DB_ID('SBA301_OrchidDB') IS NULL
BEGIN
    CREATE DATABASE SBA301_OrchidDB;
    PRINT N'>> Da tao thanh cong Database: SBA301_OrchidDB';
END
ELSE
BEGIN
    PRINT N'>> Database SBA301_OrchidDB da ton tai.';
END
GO

USE SBA301_OrchidDB;
GO

-- 2. Tạo bảng Orchid nếu chưa có
IF OBJECT_ID('dbo.Orchid', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Orchid (
        orchid_id INT IDENTITY(1,1) PRIMARY KEY,
        orchid_name NVARCHAR(150) NOT NULL,
        is_natural BIT NOT NULL DEFAULT 1,
        orchid_description NVARCHAR(1000) NULL,
        orchid_category NVARCHAR(100) NULL,
        is_attractive BIT NOT NULL DEFAULT 1,
        orchid_url NVARCHAR(2048) NULL
    );
    PRINT N'>> Da tao thanh cong bang dbo.Orchid';
END
ELSE
BEGIN
    PRINT N'>> Bang dbo.Orchid da ton tai.';
END
GO

-- 3. Chèn dữ liệu mẫu (Seed Data)
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE orchid_name = N'Taichung Beauty')
BEGIN
    INSERT INTO dbo.Orchid (orchid_name, is_natural, orchid_description, orchid_category, is_attractive, orchid_url)
    VALUES 
    (N'Taichung Beauty', 1, N'Demo orchid for SBA301 Lab 05', N'Cattleya', 1, N'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80'),
    (N'Phalaenopsis Amabilis', 1, N'Lan hồ điệp trắng tinh khôi đặc hữu vùng nhiệt đới Đông Nam Á.', N'Phalaenopsis', 1, N'https://images.unsplash.com/photo-1566999537091-c07456657992?auto=format&fit=crop&w=600&q=80'),
    (N'Dendrobium Nobile', 0, N'Giống lan hoàng thảo lai tạo với cánh hoa viền tím độc đáo, sức sống bền bỉ.', N'Dendrobium', 1, N'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80');
    PRINT N'>> Da chen 3 ban ghi hoa lan mau thanh cong.';
END
GO

-- 4. Kiểm tra danh sách hoa lan
SELECT 
    orchid_id AS [ID],
    orchid_name AS [Tên Hoa],
    is_natural AS [Tự Nhiên],
    orchid_category AS [Loại],
    is_attractive AS [Đẹp/Thu hút],
    orchid_description AS [Mô tả]
FROM dbo.Orchid;
GO
