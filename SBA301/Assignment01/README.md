# SBA301 - ASSIGNMENT 01: FUNewsManagementSystem

> **Học phần:** SBA301 – Integrate Single Page Application with Spring Boot  
> **Sinh viên thực hiện:** Phong-the20 (PhongTT - CE190157)  
> **Project:** `Assignment01` (StudentName_ClassCode: `PhongTT_CE190157_SBA301`)  
> **Công nghệ:** ReactJS 19 + Vite 8 + React Router DOM 7 + Bootstrap 5.3 + Bootstrap Icons  

---

## 📌 1. TỔNG QUAN HỆ THỐNG (PROBLEM UNDERSTANDING)

**FUNewsManagementSystem** là hệ sinh thái web quản trị tin tức toàn diện cho Đại học FPT, triển khai kiến trúc Single Page Application (SPA). Hệ thống cung cấp bảng điều khiển trung tâm và các module quản lý phân hệ:
1. **Xác thực & Phân quyền (Authentication & Authorization):**
   - Đăng nhập xác thực mock credentials (`Admin` / `Admin`, `staff` / `staff123`).
   - Phân quyền 2 cấp độ: **Admin (Role = 1)** và **Staff (Role = 2)**.
   - Bảo vệ route (`ProtectedRoute`, `AdminRoute`) không cho phép người dùng chưa đăng nhập hoặc Staff truy cập các phân hệ độc quyền của Admin.
2. **Dashboard Tổng Quan:**
   - Thống kê thời gian thực số lượng Tin tức (Xuất bản / Bản nháp), Chuyên mục, Tài khoản người dùng.
   - Biểu đồ tỷ lệ phân bố bài viết theo danh mục.
   - Danh sách bài viết tin tức mới nhất kèm tính năng xem nhanh chi tiết.
3. **Quản lý Chuyên mục (Category Management):**
   - Đầy đủ tính năng **CRUD** (Create, Read, Update, Delete) + **Search** + **Filter Status**.
   - Create và Update thực hiện qua Popup Modal Dialog chuyên nghiệp có nút Reset làm lại form.
   - Xóa có Confirm Modal Dialog và **ràng buộc toàn vẹn dữ liệu** (Không cho phép xóa chuyên mục đang có bài viết tham chiếu).
4. **Quản lý Tin tức & Bài viết (News Management):**
   - Đầy đủ **CRUD** + **Search** (theo tiêu đề, nội dung, thẻ tags) + **Lọc theo chuyên mục** + **Lọc theo trạng thái**.
   - Popup Modal Soạn thảo / Cập nhật bài viết với liên kết `categoryId`, tác giả `createdBy`, trạng thái xuất bản, danh sách thẻ tags.
   - Modal xem chi tiết bài viết (News Detail Modal).
   - Xác nhận xóa bằng Confirm Modal.
5. **Quản lý Tài khoản (User/Account Management):**
   - Đầy đủ **CRUD** + **Search** (username, họ tên, email) + **Lọc theo vai trò** (Admin/Staff) + **Lọc trạng thái**.
   - Validation định dạng email chuẩn Regex, kiểm tra trùng lặp username khi tạo mới.
   - Cơ chế an toàn hệ thống: Không cho phép xóa Super Admin (ID 1) hoặc tự xóa tài khoản đang đăng nhập.
6. **Cài đặt Hệ thống & Tùy biến (Settings):**
   - Quản lý và cập nhật hồ sơ người dùng (Full Name, Email).
   - Tùy chọn giao diện **Dark Mode / Light Mode** với cơ chế lưu vĩnh viễn (Persistent Preference) vào LocalStorage.
   - Nút khôi phục dữ liệu ban đầu (Reset Mock Database) giúp giảng viên và sinh viên kiểm thử nhanh chóng.

---

## 🚀 2. HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY ỨNG DỤNG (SETUP & RUN)

