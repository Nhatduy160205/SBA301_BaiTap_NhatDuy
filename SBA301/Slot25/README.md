# SBA301 - SLOT 25: SECURING REST SERVICES WITH SPRING BOOT (PART B)

## Giới thiệu & Kiến trúc
Dự án hoàn thiện toàn bộ luồng **Authentication & Authorization** bằng JWT theo kiến trúc **3-Layer MVC**:
`Controller -> Service -> Repository -> Database`

### Phân công trách nhiệm các tầng
1. **Controller Layer** (`com.fpt.sba301.slot25.controller`):
   - `AuthenticationController`: Tiếp nhận request `/auth/signup` và `/auth/login`, validate format đầu vào, ủy quyền toàn bộ cho `AuthService`.
   - `UserController`: Cung cấp endpoint bảo mật `/users/me` (đọc `Authentication` principal) và `/users` (gọi `UserService.getAllUsers()`).
2. **Service Layer** (`com.fpt.sba301.slot25.service`): **Toàn bộ logic nghiệp vụ tập trung ở đây**:
   - `AuthService`:
     - `signup()`: Kiểm tra sự tồn tại của email (`existsByEmail`), hash mật khẩu với BCrypt, gán quyền mặc định `USER`, lưu trữ thực thể.
     - `login()`: Giao việc xác thực credential cho `AuthenticationManager`, sau đó sinh JWT token với `JwtService`.
   - `UserService`: Xử lý business mapping từ thực thể `AppUser` sang `UserResponse` DTO, bảo đảm không rò rỉ hash mật khẩu.
   - `JwtService`: Phụ trách tạo token (HMAC-SHA256, expiration 15 phút), parse claims, trích xuất subject và kiểm tra tính hợp lệ của token.
3. **Repository Layer** (`com.fpt.sba301.slot25.repository`):
   - `AppUserRepository`: Kế thừa `JpaRepository<AppUser, Long>`, thuần túy đảm nhiệm persistence queries (`findByEmail`, `existsByEmail`), không chứa business logic.
4. **Security Layer** (`com.fpt.sba301.slot25.security`):
   - `JwtAuthenticationFilter`: Lọc từng request, trích xuất Bearer token từ header, xác thực với `UserDetailsService` và đưa `Authentication` vào `SecurityContextHolder`.
   - `RestAuthenticationEntryPoint`: Chuẩn hóa lỗi 401 về định dạng JSON `{"error":"UNAUTHORIZED"}`.
   - `SecurityConfig`: Cấu hình SecurityFilterChain với chính sách Session STATELESS, tắt CSRF cho REST stateless, phân quyền truy cập.

## Cấu hình Database & Port
- Database: Microsoft SQL Server (`localhost:1433`), Database name: `SBA301_OrchidDB` (in-memory H2 trong môi trường test).
- Port: `8080`.

## API Endpoints
| Method | Endpoint | Quyền hạn | Chức năng | Expected HTTP |
|--------|----------|-----------|-----------|---------------|
| POST | `/auth/signup` | Public | Đăng ký tài khoản mới | 201 Created |
| POST | `/auth/login` | Public | Đăng nhập nhận Bearer JWT | 200 OK / 401 Unauthorized |
| GET | `/users/me` | Authenticated | Xem profile người dùng đăng nhập | 200 OK / 401 Unauthorized |
| GET | `/users` | Authenticated | Danh sách tất cả người dùng | 200 OK / 401 Unauthorized |

## Lệnh thực thi & Kiểm thử
```powershell
# Chạy toàn bộ 7 Integration Tests tự động (100% PASS)
.\mvnw test

# Chạy ứng dụng Spring Boot
.\mvnw spring-boot:run
```