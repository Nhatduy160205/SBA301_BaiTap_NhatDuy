# HƯỚNG DẪN TEST CASE CHI TIẾT - ASSIGNMENT 02 SBA301
## Đề tài: FUNewsManagementSystem
**Sinh viên thực hiện:** Trần Nhật Duy — **MSSV:** CE190982  
**Môn học:** SBA301 - Java Web Application Services  
**Kiến trúc:** Spring Boot 3 (3-Layer Architecture, Spring Data JPA) + ReactJS (Axios, Modals, Protected Routes) + MS SQL Server

---

## I. HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG

### 1. Chuẩn bị Cơ sở dữ liệu (MS SQL Server)
1. Mở **SQL Server Management Studio (SSMS)**.
2. Mở và thực thi file script tạo CSDL và nạp dữ liệu mẫu:
   [backend/src/main/resources/schema_and_data.sql](file:///d:/SBA301/excersize/SBA301/Assignment02/backend/src/main/resources/schema_and_data.sql)
3. Kiểm tra file cấu hình [application.properties](file:///d:/SBA301/excersize/SBA301/Assignment02/backend/src/main/resources/application.properties):
   - Đảm bảo `spring.datasource.username` (mặc định `sa`) và `spring.datasource.password` (mặc định `123456`) khớp với cấu hình máy của bạn.

---

### 2. Khởi chạy Backend (Spring Boot 3)
Mở Terminal tại thư mục `backend/` và chạy:
```bash
mvn spring-boot:run
```
- Backend sẽ chạy tại: `http://localhost:8080`
- API Base URL: `http://localhost:8080/api`

---

### 3. Khởi chạy Frontend (ReactJS)
Mở Terminal tại thư mục `client/` và chạy:
```bash
npm run dev
```
- Ứng dụng giao diện mở tại: `http://localhost:3000`

---

## II. THÔNG TIN TÀI KHOẢN THỬ NGHIỆM SẴN

| Vai trò | Email đăng nhập | Mật khẩu | Quyền hạn kiểm tra |
| :--- | :--- | :--- | :--- |
| **Admin (Role = 1)** | `admin@funews.edu.vn` | `admin123` | Quản lý toàn bộ tài khoản (CRUD Account, ràng buộc xóa). |
| **Staff (Role = 2)** | `staff@funews.edu.vn` | `staff123` | Quản lý danh mục, tin tức, lịch sử viết tin, hồ sơ cá nhân. |
| **Editor (Role = 2)** | `editor@funews.edu.vn` | `staff123` | Tài khoản phụ dùng kiểm tra tính độc lập của lịch sử bài viết. |

---

## III. BẢNG KỊCH BẢN KIỂM THỬ (TEST CASE SPECIFICATION)

### PHẦN 1: DÀNH CHO KHÁCH (PUBLIC - KHÔNG CẦN ĐĂNG NHẬP)

| Mã TC | Tên Test Case | Các bước thực hiện (Steps) | Dữ liệu kiểm thử | Kết quả mong đợi (Expected Result) | Đánh giá |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Xem danh sách tin tức công khai | 1. Truy cập vào trang chủ `http://localhost:3000`<br>2. Quan sát danh sách bài viết. | Không đăng nhập | - Chỉ hiển thị các bài viết có trạng thái **Active** (`NewsStatus = 1`).<br>- Hiển thị đầy đủ Tiêu đề, Dòng tóm tắt (Headline), Danh mục, Tác giả, Ngày tạo, Thẻ Tags. | [ ] Pass |
| **TC-02** | Xem chi tiết bài viết tin tức | 1. Tại trang chủ, click vào tiêu đề bài viết hoặc nút **"Xem chi tiết"**.<br>2. Chuyển đến màn hình `/news/:id`. | Bài viết ID `NEWS001` | - Hiển thị toàn bộ nội dung bài viết, tác giả, danh mục, nguồn tin, ngày giờ đăng.<br>- Có nút "Quay lại" điều hướng về trang chủ. | [ ] Pass |
| **TC-03** | Tìm kiếm tin tức công khai | 1. Tại trang chủ, nhập từ khóa vào ô tìm kiếm.<br>2. Nhấn nút "Tìm kiếm". | Keyword: `Spring` hoặc `Fullstack` | - Danh sách chỉ hiển thị các bài viết có tiêu đề hoặc nội dung chứa từ khóa tìm kiếm. | [ ] Pass |

---

### PHẦN 2: XÁC THỰC & BẢO MẬT (AUTHENTICATION & AUTHORIZATION)

| Mã TC | Tên Test Case | Các bước thực hiện (Steps) | Dữ liệu kiểm thử | Kết quả mong đợi (Expected Result) | Đánh giá |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-04** | Đăng nhập thất bại (Sai pass) | 1. Truy cập `/login`<br>2. Nhập Email đúng nhưng mật khẩu sai.<br>3. Nhấn "Đăng Nhập". | `admin@funews.edu.vn`<br>Pass: `wrongpass` | - Không đăng nhập được.<br>- Xuất hiện thông báo đỏ: *"Email hoặc mật khẩu không chính xác"*. | [ ] Pass |
| **TC-05** | Đăng nhập thành công với Admin | 1. Nhập tài khoản Admin hoặc click nút **"Demo: Admin"**.<br>2. Nhấn "Đăng Nhập". | `admin@funews.edu.vn`<br>Pass: `admin123` | - Đăng nhập thành công.<br>- Điều hướng tự động về trang `/admin/accounts`.<br>- Thanh Navbar hiển thị menu **"Quản lý Tài Khoản"** và nhãn **"Quản Trị Viên (Admin)"**. | [ ] Pass |
| **TC-06** | Đăng nhập thành công với Staff | 1. Đăng xuất tài khoản cũ.<br>2. Nhập tài khoản Staff hoặc click nút **"Demo: Staff"**.<br>3. Nhấn "Đăng Nhập". | `staff@funews.edu.vn`<br>Pass: `staff123` | - Đăng nhập thành công.<br>- Điều hướng về trang `/staff/news`.<br>- Thanh Navbar hiển thị các menu: **Quản lý Danh Mục, Quản lý Tin Tức, Lịch Sử Viết Tin, Hồ Sơ Cá Nhân**. | [ ] Pass |
| **TC-07** | Kiểm tra phân quyền (RBAC Security) | 1. Đăng nhập bằng tài khoản **Staff**.<br>2. Cố tình nhập URL `/admin/accounts` trên thanh địa chỉ trình duyệt. | URL: `/admin/accounts` | - Hệ thống chặn truy cập.<br>- Hiển thị màn hình cảnh báo: *"Truy cập bị từ chối (403 Forbidden)"*. | [ ] Pass |

---

### PHẦN 3: CHỨC NĂNG ADMIN - QUẢN LÝ TÀI KHOẢN (ROLE = 1)

| Mã TC | Tên Test Case | Các bước thực hiện (Steps) | Dữ liệu kiểm thử | Kết quả mong đợi (Expected Result) | Đánh giá |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-08** | Thêm tài khoản mới qua Popup Modal | 1. Tại `/admin/accounts`, bấm **"+ Thêm Tài Khoản Mới"**.<br>2. Quan sát **Popup Dialog** mở lên.<br>3. Nhập đầy đủ thông tin hợp lệ.<br>4. Nhấn "Tạo Mới". | Họ tên: `Lê Thị B`<br>Email: `lethib@funews.edu.vn`<br>Role: `2 - Staff`<br>Pass: `123456` | - Popup đóng lại sau khi lưu thành công.<br>- Danh sách tự reload hiển thị tài khoản mới thêm.<br>- Xuất hiện Toast xanh thông báo thành công. | [ ] Pass |
| **TC-09** | Validate form tạo tài khoản | 1. Mở popup thêm tài khoản.<br>2. Để trống các trường hoặc nhập sai định dạng Email.<br>3. Bấm "Tạo Mới". | Email: `abc` (sai email) | - Form chặn gửi đi, hiển thị các dòng thông báo lỗi đỏ ngay dưới từng ô nhập liệu. | [ ] Pass |
| **TC-10** | Cập nhật tài khoản qua Popup Modal | 1. Click icon Edit (Cây bút) tại tài khoản vừa tạo.<br>2. Popup mở lên nạp sẵn thông tin cũ.<br>3. Đổi tên thành: `Lê Thị B Cập Nhật`.<br>4. Nhấn "Cập Nhật". | Tên: `Lê Thị B Cập Nhật` | - Thông tin được cập nhật tức thì trên bảng dữ liệu. | [ ] Pass |
| **TC-11** | **RÀNG BUỘC XÓA 1: Xóa Account ĐÃ TẠO BÀI VIẾT (Bắt buộc kiểm tra)** | 1. Tìm tài khoản `Nhân Viên Trần Nhật Duy` (`staff@funews.edu.vn` - đã tạo bài `NEWS001`).<br>2. Click nút Xóa (Thùng rác).<br>3. Quan sát **Confirmation Modal** hiện lên.<br>4. Bấm "Xác nhận xóa". | Account ID: `2` (`staff@funews.edu.vn`) | - **Backend chặn xóa và quăng BusinessException**.<br>- Popup đóng và hiển thị thông báo lỗi màu đỏ rõ ràng: *"Không thể xóa tài khoản này! Tài khoản đã từng tạo bài viết tin tức trong hệ thống."*<br>- Dữ liệu không bị xóa. | [ ] Pass |
| **TC-12** | Xóa Account CHƯA TẠO BÀI VIẾT | 1. Tìm tài khoản `Lê Thị B Cập Nhật` (vừa tạo ở TC-08, chưa viết bài nào).<br>2. Bấm nút Xóa $\rightarrow$ Hộp thoại Confirm hiện lên.<br>3. Bấm "Xác nhận xóa". | Tài khoản chưa có bài viết | - Xóa thành công, tài khoản biến mất khỏi bảng danh sách.<br>- Thông báo màu xanh: *"Xóa tài khoản thành công!"*. | [ ] Pass |
| **TC-13** | Tìm kiếm tài khoản | 1. Nhập từ khóa vào ô tìm kiếm tài khoản.<br>2. Nhấn "Tìm Kiếm". | Keyword: `admin` hoặc `Duy` | - Bảng chỉ hiển thị các tài khoản thỏa mãn từ khóa. | [ ] Pass |

---

### PHẦN 4: CHỨC NĂNG STAFF - QUẢN LÝ DANH MỤC (ROLE = 2)

| Mã TC | Tên Test Case | Các bước thực hiện (Steps) | Dữ liệu kiểm thử | Kết quả mong đợi (Expected Result) | Đánh giá |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-14** | Thêm danh mục qua Popup Modal | 1. Đăng nhập Staff, vào `/staff/categories`.<br>2. Bấm **"+ Thêm Danh Mục Mới"**.<br>3. Điền tên danh mục, mô tả, chọn danh mục cha.<br>4. Bấm "Tạo Mới". | Tên: `Khoa Học Vũ Trụ`<br>Mô tả: `Khám phá thiên văn` | - Popup mở và đóng đúng chuẩn.<br>- Danh mục mới xuất hiện trong bảng. | [ ] Pass |
| **TC-15** | Sửa danh mục qua Popup Modal | 1. Click icon Edit tại danh mục vừa tạo.<br>2. Đổi tên và trạng thái Active/Inactive.<br>3. Bấm "Cập Nhật". | Đổi tên: `Khoa Học & Không Gian` | - Cập nhật thành công, trạng thái hiển thị đúng màu badge. | [ ] Pass |
| **TC-16** | **RÀNG BUỘC XÓA 2: Xóa Danh Mục ĐANG CHỨA BÀI VIẾT (Bắt buộc kiểm tra)** | 1. Tìm danh mục `Công Nghệ` (đang chứa bài viết `NEWS001`).<br>2. Click nút Xóa $\rightarrow$ Xác nhận trên Popup Confirm.<br>3. Bấm "Xác nhận xóa". | Danh mục `Công Nghệ` (ID: 1) | - **Hệ thống chặn xóa**.<br>- Hiển thị thông báo lỗi màu đỏ: *"Không thể xóa danh mục này! Đang có bài viết tin tức thuộc danh mục này."*<br>- Danh mục không bị mất. | [ ] Pass |
| **TC-17** | Xóa Danh Mục RỖNG (Không chứa bài viết) | 1. Tìm danh mục `Khoa Học & Không Gian` (vừa tạo ở TC-14, chưa gán bài nào).<br>2. Bấm nút Xóa $\rightarrow$ Xác nhận trên Popup Confirm. | Danh mục rỗng | - Xóa thành công khỏi cơ sở dữ liệu.<br>- Thông báo xanh: *"Xóa danh mục thành công!"*. | [ ] Pass |

---

### PHẦN 5: CHỨC NĂNG STAFF - QUẢN LÝ BÀI VIẾT & TAGS (ROLE = 2)

| Mã TC | Tên Test Case | Các bước thực hiện (Steps) | Dữ liệu kiểm thử | Kết quả mong đợi (Expected Result) | Đánh giá |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-18** | Thêm bài viết mới có chọn Tags qua Popup | 1. Vào `/staff/news`, bấm **"+ Thêm Bài Viết Mới"**.<br>2. Điền Tiêu đề, Headline, Nội dung, chọn Danh mục.<br>3. Click chọn các thẻ nhãn Tags (VD: `#Spring Boot`, `#ReactJS`).<br>4. Nhấn "Xuất Bản Bài Viết". | Tiêu đề: `Bài viết kiểm thử số 2`<br>Nội dung: `Nội dung chi tiết...`<br>Tags: chọn 2 tags | - Popup lưu thành công.<br>- Bài viết hiển thị trên danh sách kèm các badge tag vừa chọn. | [ ] Pass |
| **TC-19** | Cập nhật bài viết & sửa Tags qua Popup | 1. Click nút Sửa tại bài viết vừa tạo.<br>2. Sửa tiêu đề, bỏ bớt 1 tag và chọn thêm 1 tag khác.<br>3. Nhấn "Cập Nhật Bài Viết". | Thay đổi tags | - Quan hệ bảng trung gian `NewsTag` được cập nhật chính xác. | [ ] Pass |
| **TC-20** | Xóa bài viết tin tức | 1. Click nút Xóa tại bài viết vừa tạo.<br>2. Popup Confirm hỏi xác nhận.<br>3. Nhấn "Xác nhận xóa". | Bài viết vừa tạo | - Xóa thành công bài viết và tự động cascade xóa liên kết trong `NewsTag`. | [ ] Pass |
| **TC-21** | Xem Lịch sử viết tin (News History) | 1. Click menu **"Lịch Sử Viết Tin"** (`/staff/history`).<br>2. Quan sát danh sách. | Đăng nhập tài khoản `staff@funews.edu.vn` | - **Chỉ hiển thị các bài viết do tài khoản này tạo** (`CreatedByID = 2`).<br>- Không hiển thị bài viết của tài khoản khác. | [ ] Pass |
| **TC-22** | Quản lý Hồ sơ cá nhân (Profile) | 1. Click menu **"Hồ Sơ Cá Nhân"** (`/staff/profile`).<br>2. Đổi tên hiển thị thành `Trần Nhật Duy (Updated)`.<br>3. Thử đổi mật khẩu mới.<br>4. Bấm "Lưu Thay Đổi". | Mật khẩu cũ: `staff123`<br>Mật khẩu mới: `newpass123` | - Lưu thành công, tên hiển thị trên góc Navbar lập tức cập nhật theo.<br>- Đăng xuất và đăng nhập lại bằng mật khẩu mới thành công. | [ ] Pass |

---

## IV. BẢN TỔNG KẾT ĐÁNH GIÁ TIÊU CHÍ ĐỀ BÀI (CHECKLIST)

- [x] **Spring Boot 3 + MS SQL Server + Spring Data JPA** theo kiến trúc 3-Layer.
- [x] **React Client + Axios** tương tác toàn bộ các HTTP Requests.
- [x] **Popup Dialog (Modal)** bắt buộc cho Tạo (Create) và Sửa (Update).
- [x] **Confirmation Dialog** bắt buộc trước khi thực hiện Xóa (Delete).
- [x] **Ràng buộc xóa Account**: Chặn xóa tài khoản đã tạo bài viết.
- [x] **Ràng buộc xóa Category**: Chặn xóa danh mục đang có bài viết.
- [x] **Phân quyền Role**: Khách xem tin Active, Admin (Role 1) quản lý Account, Staff (Role 2) quản lý Category, News, Tags, History, Profile.
- [x] **Author Header**: Tất cả các file mã nguồn đều có thông tin tác giả: `Trần Nhật Duy - MSSV: CE190982`.