### Yêu cầu môi trường:
- Node.js: `v18.x` trở lên (Khuyến nghị `v20+` hoặc `v24+`)
- npm: `v9.x` trở lên

### Các bước khởi chạy:
```bash
# 1. Di chuyển vào thư mục Assignment01
cd D:\Data\Documents\HSF302\LAB-SBA301\Assignment01

# 2. Cài đặt các gói phụ thuộc (Dependencies)
npm install

# 3. Khởi chạy Development Server
npm run dev

# 4. Mở trình duyệt tại địa chỉ hiển thị trong terminal (Mặc định: http://localhost:5173/)
```

### Các lệnh hữu ích khác:
- `npm run build`: Biên dịch mã nguồn thành gói tối ưu hóa cho Production tại thư mục `dist/`.
- `npm run preview`: Chạy thử bản build production trên máy cục bộ.

---

## 🔑 3. TÀI KHOẢN TRUY CẬP KIỂM THỬ (TEST CREDENTIALS)

Tại màn hình đăng nhập, hệ thống đã trang bị sẵn **2 nút bấm tự động điền tài khoản (1-Click Fill)** giúp người đánh giá kiểm tra nhanh:

| Tài khoản | Username | Mật khẩu | Vai trò (Role) | Quyền hạn trong hệ thống |
| :--- | :--- | :--- | :---: | :--- |
| **Quản trị viên (Super Admin)** | `Admin` | `Admin` | `1` | Toàn quyền truy cập Dashboard, Chuyên mục, Tin tức, Tài khoản, Cài đặt. |
| **Nhân viên (Staff)** | `staff` | `staff123` | `2` | Truy cập Dashboard, Chuyên mục, Tin tức, Cài đặt. Menu Tài khoản tự động ẩn theo phân quyền. |

---

## 🏗️ 4. KIẾN TRÚC MÃ NGUỒN (COMPONENT TREE & FOLDER STRUCTURE)

```
Assignment01/
├── public/
│   └── assets/
│       └── logo.jpg               # Logo FUNews tạo bằng AI
├── src/
│   ├── assets/
│   │   └── logo.jpg               # Asset logo thương hiệu
│   ├── components/
│   │   ├── common/
│   │   │   ├── ConfirmModal.jsx   # Dialog xác nhận thao tác xóa
│   │   │   ├── EmptyState.jsx     # Giao diện khi danh sách rỗng / không tìm thấy kết quả
│   │   │   └── ToastNotification.jsx # Thông báo Toast nổi góc màn hình
│   │   ├── layout/
│   │   │   ├── Header.jsx         # Header chứa AI logo, User badge, Theme toggle, Logout
│   │   │   ├── Sidebar.jsx        # Menu điều hướng đa phân hệ có phân quyền hiển thị
│   │   │   └── AdminLayout.jsx    # Master Layout lồng ghép bảo vệ router Outlet
│   │   ├── categories/
│   │   │   ├── CategoryModal.jsx  # Modal popup Create/Update chuyên mục + nút Reset
│   │   │   └── CategoryTable.jsx  # Bảng hiển thị chuyên mục kèm số lượng bài viết
│   │   ├── news/
│   │   │   ├── NewsModal.jsx      # Modal popup Soạn thảo/Sửa bài viết + nút Reset
│   │   │   ├── NewsDetailModal.jsx # Modal xem toàn bộ nội dung bài viết
│   │   │   └── NewsTable.jsx      # Bảng tin tức kèm badge trạng thái, thẻ tags
│   │   └── users/
│   │       ├── UserModal.jsx      # Modal popup Tạo/Sửa tài khoản + kiểm tra email + Reset
│   │       └── UserTable.jsx      # Bảng người dùng phân biệt Admin/Staff
│   ├── context/
│   │   ├── AuthContext.jsx        # Quản lý phiên đăng nhập, currentUser, role, sync storage
│   │   └── ThemeContext.jsx       # Quản lý chế độ sáng/tối (Light/Dark mode)
│   ├── data/
│   │   ├── initialCategories.js   # 5 chuyên mục mẫu ban đầu
│   │   ├── initialNews.js         # 5 bài viết tin tức mẫu ban đầu
│   │   └── initialUsers.js        # 4 tài khoản mẫu ban đầu (Admin, Staff,...)
│   ├── services/
│   │   ├── storageService.js      # Tầng tương tác LocalStorage, hydrate, reset
│   │   ├── categoryService.js     # Nghiệp vụ chuyên mục + ràng buộc với bài viết
│   │   ├── newsService.js         # Nghiệp vụ tin tức + search đa trường
│   │   └── userService.js         # Nghiệp vụ người dùng + xác thực + bảo vệ Super Admin
│   ├── pages/
│   │   ├── LoginPage.jsx          # Trang đăng nhập controlled inputs, validation
│   │   ├── DashboardPage.jsx      # Trang thống kê, biểu đồ phân bố, tin mới nhất
│   │   ├── CategoryManagementPage.jsx # Quản lý Chuyên mục CRUD + Search
│   │   ├── NewsManagementPage.jsx # Quản lý Tin tức CRUD + Search + Detail view
│   │   ├── UserManagementPage.jsx # Quản lý Tài khoản CRUD + Search + Email check
│   │   ├── SettingsPage.jsx       # Cài đặt Profile, Dark Mode, Khôi phục Database
│   │   └── NotFoundPage.jsx       # Trang 404 Not Found
│   ├── styles/
│   │   └── app.css                # Hệ thống CSS Design tokens, gradients, hiệu ứng kính
│   ├── App.jsx                    # Cấu hình React Router DOM với ProtectedRoute
│   └── main.jsx                   # Entry point React 19
├── index.html                     # HTML5 template với SEO Meta Tags
└── package.json                   # Cấu hình dự án Vite và dependencies
```

