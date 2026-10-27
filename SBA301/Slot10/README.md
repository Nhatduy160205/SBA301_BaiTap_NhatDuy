# SBA301 - Slot 10: React Router SPA & Lab 02 Bridge

Dự án tổng hợp Slot 10 - React Router Single Page Application, Nested Routes, Query Parameters, Dynamic Routing (`:id`), Lab 02 Modal Bridge, và Kiến trúc MVC Layer Service.

## 1. Kiến trúc dự án (MVC Layer Service)

- **Model Layer (`src/data/orchids.js`)**: Dữ liệu chuẩn về 6 loài hoa lan có hình ảnh và thuộc tính botanical.
- **Service Layer (`src/services/orchidService.js`)**: Cung cấp toàn bộ nghiệp vụ:
  - `getAllOrchids()`: Danh sách hoa lan.
  - `getSpecialOrchids()`: Lọc các giống lan đặc biệt.
  - `getOrchidById(id)`: Lấy chi tiết kèm kiểm tra ngoại lệ.
  - `filterOrchids(list, options)`: Lọc kết hợp query parameters (`?category=...&q=...&special=true`).
  - `getStats()`: Tổng hợp số lượng và điểm đánh giá.
  - `getFavorites()`, `toggleFavorite(id)`: Đồng bộ hóa danh sách yêu thích với localStorage.
- **Layouts (`src/layouts/`)**:
  - `MainLayout.jsx`: Layout chuẩn của ứng dụng chứa `AppNavbar`, vùng render route con qua `<Outlet />`, và `AppFooter`.
  - `DashboardLayout.jsx`: Nested layout có thanh Sidebar phụ điều hướng giữa Tổng quan, Yêu thích và Hồ sơ sinh viên.
- **Pages / Views (`src/pages/`)**:
  - `HomePage.jsx`: Trang chủ với banner và danh sách các loài lan đặc biệt.
  - `OrchidsPage.jsx`: Thư mục trưng bày hoa lan với thanh lọc liên kết URL Query Parameters (`useSearchParams`).
  - `OrchidDetailPage.jsx`: Trang chi tiết từng loài lan dạng Dynamic Route segment (`/orchids/:id`) sử dụng `useParams` và `useNavigate`.
  - `AboutPage.jsx`: Thuyết minh về kiến trúc cầu nối Lab 02 Bridge.
  - `ContactPage.jsx`: Trang liên hệ tương tác.
  - `DashboardHome.jsx`: Thống kê tổng quan dạng Dashboard.
  - `FavoritesPage.jsx`: Danh sách hoa lan yêu thích của người dùng.
  - `ProfilePage.jsx`: Hồ sơ sinh viên và thông tin môn học SBA301.
  - `NotFoundPage.jsx`: Trang 404 cho các đường dẫn không xác định.
- **Components (`src/components/`)**:
  - `AppNavbar.jsx`: Menu điều hướng chính kèm huy hiệu đếm lượt yêu thích.
  - `OrchidCard.jsx`: Thẻ hiển thị hoa lan hỗ trợ cả 2 hành vi: xem nhanh qua Modal (Lab 02) và điều hướng sang trang chi tiết (Slot 10).
  - `OrchidModal.jsx`: Modal Quick View popup kế thừa từ Lab 02.
  - `AppFooter.jsx`: Chân trang.

## 2. Hướng dẫn chạy

```bash
cd Slot10
npm install
npm run dev
```
