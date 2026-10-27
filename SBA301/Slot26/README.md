# SBA301 - SLOT 26: SECURITY CONSOLIDATION (PART C)

## Giới thiệu & Kiến trúc
Dự án hoàn thiện toàn bộ tầng **Security Consolidation** theo kiến trúc **3-Layer MVC**:
`Controller -> Service -> Repository -> Database`
Xử lý logic và business rules hoàn toàn ở **Service Layer**, không xử lý ở Repository.

### Phân công trách nhiệm
1. **Controller Layer** (`com.fpt.sba301.slot26.controller`):
   - `AuthController`: Tiếp nhận `/auth/signup` và `/auth/login`.
   - `UserController`: Endpoint `/users/me` cho người dùng đã xác thực.
   - `AdminController`: Endpoint `/admin/users` bảo vệ bằng role `ROLE_ADMIN`.
   - `OrchidController`: CRUD Orchid API (`GET` public, `POST`/`PUT` cho `USER`/`ADMIN`, `DELETE` cho `ADMIN`).
2. **Service Layer** (`com.fpt.sba301.slot26.service`):
   - `AuthService`: Xử lý đăng ký, mã hóa mật khẩu bằng BCrypt, gán quyền (`USER` / `ADMIN`), phân phối JWT qua `JwtService`.
   - `UserService`: Cung cấp danh sách người dùng cho Admin, chuyển đổi thực thể sang DTO.
   - `OrchidService`: Nghiệp vụ CRUD Orchid, dirty checking, kiểm tra tiền điều kiện.
   - `JwtService`: Tạo JWT chứa claim `roles`, ký bằng HMAC-SHA256, parse claims và kiểm tra tính hợp lệ (expiration, signature).
3. **Repository Layer** (`com.fpt.sba301.slot26.repository`):
   - `AppUserRepository` và `OrchidRepository` là pure Spring Data JPA interfaces, chỉ khai báo phương thức truy vấn.
4. **Security & CORS** (`com.fpt.sba301.slot26.security`):
   - `CorsConfigurationSource`: Cấu hình chi tiết cho React SPA (`http://localhost:5173`), hỗ trợ phương thức `GET, POST, PUT, DELETE, OPTIONS`, header `Authorization, Content-Type`.
   - `JwtAuthenticationFilter`: Phân tích Bearer token, trích xuất subject và quyền hạn, đặt vào `SecurityContext`.
   - Phân biệt rõ ràng mã HTTP: 401 Unauthorized (khi chưa xác thực / sai token), 403 Forbidden (khi thiếu role `ADMIN`), 200/201 (khi hợp lệ).

## Negative Test Matrix (10 Scenarios - 100% PASS)
| ID | Kịch bản kiểm thử | Kỳ vọng | Kết quả |
|----|-------------------|---------|---------|
| N01 | Gọi `/users/me` không có token | 401 Unauthorized | PASS |
| N02 | Gọi với token rác (malformed) | 401 Unauthorized | PASS |
| N03 | Gọi với token bị sửa đổi (tampered signature) | 401 Unauthorized | PASS |
| N04 | Gọi với token đã hết hạn (expired) | 401 Unauthorized | PASS |
| N05 | Tài khoản USER gọi `/admin/users` | 403 Forbidden | PASS |
| N06 | Tài khoản ADMIN gọi `/admin/users` | 200 OK | PASS |
| N07 | Public GET `/orchids` không cần token | 200 OK | PASS |
| N08 | CORS Preflight OPTIONS từ `http://localhost:5173` | Trả CORS Headers | PASS |
| N09 | CORS Preflight từ origin lạ `http://evil.example` | Bị chặn CORS | PASS |
| N10 | Đăng nhập với sai mật khẩu | 401 Unauthorized | PASS |

## Lệnh thực thi & Kiểm thử
```powershell
# Chạy toàn bộ 10 Integration Tests
.\mvnw test

# Khởi chạy ứng dụng
.\mvnw spring-boot:run
```