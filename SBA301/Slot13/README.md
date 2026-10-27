# SBA301 - Slot 13: Spring Boot REST Annotations & 3-Layer CRUD

Dự án thực hành tổng hợp Slot 13 - Spring Boot Annotations (`@RestController`, `@RequestMapping`, `@PathVariable`, `@RequestParam`, `@RequestBody`, `@Valid`), kiến trúc 3 tầng chuẩn (Controller → Service → Repository), và xử lý lỗi tập trung (`@RestControllerAdvice`).

## 1. Cấu trúc thư mục mục tiêu

```
com.fpt.sba301.slot13/
├── Slot13Application.java       # Main entry point
├── controller/
│   ├── HelloController.java     # Kiểm tra trạng thái runtime
│   └── NewsController.java      # REST Controller CRUD cho News
├── service/                     # Tầng Service: Xử lý logic & validation
│   ├── NewsService.java         # Interface định nghĩa các nghiệp vụ
│   └── NewsServiceImpl.java     # Implementation kiểm tra hợp lệ, chống trùng tiêu đề, xử lý ngoại lệ
├── repository/                  # Tầng Repository: Data access
│   └── NewsRepository.java      # In-Memory thread-safe repository (ConcurrentHashMap)
├── model/                       # Data Model & DTOs
│   ├── News.java                # Entity
│   ├── NewsRequestDTO.java      # DTO đầu vào kèm bean validation (@NotBlank, @Size)
│   └── NewsResponseDTO.java     # DTO đầu ra
└── exception/                   # Quản lý lỗi
    ├── NewsNotFoundException.java   # Lỗi 404
    ├── ValidationException.java     # Lỗi 400
    ├── ApiError.java                # Cấu trúc JSON thông báo lỗi chuẩn
    └── GlobalExceptionHandler.java  # @RestControllerAdvice bắt và định dạng ngoại lệ
```

## 2. Các HTTP Endpoints & Kết quả mong đợi

| Method | Endpoint | Status | Mô tả |
|---|---|---|---|
| `GET` | `/api/news` | `200 OK` | Danh sách tin tức, hỗ trợ query `?search=...&category=...` |
| `GET` | `/api/news/{id}` | `200 OK` / `404` | Chi tiết bài viết hoặc báo lỗi nếu không tìm thấy |
| `POST` | `/api/news` | `201 Created` | Thêm mới bài viết (trả về Location header và body) |
| `PUT` | `/api/news/{id}` | `200 OK` / `404` / `400` | Cập nhật bài viết |
| `DELETE`| `/api/news/{id}` | `204 No Content` / `404` | Xóa bài viết |

## 3. Hướng dẫn chạy

```bash
cd Slot13
mvn spring-boot:run
```
