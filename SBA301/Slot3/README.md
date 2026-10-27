# SBA301 - Slot 03: Orchid Explorer Dashboard

Dự án thực hành tổng hợp Slot 03 - React Component Architecture, Decomposition, Composition, React-Bootstrap và Kiến trúc MVC Layer Service.

## 1. Kiến trúc dự án (MVC Layer Service)

- **Model Layer (`src/data/orchids.js`)**: Danh sách mẫu 6 loài hoa lan và hướng dẫn chăm sóc.
- **Service Layer (`src/services/orchidService.js`)**: Đảm nhiệm toàn bộ logic xử lý nghiệp vụ:
  - `getAllOrchids()`: Trả về danh sách hoa lan.
  - `getQuickStats()`: Tính toán chỉ số thống kê tổng thể (tổng số loài, số loài đặc biệt, số chi/danh mục, điểm đánh giá trung bình).
  - `getOrchidsByCategory(category)`: Lọc hoa lan theo danh mục.
  - `getOrchidById(id)`: Tìm hoa lan theo ID và xử lý lỗi validation nếu không tìm thấy.
  - `getCareTips()`: Cung cấp danh sách mẹo chăm sóc hoa lan.
- **View / Components (`src/components/`)**:
  - `AppNavbar.jsx`: Thanh điều hướng responsive.
  - `HeroSection.jsx`: Banner giới thiệu phong cách botanical.
  - `QuickStats.jsx`: Thẻ hiển thị chỉ số tính toán từ Service.
  - `OrchidGallery.jsx`: Bộ sưu tập hiển thị dạng card responsive (Grid System).
  - `CareTips.jsx`: Accordion mẹo chăm sóc.
  - `LearningAlert.jsx`: Thông báo kiến trúc Component.
  - `AppFooter.jsx`: Chân trang.
- **Controller / Entry (`src/App.jsx`, `src/main.jsx`)**: Điều phối kết nối các component giao diện.

## 2. Hướng dẫn chạy

```bash
cd Slot3
npm install
npm run dev
```
