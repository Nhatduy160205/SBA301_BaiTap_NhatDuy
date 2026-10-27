# SBA301 - SLOT 24: SECURING REST SERVICES WITH SPRING BOOT (PART A)

## Giới thiệu & Kiến trúc
Dự án được xây dựng theo kiến trúc **3-Layer MVC chuẩn**:
Controller -> Service -> Repository -> Database
- **Controller** (com.fpt.sba301.slot24.controller): Xử lý routing HTTP, bind JSON, validate @Valid, trả về DTO + HTTP status chuẩn (200, 201, 401, 403).
- **Service** (com.fpt.sba301.slot24.service): **Toàn bộ nghiệp vụ, business logic và mã hóa**:
  - AuthService: Kiểm tra trùng lặp email (existsByEmail), mã hóa mật khẩu bằng BCrypt (PasswordEncoder), ủy quyền xác thực cho AuthenticationManager, tạo JWT access token thông qua JwtService.
  - JwtService: Tạo/ký token bằng HMAC-SHA256, parse claims, extract subject, validate expiration và signature.
- **Repository** (com.fpt.sba301.slot24.repository): AppUserRepository thuần Spring Data JPA, không chứa bất kỳ business logic nào.
- **Security & Filter** (com.fpt.sba301.slot24.security):
  - JwtAuthenticationFilter: Kế thừa OncePerRequestFilter, phân tích Bearer <token>, nạp thông tin người dùng và thiết lập SecurityContextHolder.
  - SecurityConfig: Cấu hình stateless session policy, CSRF disabled cho REST stateless, permitAll cho /auth/** và phân quyền cho /admin/** (ROLE_ADMIN) cùng các endpoint khác (uthenticated).
  - ApiExceptionHandler: Chuẩn hóa lỗi 401 (BadCredentialsException), 403 (AccessDeniedException), 400 (MethodArgumentNotValidException), 409 (IllegalStateException).

## Cấu hình Database & Port
- Database: Microsoft SQL Server (localhost:1433), Database name: SBA301_OrchidDB (hoặc test H2 in-memory).
- Port: 8080.
- JWT Secret: externalized trong pplication.properties (hoặc biến môi trường JWT_SECRET).

## API Endpoints
| Method | Endpoint | Access | Chức năng | Expected Status |
|--------|----------|--------|-----------|-----------------|
| POST | /auth/signup | Public | Đăng ký tài khoản (BCrypt hash) | 201 Created |
| POST | /auth/login | Public | Đăng nhập nhận JWT Token | 200 OK / 401 Unauthorized |
| GET | /users/me | Protected | Lấy thông tin tài khoản hiện tại | 200 OK (với Bearer Token) / 401 |
| GET | /admin/dashboard| ADMIN | Khu vực quản trị viên | 200 (ADMIN) / 403 (USER) / 401 (No Token)|

## Lệnh thực thi & Kiểm thử
`powershell
# Chạy Unit & Integration Tests (100% PASS)
.\mvnw test

# Khởi chạy ứng dụng
.\mvnw spring-boot:run
`