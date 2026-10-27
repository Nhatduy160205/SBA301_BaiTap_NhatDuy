# SBA301 - Lab 06: Spring Boot 3 Security & JWT Authentication Guide

Dự án này được xây dựng chính xác 100% theo tài liệu hướng dẫn:
**`SBA301_Lab06_Detailed_Step_by_Step_Spring_Security_JWT_Guide_V2.pdf`**

Tuân thủ nghiêm ngặt **Kiến trúc 3 lớp (3-Layer MVC Architecture)**:
- **Presentation Layer (Controllers)**: Tiếp nhận HTTP request, validate dữ liệu đầu vào thông qua DTO (`@Valid`), trả về Response DTO chuẩn (không bao giờ lộ mật khẩu hash của người dùng).
- **Service Layer (Business Logic Layer)**: Toàn bộ nghiệp vụ (xác thực dữ liệu trùng lặp, mã hóa mật khẩu bằng BCrypt, ủy quyền xác thực cho `AuthenticationManager`, sinh và kiểm tra JWT token, quản trị người dùng) được xử lý tập trung trong `@Service`.
- **Data Access Layer (Repositories)**: Sử dụng Spring Data JPA Repository (`UserRepository`) thuần túy cho truy vấn cơ sở dữ liệu, tuyệt đối không chứa logic nghiệp vụ.

---

## 1. Thông Tin Cấu Hình & Công Nghệ

- **Framework**: Spring Boot 3.3.4
- **Java**: JDK 21
- **Security**: Spring Security 6.x (CSRF disabled, `STATELESS` session management, `DaoAuthenticationProvider`, `JwtAuthenticationFilter` trước `UsernamePasswordAuthenticationFilter`)
- **JWT**: `io.jsonwebtoken:jjwt-api`, `jjwt-impl`, `jjwt-jackson` (Version 0.12.6)
- **Database**: Microsoft SQL Server (tự động kết nối database `OrchidJWTLab` trên cổng `1433`)
- **Server Port**: `8005` (theo cấu hình chuẩn của Lab 06)
- **Base Package**: `fu.se.lab06jwt`

---

## 2. Cấu Trúc Thư Mục Dự Án

```
Lab06/
├── pom.xml
├── mvnw.cmd
├── run_lab06.bat
├── src/
│   ├── main/
│   │   ├── java/fu/se/lab06jwt/
│   │   │   ├── Lab06JwtApplication.java
│   │   │   ├── configs/
│   │   │   │   ├── ApplicationConfiguration.java   # Bean: UserDetailsService, PasswordEncoder, DaoAuthenticationProvider, AuthenticationManager
│   │   │   │   ├── JwtAuthenticationFilter.java    # Bộ lọc trích xuất Bearer token & nạp SecurityContext
│   │   │   │   └── SecurityConfiguration.java      # Cấu hình SecurityFilterChain, phân quyền endpoints, Stateless session
│   │   │   ├── controllers/
│   │   │   │   ├── AuthenticationController.java   # /auth/signup & /auth/login
│   │   │   │   └── UserController.java             # /users/me & /users
│   │   │   ├── dtos/
│   │   │   │   ├── RegisterUserDto.java            # DTO đăng ký
│   │   │   │   └── LoginUserDto.java               # DTO đăng nhập
│   │   │   ├── entities/
│   │   │   │   └── User.java                       # Entity ánh xạ bảng `users`, implements UserDetails
│   │   │   ├── exceptions/
│   │   │   │   └── GlobalExceptionHandler.java     # Chuẩn hóa lỗi 400 (validation), 401 (sai thông tin/hết hạn), 409 (email đã tồn tại)
│   │   │   ├── repositories/
│   │   │   │   └── UserRepository.java             # JPA Repository thuần túy (findByEmail, existsByEmail)
│   │   │   ├── responses/
│   │   │   │   ├── LoginResponse.java              # Token và thời gian hết hạn (expiresIn)
│   │   │   │   └── UserResponse.java               # DTO thông tin user trả về cho client
│   │   │   └── services/
│   │   │       ├── AuthenticationService.java      # Nghiệp vụ đăng ký, kiểm tra trùng lặp email, BCrypt encode, đăng nhập
│   │   │       ├── JwtService.java                 # Nghiệp vụ tạo, parse, validate HMAC-SHA256 JWT
│   │   │       └── UserService.java                # Nghiệp vụ truy vấn danh sách người dùng
│   │   └── resources/
│   │       └── application.properties              # Cổng 8005, OrchidJWTLab, JWT Secret & Expiration
│   └── test/
│       ├── java/fu/se/lab06jwt/
│       │   └── Lab06SecurityIntegrationTests.java  # 12 bài test tự động phủ kín T01 -> T12
│       └── resources/
│           └── application.properties              # H2 database in-memory cho test độc lập
```

