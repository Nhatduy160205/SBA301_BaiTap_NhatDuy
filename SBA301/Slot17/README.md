# Slot 17 - Data Persistence with JPA & Relationships (FUNews Persistence Core)

## 1. Giới thiệu tổng quan
Dự án thực hành chuyên sâu theo giáo trình **SBA301 Slot 17 - Chapter 13 Part A: JPA, Entity, Repository, Service & Relationships + PA02**.
Nối tiếp chuỗi bài tập **FUNewsManagementSystem** từ Slot 12 đến Slot 16, bài thực hành này chuyển dịch toàn bộ hệ thống từ in-memory sang tầng lưu trữ bền vững JPA (Data Persistence) với đầy đủ quan hệ thực thể:
- `Category (1) <---> (N) News`
- `News (N) <---> (N) Tag` (thông qua bảng liên kết `news_tags`)

## 2. Nguyên tắc kiến trúc MVC Service Layer
- **Tách biệt rõ ràng:**
  - `Controller`: Tiếp nhận request HTTP, điều phối service và định dạng response DTO.
  - `Service`: **Xử lý toàn bộ logic nghiệp vụ (Business Rules), validation và Transaction Boundary**.
    - Ngăn chặn tạo Category trùng tên.
    - Ngăn chặn tạo News vào Category đang bị vô hiệu hóa (`active = false`).
    - Ngăn chặn xóa Category nếu vẫn còn News liên kết.
    - Quản lý `@Transactional(readOnly = true)` và `@Transactional`.
  - `Repository`: Kế thừa `JpaRepository`, chỉ khai báo các Derived Query Methods, **không chứa xử lý logic**.
- **DTO Boundary:** Ánh xạ Entity sang DTO (`CategoryDTO`, `NewsDTO`, `TagDTO`) để bảo vệ domain model và loại bỏ rủi ro vòng lặp đệ quy tuần hoàn (`Infinite JSON Recursion`).

## 3. Cấu trúc dự án
```
Slot17/
├── pom.xml
├── README.md
├── docs/
│   ├── concept-trace.md
│   └── pa02-checkpoint.md
└── src/
    ├── main/
    │   ├── java/com/fpt/sba301/slot17/
    │   │   ├── Slot17Application.java
    │   │   ├── config/DataInitializer.java
    │   │   ├── controller/
    │   │   │   ├── CategoryController.java
    │   │   │   ├── NewsController.java
    │   │   │   └── TagController.java
    │   │   ├── dto/
    │   │   │   ├── CategoryDTO.java
    │   │   │   ├── NewsDTO.java
    │   │   │   ├── NewsCreateDTO.java
    │   │   │   └── TagDTO.java
    │   │   ├── entity/
    │   │   │   ├── Category.java
    │   │   │   ├── News.java
    │   │   │   └── Tag.java
    │   │   ├── exception/
    │   │   │   ├── GlobalExceptionHandler.java
    │   │   │   └── ResourceNotFoundException.java
    │   │   ├── repository/
    │   │   │   ├── CategoryRepository.java
    │   │   │   ├── NewsRepository.java
    │   │   │   └── TagRepository.java
    │   │   └── service/
    │   │       ├── CategoryService.java
    │   │       ├── NewsService.java
    │   │       └── TagService.java
    │   └── resources/application.properties
    └── test/
        └── java/com/fpt/sba301/slot17/
            ├── Slot17ApplicationTests.java
            ├── controller/NewsControllerTest.java
            ├── repository/CategoryRepositoryTest.java
            └── service/CategoryServiceTest.java
```

## 4. Hướng dẫn chạy và kiểm thử
```bash
cd D:\Data\Documents\HSF302\LAB-SBA301\Slot17

# Chạy toàn bộ Unit và Slice Tests:
mvn test

# Khởi chạy ứng dụng:
mvn spring-boot:run
```
Console H2 database có sẵn tại: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:funewsdb`
- User: `sa`, Password: (để trống)
