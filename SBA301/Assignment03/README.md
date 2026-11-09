# FUMiniHotelSystem - Assignment 03 (SBA301)
### Securing REST Services with Spring Boot & React Client

Hệ thống quản lý khách sạn mini hoàn chỉnh bao gồm **Spring Boot 3 RESTful API (Backend)** và **ReactJS Client (Frontend)**.

---

## 1. Cấu Trúc Dự Án

```
Assignment03/
├── backend/                              # Mã nguồn Spring Boot 3 RESTful API
│   ├── src/main/java/com/badmintion/backend/
│   │   ├── config/                       # Cấu hình hệ thống
│   │   ├── controller/                   # REST Controllers (Auth, Rooms, Customers, Bookings, RoomTypes)
│   │   ├── dto/                          # DTOs & Validation
│   │   ├── entity/                       # 5 Entity (RoomType, RoomInformation, Customer, BookingReservation, BookingDetail)
│   │   ├── exception/                    # Global Exception Handler & Custom Exceptions
│   │   ├── repository/                   # Spring Data JPA Repositories
│   │   ├── security/                     # Spring Security 6 & JWT Filter, CustomUserDetailsService
│   │   └── service/                      # Business Services & Implementations
│   └── src/main/resources/
│       └── application.properties        # Cấu hình DB SQL Server, Staff Account, JWT Secret
├── frontend/                             # Mã nguồn ReactJS Client (Vite + Axios)
│   ├── src/
│   │   ├── components/                   # Navbar, Badges, Modals
│   │   ├── context/                      # AuthContext (JWT Token, User State)
│   │   ├── pages/                        # Rooms, Login, Register, Profile, My Bookings, Staff Management
│   │   └── services/                     # Axios API Service & JWT Interceptors
│   └── package.json
└── database_setup.sql                    # Script tạo Database & Dữ liệu mẫu (Phòng, Loại phòng, Khách hàng)
```

---

## 2. Hướng Dẫn Cấu Hình SQL Server

1. Mở file [application.properties](file:///d:/SBA301/excersize/SBA301/Assignment03/backend/src/main/resources/application.properties):
   - Chỉnh sửa `spring.datasource.url` (tên Database, mặc định là `A3StudentName_ClassCode`).
   - Điền tài khoản `sa` và `password` SQL Server của máy bạn:
     ```properties
     spring.datasource.username=sa
     spring.datasource.password=123456
     ```
2. Mở SSMS (SQL Server Management Studio) hoặc Azure Data Studio, mở file [database_setup.sql](file:///d:/SBA301/excersize/SBA301/Assignment03/database_setup.sql) và nhấn **Execute** để tạo Database và dữ liệu mẫu có sẵn các loại phòng, các phòng mẫu và tài khoản khách hàng.

---

## 3. Khởi Động Backend & Frontend

### Khởi động Backend (Spring Boot):
Cách 1: Mở thư mục `backend` bằng IntelliJ IDEA và nhấn nút **Run `BackendApplication`**.
Cách 2: Chạy lệnh trong terminal:
```bash
cd backend
mvn spring-boot:run
```
*Backend chạy tại:* `http://localhost:8080`

### Khởi động Frontend (ReactJS):
Chạy lệnh trong terminal:
```bash
cd frontend
npm run dev
```
*Frontend chạy tại:* `http://localhost:5173`

---

## 4. Tài Khoản Đăng Nhập Mẫu

| Vai trò | Email | Mật khẩu | Chức năng kiểm thử |
| :--- | :--- | :--- | :--- |
| **Staff (Admin)** | `staff@fuminihotel.com` | `Staff@123` | - Lấy trực tiếp từ `application.properties`<br>- Quản lý phòng (CRUD, logic xóa phòng thông minh)<br>- Quản lý khách hàng (CRUD)<br>- Quản lý tất cả đơn đặt phòng & cập nhật trạng thái |
| **Customer** | `customer@gmail.com` | `123456` | - Xem phòng công khai không cần login<br>- Đăng ký tài khoản mới<br>- Đặt 1 hoặc nhiều phòng online cùng lúc<br>- Cập nhật Profile cá nhân<br>- Xem lịch sử đặt phòng |