---

## 💡 5. BẢNG GHI QUYẾT ĐỊNH THIẾT KẾ (DESIGN DECISION RECORD - DDR)

| Quyết định kỹ thuật | Lựa chọn triển khai | Lý do lựa chọn | Ảnh hưởng nếu thay đổi yêu cầu |
| :--- | :--- | :--- | :--- |
| **1. Navigation** | `react-router-dom` (v7 / API v6) | Hỗ trợ URL định tuyến SPA rõ ràng (`/dashboard`, `/categories`, `/news`, `/users`), hỗ trợ deep link, back/forward history trên trình duyệt và Route Guard. | Nếu đổi sang State Navigation chỉ cần thay `App.jsx` bằng switch-case render component theo state `activeTab`. |
| **2. State Ownership** | Tách 3 cấp: Local State (Modal/Form/Errors), Shared State (Context: Auth, Theme), Persistent State (Storage Service: Categories, News, Users). | Đảm bảo tính đóng gói (Encapsulation), tránh re-render toàn cây DOM không cần thiết, cô lập lỗi trong phạm vi từng component. | Dễ dàng di dời State lên Context hoặc Redux nếu hệ thống mở rộng đa cấp độ. |
| **3. Mock Data Persistence** | LocalStorage kết hợp Hydrate Pattern qua `storageService.js`. | Giữ nguyên dữ liệu sau khi F5/Reload trang mà không phụ thuộc vào Database server bên ngoài, đáp ứng đúng yêu cầu Assignment 01. | Khi tích hợp Spring Boot (Slot 12-16), chỉ cần thay thế phần body của các hàm trong `categoryService`, `newsService` bằng lệnh gọi `fetch()` / `axios`. |
| **4. CRUD Dialog Reuse** | Dùng chung một Component Modal cho cả Create và Update (`CategoryModal`, `NewsModal`, `UserModal`) với cờ `mode = "create" \| "update"`. | Tái sử dụng tối đa cấu trúc giao diện form, đồng bộ validation rules, giảm 50% số dòng code bị trùng lặp. | Khi cần giao diện tạo mới khác biệt hoàn toàn, chỉ cần tách 2 modal riêng biệt mà không ảnh hưởng tầng service. |
| **5. Search Strategy** | Lọc dữ liệu trên bản sao trong bộ nhớ (`displayedList = search(sourceList, keyword)`), giữ nguyên mảng gốc `sourceList`. | Không làm mất dữ liệu gốc khi người dùng xóa từ khóa tìm kiếm (Clear search); hỗ trợ normalize chuỗi (`trim()`, `toLowerCase()`). | Khi chuyển sang Server-side Search qua API Spring Boot, chỉ cần gọi query params `?q=...&category=...`. |
| **6. Folder Structure** | Tổ chức theo cấu trúc Layer kết hợp Feature-based (`components/`, `context/`, `data/`, `pages/`, `services/`, `styles/`). | Tuân thủ nguyên lý Single Responsibility Principle (SRP) và mô hình MVC Layer Service đã học từ Slot 10. | Cấu trúc module hóa cao giúp các lập trình viên làm việc song song mà không bị xung đột mã nguồn. |

