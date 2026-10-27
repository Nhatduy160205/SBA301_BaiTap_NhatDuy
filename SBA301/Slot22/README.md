# SBA301 - Slot 22: Chapter 15 Part A - CRUD Backend (FUNewsManagementSystem)

Dự án Backend RESTful Web Service hoàn chỉnh cho Module **Category & NewsArticle** theo đúng tài liệu **`SBA301 - SLOT 22`**.

---

## 1. Kiến Trúc 3 Lớp Chuẩn MVC Layer Service

- **Controller (`CategoryController.java`)**: Đóng vai trò HTTP boundary (`/api/categories`), tiếp nhận request, validate DTO `@Valid`, ánh xạ HTTP status code (200, 201, 204, 400, 404, 409).
- **Service Layer (`CategoryServiceImpl.java`)**: **Xử lý 100% logic nghiệp vụ & business rules**:
  1. Kiểm tra validation bắt buộc `categoryName`, `categoryDescription` không được rỗng.
  2. Kiểm tra tên Category trùng lặp (Case-insensitive unique check) ➔ Ném `BusinessConflictException` (HTTP 409 Conflict).
  3. Kiểm tra Category có tồn tại khi update hoặc delete ➔ Ném `ResourceNotFoundException` (HTTP 404 Not Found).
  4. **Business Rule Assignment 02**: Kiểm tra Category đang được tham chiếu bởi `NewsArticle` ➔ Ném `BusinessConflictException` (HTTP 409 Conflict: Không cho phép xóa category đang có bài viết).
  5. Dirty checking và quản lý transaction với `@Transactional`.
- **Repository (`CategoryRepository.java` & `NewsArticleRepository.java`)**: Kế thừa thuần túy `JpaRepository`, **tuyệt đối không chứa business logic**.

---

## 2. API Contract & Test Matrix (T01 - T12)

| ID | Endpoint | Method | Payload / Param | Expected HTTP | Ý nghĩa / Business Rule |
|:---|:---|:---:|:---|:---:|:---|
| **T01** | `/api/categories` | GET | None | 200 OK | Lấy danh sách phân trang Category |
| **T02** | `/api/categories/{id}` | GET | ID tồn tại | 200 OK | Xem chi tiết Category |
| **T03** | `/api/categories/{missingId}` | GET | ID không tồn tại | 404 Not Found | Báo lỗi không tìm thấy |
| **T04** | `/api/categories` | POST | CategoryRequest hợp lệ | 201 Created | Tạo mới Category thành công |
| **T05** | `/api/categories` | POST | Tên rỗng `""` | 400 Bad Request | Bắt lỗi validation đầu vào |
| **T06** | `/api/categories` | POST | Trùng tên Category | 409 Conflict | Business rule: Tên duy nhất |
| **T07** | `/api/categories/{id}` | PUT | CategoryRequest hợp lệ | 200 OK | Cập nhật Category thành công |
| **T08** | `/api/categories/{missingId}` | PUT | ID không tồn tại | 404 Not Found | Cập nhật ID không tồn tại |
| **T09** | `/api/categories/{freeId}` | DELETE | Category chưa có News | 204 No Content | Xóa Category hợp lệ |
| **T10** | `/api/categories/{usedId}` | DELETE | Category đã có News | 409 Conflict | **Business rule: Chặn xóa FK** |
| **T11** | `/api/categories?keyword=...` | GET | `keyword=academic` | 200 OK | Tìm kiếm theo tên |
| **T12** | `/api/categories?page=0&size=1` | GET | Pageable | 200 OK | Phân trang dữ liệu |

---

## 3. Hướng Dẫn Chạy Dự Án

### Khởi động Backend
```bash
cd Slot22
java -jar target/slot22-1.0.0.jar
# hoặc nếu dùng maven wrapper:
# .\mvnw.cmd spring-boot:run
```

### Chạy Kiểm Thử Tự Động (Automation Tests)
```bash
.\mvnw.cmd test
```
