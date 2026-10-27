# SBA301 - Slot 12: REST Fundamentals with Spring Boot (Part A)

Dự án thiết kế API Contract và khởi tạo khung xương (Skeleton) kiến trúc 3-Layer MVC cho hệ thống **FUNewsManagementSystem**.

## 1. Kiến trúc dự án (MVC 3-Layer Service Architecture)

```
com.fpt.sba301.slot12/
├── Slot12Application.java       # Spring Boot main runner
├── controller/                  # Presentation Layer
│   ├── HelloController.java     # Kiểm tra healthcheck & metadata
│   ├── NewsController.java      # REST endpoints cho News resource
│   └── CategoryController.java  # REST endpoints cho Category resource
├── service/                     # Service Layer (Business Logic & Validation)
│   ├── NewsService.java         # Xử lý logic lọc, tìm kiếm, kiểm tra hợp lệ của News
│   └── CategoryService.java     # Xử lý logic Category
├── repository/                  # Data Access Layer
│   ├── NewsRepository.java      # In-Memory thread-safe repository (ConcurrentHashMap)
│   └── CategoryRepository.java  # In-Memory repository cho Category
├── model/                       # Data Model & DTOs
│   ├── News.java
│   ├── Category.java
│   └── ApiResponse.java         # Generic Response Wrapper
└── exception/                   # Exception Handling
    └── GlobalExceptionHandler.java # @RestControllerAdvice xử lý lỗi tập trung (404, 400, 500)
```

## 2. Hướng dẫn chạy và kiểm thử

### 2.1 Chạy dự án
```bash
cd Slot12
mvn spring-boot:run
```
Ứng dụng khởi động tại: `http://localhost:8080`

### 2.2 Kiểm tra endpoint
- **GET** `http://localhost:8080/api/hello`
- **GET** `http://localhost:8080/api/news`
- **GET** `http://localhost:8080/api/news/1`
- **POST** `http://localhost:8080/api/news` (JSON body)
- **PUT** `http://localhost:8080/api/news/1`
- **DELETE** `http://localhost:8080/api/news/1`
- **GET** `http://localhost:8080/api/categories`