---

## 🛠️ 6. NHẬT KÝ XỬ LÝ LỖI (DEBUG LOG)

### 🐞 Lỗi 1: Đường dẫn tương đối import tại các trang `src/pages`
- **Triệu chứng:** Khi chạy `npm run build`, Rollup báo lỗi `UNRESOLVED_IMPORT: Could not resolve '../../services/categoryService' in src/pages/CategoryManagementPage.jsx`.
- **Giả thuyết:** Cấu trúc thư mục được thiết kế là `src/pages/`, do đó từ file page muốn trỏ vào `src/services/` chỉ cần lùi một cấp `../services`, việc dùng `../../` dẫn đến tìm kiếm ngoài thư mục `src`.
- **Nơi kiểm tra:** Dòng 2-8 trong `src/pages/CategoryManagementPage.jsx`, `NewsManagementPage.jsx`, `UserManagementPage.jsx`.
- **Root cause:** Thói quen viết đường dẫn lùi 2 cấp khi copy cấu trúc lồng nhau.
- **Cách sửa:** Sửa toàn bộ `../../services/` và `../../components/` thành `../services/` và `../components/`.
- **Retest:** Chạy lại `npm run build` -> Biên dịch thành công 100% trong 325ms!

### 🐞 Lỗi 2: Trùng lặp username và xóa nhầm tài khoản Quản trị viên tối cao
- **Triệu chứng:** Trong quá trình test tạo người dùng, nếu nhập trùng username có sẵn thì dữ liệu cũ bị ghi đè không mong muốn, hoặc vô tình bấm xóa Super Admin (id = 1).
- **Giả thuyết:** Cần bổ sung quy tắc nghiệp vụ (Business validation) tại `userService.js`.
- **Root cause:** Thiếu bước kiểm tra tính duy nhất (`Array.prototype.some`) và điều kiện chặn thao tác nguy hiểm.
- **Cách sửa:** Thêm kiểm tra `usernameTaken` trong `userService.create` và `userService.update`. Thêm điều kiện `numId === 1` chặn xóa Super Admin, chặn xóa tài khoản đang đăng nhập.
- **Retest:** Thử tạo user có tên `Admin` -> Báo lỗi "Tên đăng nhập đã tồn tại trong hệ thống!". Bấm xóa tài khoản Super Admin -> Nút xóa bị vô hiệu hóa (disabled).

