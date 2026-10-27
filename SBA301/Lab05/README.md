# BÁO CÁO TOÀN DIỆN BÀI TẬP LAB 05 — FULL-STACK SPA (SPRING BOOT + REACTJS + SQL SERVER)

> **Môn học:** SBA301 — Web Application Development  
> **Dự án:** Orchid Management (Quản lý hoa lan full-stack SPA)  
> **Sinh viên:** Phong-the20  
> **Tài liệu tham chiếu:** `SBA301_Lab05_Step_by_Step_FullStack_SPA_Guide.pdf`

---

## 📌 BẢNG TỔNG HỢP KIỂM TRA ĐÁNH GIÁ (CHECKLIST 100%)

| Hạng mục yêu cầu của Giảng viên | Trạng thái | Chi tiết triển khai & Bằng chứng |
|:---|:---:|:---|
| **1. Ba (3) phần cơ bản** | **HOÀN THÀNH** | Backend REST API, Service Layer chuẩn MVC, Frontend ReactJS SPA |
| **2. Phần Fix lỗi (Troubleshooting)** | **HOÀN THÀNH** | Ghi nhận chi tiết 5 lỗi kinh điển (CORS, Image URL, Jackson, SQL, 415) |
| **3. Phần Mở rộng (Advanced)** | **HOÀN THÀNH** | Tìm kiếm, Lọc danh mục, Lọc trạng thái, Sắp xếp, Modal xem ảnh lớn |
| **4. Post Git (Đẩy lên GitHub)** | **HOÀN THÀNH** | Repository: `https://github.com/Phong-the20/SBA301` |

---

# PHẦN I. BA (3) PHẦN CƠ BẢN (CORE IMPLEMENTATION)

### 1. Backend RESTful API (Spring Boot 3 + SQL Server)
- **Framework & Runtime:** Java 21 LTS, Spring Boot 3.3.4, Hibernate 6, Spring Data JPA.
- **Database:** Microsoft SQL Server 2022 (`localhost:1433`), Database name `SBA301_OrchidDB`, Table `Orchid`.
- **Entity Model (`Orchid.java`):** Ánh xạ bảng `dbo.Orchid`, hỗ trợ các trường: `orchidId` (Identity), `orchidName`, `isNatural` (`natural`), `orchidDescription`, `orchidCategory`, `isAttractive` (`attractive`), `orchidURL`.
- **Controller (`OrchidController.java`):** Ánh xạ base path `/orchids`, cung cấp đầy đủ các endpoint CRUD chuẩn REST:
  - `GET /orchids/`: Lấy danh sách toàn bộ hoa lan (`200 OK`).
  - `GET /orchids/{id}`: Lấy chi tiết 1 hoa lan theo ID (`200 OK` hoặc `404 Not Found`).
  - `POST /orchids/`: Thêm mới hoa lan (`201 Created` hoặc `400 Bad Request`).
  - `PUT /orchids/{id}`: Cập nhật hoa lan (`200 OK` hoặc `404 Not Found`).
  - `DELETE /orchids/{id}`: Xóa hoa lan (`204 No Content` hoặc `404 Not Found`).

### 2. Chuẩn Kiến Trúc MVC 3-Layer Service (Separation of Concerns)
- **`IOrchidRepository.java`**: Thuần túy kế thừa `JpaRepository<Orchid, Integer>`, **tuyệt đối 0 business logic**.
- **`IOrchidService.java` & `OrchidService.java`**: **Chứa 100% nghiệp vụ và validation**:
  - Quản lý giao dịch với `@Transactional`.
  - Validate dữ liệu đầu vào: bắt buộc `orchidName` không được rỗng hay khoảng trắng (`IllegalArgumentException` ➔ trả về `400 Bad Request`).
  - Kiểm tra tồn tại bản ghi bằng `findById()` trước khi Update hoặc Delete (nếu không có ➔ ném ngoại lệ ➔ trả về `404 Not Found`).
  - Áp dụng kỹ thuật Dirty Checking để cập nhật từng trường dữ liệu.

### 3. Frontend Single Page Application (ReactJS + Vite)
- **Công nghệ:** React 19 / 18, Vite, React Router DOM v6, Axios, Bootstrap 5.
- **Base API URL:** Cấu hình qua `.env` (`VITE_API_URL=http://localhost:8080/orchids`) với cơ chế dự phòng tự nhận diện hostname (`window.location.hostname`).
- **Axios Client (`orchidApi.js`):** Đóng gói toàn bộ các cuộc gọi HTTP tập trung.
- **Routing (`App.jsx`):**
  - `/`: Trang danh sách hoa lan (`ListOfOrchids.jsx`).
  - `/orchids/new`: Form thêm mới hoa lan (`EditOrchid.jsx`).
  - `/orchids/:id/edit`: Form cập nhật hoa lan theo ID (`EditOrchid.jsx`).

---

# PHẦN II. PHẦN FIX LỖI & TROUBLESHOOTING WORKSHOP (DIAGNOSE & FIX)

Trong quá trình phát triển bài Lab 05, hệ thống đã ghi nhận và xử lý triệt để 5 trường hợp lỗi phổ biến:

### Case 1: Lỗi `⚠️ Network Error` do chính sách CORS khi truy cập IP mạng LAN
- **Hiện tượng:** Truy cập qua `http://192.168.1.118:5173`, ứng dụng báo `Network Error` và không tải được danh sách.
- **Nguyên nhân:** Backend `CorsConfig.java` ban đầu chỉ cấu hình cố định `localhost:5173`. Trình duyệt gửi `Origin: http://192.168.1.118:5173` bị Spring Boot từ chối với mã `403 Forbidden`.
- **Giải pháp xử lý:** Nâng cấp `CorsConfig.java` dùng `.allowedOriginPatterns("*")`, cho phép truy cập linh hoạt từ localhost, IP LAN và điện thoại di động.