---

## 3. Danh Sách API Endpoints

| Phương thức | Endpoint | Quyền truy cập | Mô tả |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/signup` | Public (`permitAll`) | Đăng ký tài khoản người dùng mới (kiểm tra trùng email ở Service) |
| **POST** | `/auth/login` | Public (`permitAll`) | Đăng nhập hệ thống, sinh và trả về JWT Bearer Token |
| **GET** | `/users/me` | Authenticated (JWT) | Lấy thông tin tài khoản của chính người dùng đang đăng nhập |
| **GET** | `/users` | Authenticated (JWT) | Lấy danh sách toàn bộ người dùng trong hệ thống |

---

## 4. Hướng Dẫn Chạy Dự Án

### Cách 1: Chạy trực tiếp bằng file `run_lab06.bat`
Click đúp chuột vào file `run_lab06.bat` tại thư mục `Lab06` hoặc chạy trong PowerShell / Command Prompt:
```powershell
cd d:\Data\Documents\HSF302\LAB-SBA301\Lab06
.\run_lab06.bat
```

### Cách 2: Chạy qua Maven Wrapper
```powershell
cd d:\Data\Documents\HSF302\LAB-SBA301\Lab06
java -classpath ".mvn/wrapper/maven-wrapper.jar" "-Dmaven.multiModuleProjectDirectory=." org.apache.maven.wrapper.MavenWrapperMain spring-boot:run
```

### Cách 3: Chạy file JAR đã đóng gói
```powershell
cd d:\Data\Documents\HSF302\LAB-SBA301\Lab06
java -jar target/lab06jwt-1.0.0.jar
```

Server sẽ khởi động tại: `http://localhost:8005`

---

## 5. Kết Quả Kiểm Thử (12/12 Test Cases Passed)

Dự án tích hợp đầy đủ bộ test tự động `Lab06SecurityIntegrationTests` kiểm tra toàn bộ luồng bảo mật:
1. `T01_signup_success`: Đăng ký thành công trả về HTTP 200/201 kèm thông tin người dùng.
2. `T02_signup_duplicateEmail_returnsConflict`: Đăng ký trùng email trả về HTTP 409 Conflict.
3. `T03_signup_invalidEmail_returnsBadRequest`: Email không đúng định dạng trả về HTTP 400 Bad Request.
4. `T04_login_success`: Đăng nhập đúng trả về HTTP 200 kèm JWT token và expiresIn.
5. `T05_login_wrongPassword_returnsUnauthorized`: Đăng nhập sai mật khẩu trả về HTTP 401 Unauthorized.
6. `T06_login_nonExistingUser_returnsUnauthorized`: Tài khoản không tồn tại trả về HTTP 401 Unauthorized.
7. `T07_accessProtected_withoutToken_returnsUnauthorized`: Truy cập `/users/me` không có token trả về HTTP 401.
8. `T08_accessProtected_withValidToken_returnsUserProfile`: Truy cập `/users/me` kèm token hợp lệ thành công.
9. `T09_accessProtected_withTamperedToken_returnsUnauthorized`: Token bị sửa đổi/giả mạo bị từ chối với HTTP 401.
10. `T10_accessProtected_withExpiredToken_returnsUnauthorized`: Token hết hạn bị từ chối với HTTP 401.
11. `T11_getAllUsers_withValidToken_returnsList`: Truy cập `/users` kèm token hợp lệ trả về danh sách người dùng.
12. `T12_userResponse_doesNotExposePasswordHash`: Đảm bảo DTO trả về cho client không chứa trường hash password.
