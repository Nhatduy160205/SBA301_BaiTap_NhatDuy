# SBA301 - Slot 09: Fetching & Caching Data Client

Dự án tổng hợp Slot 09 - Data Fetching, In-Memory Caching với TTL, Cancellation bằng AbortController, Microtask Event Loop Trace, và Kiến trúc MVC Layer Service.

## 1. Kiến trúc dự án (MVC Layer Service)

- **Model Layer (`src/models/userModel.js`)**: Định nghĩa khuôn mẫu UserModel và chuẩn hóa thuộc tính (name, username, email, phone, company, city).
- **Service Layer (`src/services/userService.js`)**:
  - `getUsers({ forceRefresh, signal })`: Logic truy xuất dữ liệu thông minh — kiểm tra bộ nhớ đệm (Cache) trước theo TTL 60 giây; nếu còn tươi (fresh) trả về ngay, nếu hết hạn hoặc ép làm mới (forceRefresh) thì gọi Network API. Tự động chuyển về Stale Cache nếu mạng lỗi.
  - `clearCache()`: Xóa bộ nhớ cache.
  - `filterUsers(users, keyword)`: Lọc tức thời danh sách người dùng.
  - `createUser(userData)`: Giả lập POST tạo người dùng và tự động cập nhật cache.
  - `getDiagnostics()`: Thống kê số lần cache hit, network request, tuổi thọ của cache.
- **View / Components (`src/components/`)**:
  - `AppNavbar.jsx`: Điều hướng giữa danh mục người dùng và tab mô phỏng Event Loop.
  - `CacheStatus.jsx`: Bảng điều khiển bộ nhớ đệm (trạng thái TTL, tuổi thọ, nút Force Network, nút Hủy request AbortController).
  - `UserList.jsx`: Thanh tìm kiếm, trạng thái Loading Spinner, Error Alert và lưới UserCard.
  - `UserCard.jsx`: Thẻ hiển thị thông tin người dùng.
  - `AsyncPlayground.jsx`: Phòng thí nghiệm tương tác phân biệt thứ tự thực thi Synchronous → Microtask (Promise) → Macrotask (setTimeout).
  - `CreateUserModal.jsx`: Modal giả lập thêm người dùng mới.
  - `AppFooter.jsx`: Chân trang.

## 2. Hướng dẫn chạy

```bash
cd Slot9
npm install
npm run dev
```