### Case 2: Lỗi không hiển thị hình ảnh đại diện (Hiển thị ảnh bình hoa dự phòng)
- **Hiện tượng:** Người dùng lưu link bài báo `https://thethaovanhoa.vn/...htm` thì ảnh hoa lan lại hiển thị hình bình tưới nước mặc định.
- **Nguyên nhân:** Đuôi `.htm` là trang web tin tức HTML chứ không phải file ảnh trực tiếp (`.jpg`, `.png`). Thẻ `<img>` không thể render trang web nên kích hoạt sự kiện `onError` tải ảnh fallback.
- **Giải pháp xử lý:**
  1. Hướng dẫn lấy link ảnh trực tiếp (`Copy image address` ➔ đuôi `.jpg`).
  2. Bổ sung thuộc tính `referrerPolicy="no-referrer"` trên các thẻ `<img>` để tránh bị chặn hotlinking bởi các trang báo điện tử.

### Case 3: Lỗi SQL Server `Msg 208: Invalid object name 'SBA301_OrchidDB'`
- **Hiện tượng:** Khi chạy `SELECT * FROM SBA301_OrchidDB` trong SSMS thì bị báo lỗi đối tượng không tồn tại.
- **Nguyên nhân:** Nhầm lẫn giữa tên **Database** (`SBA301_OrchidDB`) và tên **Table** (`Orchid`).
- **Giải pháp xử lý:** Đổi câu lệnh thành `SELECT * FROM Orchid;` hoặc `SELECT * FROM dbo.Orchid;`.

### Case 4: Lỗi 415 / Xung đột Jackson Deserialization Boolean Property
- **Hiện tượng:** Gọi POST payload JSON thì Spring Boot báo `Conflicting setter definitions for property "natural"`.
- **Nguyên nhân:** Trong Java Entity định nghĩa đồng thời cả `setNatural(boolean)` và `setIsNatural(boolean)`.
- **Giải pháp xử lý:** Chuẩn hóa Entity dùng `@JsonProperty("natural")` kết hợp `@JsonAlias({"isNatural", "natural"})` và giữ 1 cặp getter/setter duy nhất.

### Case 5: Lỗi Vite hiển thị 3 đường link gây rối khi chạy `npm run dev`
- **Hiện tượng:** Terminal hiện cả Local, WSL và IP LAN Wi-Fi.
- **Nguyên nhân:** Thuộc tính `server.host: true` lắng nghe toàn bộ network interfaces.
- **Giải pháp xử lý:** Tối ưu `vite.config.js` tập trung vào port `5173` chuẩn.

---

# PHẦN III. PHẦN MỞ RỘNG (ADVANCED FEATURES & ENHANCEMENTS)

Nhằm nâng cao trải nghiệm người dùng và đạt điểm số tối đa, dự án đã bổ sung 6 tính năng mở rộng:

1. **Tìm kiếm thời gian thực (Live Search):**
   - Ô tìm kiếm ngay trên đầu trang, hỗ trợ tìm kiếm không phân biệt hoa thường theo cả **Tên hoa lan** và **Mô tả**.
2. **Bộ lọc theo danh mục (Dynamic Category Filter):**
   - Dropdown tự động trích xuất các Category thực tế có trong cơ sở dữ liệu (`Cattleya`, `Dendrobium`, `Phalaenopsis`,...).
3. **Bộ lọc theo trạng thái (Filter by Status):**
   - Checkbox lọc tức thì hoa lan tự nhiên (`Natural`) hoặc hoa lan quyến rũ (`Attractive`).
4. **Sắp xếp linh hoạt (Sorting):**
   - Tùy chọn sắp xếp theo: ID tăng dần, ID giảm dần (mới nhất), Tên A ➔ Z, Tên Z ➔ A.
5. **Modal phóng to xem chi tiết hoa lan (Image & Detail Modal):**
   - Click vào bất kỳ ảnh đại diện hoa lan nào trong bảng sẽ mở Modal lớn, hiển thị ảnh chất lượng cao kèm toàn bộ thông tin chi tiết và nút dẫn thẳng đến trang Edit.
6. **Tối ưu cỡ chữ và giao diện (Scaled-up Typography):**
   - Tăng root font size lên `18px`, ảnh đại diện mở rộng lên `80px x 80px` có hiệu ứng hover zoom, bảng dữ liệu thoáng đãng dễ nhìn.

---

# 🚀 HƯỚNG DẪN CHẠY DỰ ÁN TRÊN MÁY TÍNH

### 1. Chuẩn bị Cơ sở dữ liệu SQL Server
Mở SSMS và chạy file [init-database.sql](./init-database.sql):
```sql
sqlcmd -S localhost -U sa -P 12345 -i "init-database.sql"
```

### 2. Khởi động Backend Spring Boot
```bash
cd backend
java -jar target/chapter15api-1.0.0.jar
# Backend chạy tại: http://localhost:8080/orchids
```

### 3. Khởi động Frontend ReactJS
```bash
cd frontend
npm run dev
# Frontend chạy tại: http://localhost:5173
```

### 4. Chạy Script Kiểm thử Tự động (Automated Test Suite)
```powershell
.\test-runner.ps1
# Kết quả: 10/10 Test Cases PASS
```
