# SBA301 - Slot 14: Documenting REST Services with OpenAPI / Swagger

Dự án thực hành tổng hợp Slot 14 - Tích hợp `springdoc-openapi` (OpenAPI 3.0 & Swagger UI), tài liệu hóa REST API theo tiêu chuẩn ngành và kiến trúc 3-layer MVC.

## 1. Cấu trúc thư mục

```
com.fpt.sba301.slot14/
├── Slot14Application.java       # Main Spring Boot Runner
├── config/
│   └── OpenApiConfig.java       # Tùy biến tiêu đề, mô tả, thông tin liên hệ và Server URL
├── controller/
│   └── NewsController.java      # Gắn nhãn @Tag, @Operation, @ApiResponse, @Parameter
├── service/                     # Tầng Service xử lý nghiệp vụ
│   ├── NewsService.java         # Interface nghiệp vụ
│   └── NewsServiceImpl.java     # Kiểm tra hợp lệ dữ liệu, chống trùng tiêu đề, cập nhật
├── repository/
│   └── NewsRepository.java      # In-Memory thread-safe repository
├── dto/
│   ├── NewsDTO.java             # Entity DTO với các chú thích @Schema, ví dụ minh họa
│   └── NewsCreateDTO.java       # Request payload với ràng buộc bean validation
└── exception/
    ├── NewsNotFoundException.java
    ├── ValidationException.java
    ├── ApiError.java            # Cấu trúc lỗi @Schema chuẩn trả về client
    └── GlobalExceptionHandler.java # @RestControllerAdvice định tuyến mã trạng thái
```

## 2. Hướng dẫn chạy và khám phá Swagger UI

### 2.1 Khởi động server
```bash
cd Slot14
mvn spring-boot:run
```

### 2.2 Truy cập tài liệu tương tác
- **Swagger UI Interactive Interface**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON Spec**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

Bạn có thể dùng nút **"Try it out"** ngay trên trình duyệt để gửi các lệnh GET, POST, PUT, DELETE trực tiếp đến backend.