### 🐞 Lỗi 3: Dữ liệu form trong Modal không làm mới khi chuyển giữa Create và Edit
- **Triệu chứng:** Khi bấm Edit một bản ghi rồi đóng modal, sau đó bấm nút Create bài viết mới thì các trường form vẫn chứa dữ liệu của bản ghi vừa sửa.
- **Giả thuyết:** State `formData` bên trong Modal không được đồng bộ theo `show` và `mode`.
- **Root cause:** `useEffect` thiếu dependency `show` hoặc không reset dữ liệu về rỗng khi `mode === "create"`.
- **Cách sửa:** Trong `useEffect` của `CategoryModal`, `NewsModal`, `UserModal`, kiểm tra nếu `mode === "create"` thì gán `formData` về giá trị mặc định ban đầu và xóa sạch `errors`.
- **Retest:** Mở Edit chuyên mục #1 -> Đóng -> Bấm Thêm chuyên mục mới -> Form sạch 100%, sẵn sàng nhập dữ liệu mới!

---

## 🤖 7. NHẬT KÝ SỬ DỤNG AI CÓ KIỂM SOÁT (AI USAGE LOG)

| # | Prompt / Yêu cầu đặt ra cho AI | Mục đích sử dụng | Gợi ý của AI | Cách sinh viên kiểm chứng | Phần sinh viên đã tự tinh chỉnh / sửa đổi |
| :-: | :--- | :--- | :--- | :--- | :--- |
| **1** | "Tạo logo thương hiệu FUNewsManagementSystem vector hiện đại, chữ FN kết hợp biểu tượng tin tức báo chí số" | Sinh asset logo cho Requirement R04 theo đúng quy định rubric. | Sinh hình ảnh logo nghệ thuật chữ FN màu xanh neon gradient công nghệ. | Kiểm tra kích thước file, đặt vào thư mục `public/assets/logo.jpg` và `src/assets/logo.jpg`, kiểm tra hiển thị trên Header và Login card. | Tinh chỉnh CSS Header để bo góc tròn 8px, hiệu ứng đổ bóng mượt và hover zoom nhẹ 1.05x. |
| **2** | "Gợi ý cấu trúc Component Tree và State Ownership Map cho ứng dụng tin tức SPA" | Thiết kế kiến trúc giải pháp đạt điểm tối đa tiêu chí Solution Design (1.5 điểm). | Đề xuất tách `AuthContext`, `storageService`, và phân chia rõ local UI state vs shared state. | Đối chiếu với sơ đồ đề bài trong PDF mục 3.1 & 3.2. | Trực tiếp hiện thực hóa bằng React Router DOM v7, thêm bộ dữ liệu mẫu chi tiết mang bản sắc sinh viên Đại học FPT. |
| **3** | "Liệt kê các trường hợp kiểm thử biên (Edge Cases) cho bài tập SPA CRUD React" | Chuẩn bị bộ Test Matrix đầy đủ 35 test cases theo mục 5.1 của tài liệu. | Gợi ý các test case: nhập khoảng trắng, tìm kiếm phân biệt hoa thường, xóa bản ghi có quan hệ khóa ngoại. | Tiến hành chạy tay và tự động kiểm thử từng case trên giao diện thực tế. | Tự thiết kế modal cảnh báo chặn xóa chuyên mục khi có bài viết ràng buộc, thêm nút Reset form trong modal. |

---

## 🎓 8. BỘ CÂU HỎI VÀ TRẢ LỜI PHỎNG VẤN (INTERVIEW DEFENSE)

### Khung trả lời 5 tầng (5-Layer Explanation Framework):
1. **Purpose:** Component/file này đảm nhận trách nhiệm gì trong kiến trúc SPA?
2. **Input:** Nhận những Props, State hoặc Data từ tầng Service/Context nào đi vào?
3. **Trigger:** Event (onClick, onChange, onSubmit) hoặc Hook (`useEffect`, router) nào kích hoạt?
4. **Transform:** Logic nào thực hiện validate, lọc (filter), hoặc cập nhật bất biến (immutable update)?
5. **Output:** State nào thay đổi, React Virtual DOM render lại phần nào trên giao diện?

---
*Chúc các bạn hoàn thành xuất sắc Assignment 01 môn SBA301!*
