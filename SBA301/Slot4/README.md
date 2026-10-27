# SBA301 - Slot 04: Interactive Orchid Explorer

Dự án thực hành Slot 04 - Props, State, React Hooks (useState, useContext), Event-Driven UI và Kiến trúc MVC Layer Service.

## 1. Kiến trúc dự án (MVC Layer Service)

- **Model Layer (`src/data/orchids.js`)**: Danh mục 6 loài hoa lan chi tiết (tên, loài, xuất xứ, màu sắc, rating, trạng thái đặc biệt).
- **Service Layer (`src/services/orchidService.js`)**: Toàn bộ nghiệp vụ lọc, tìm kiếm, sắp xếp và tính toán:
  - `getInitialOrchids()`: Cung cấp danh sách ban đầu.
  - `filterOrchids(list, options)`: Lọc kết hợp đa tiêu chí: keyword tìm kiếm, danh mục, trạng thái đặc biệt (special only), sắp xếp rating/tên.
  - `getCategories(list)`: Trích xuất danh mục động.
  - `toggleFavorite(favoritesSet, orchidId)`: Quản lý trạng thái yêu thích.
  - `getOrchidById(id)`: Lấy chi tiết có validation.
  - `calculateExplorerStats(filteredList, favoritesSet)`: Tính toán số lượng hiển thị, số lượng yêu thích, số lượng hoa đặc biệt.
- **Context / Controller Layer (`src/context/OrchidContext.jsx`)**: Kết nối State của React với Service Layer, cung cấp dữ liệu và dispatch handlers cho toàn bộ cây component.
- **View / Component Layer (`src/components/`)**:
  - `AppNavbar.jsx`: Navbar hiển thị huy hiệu thống kê yêu thích trực quan.
  - `HeroSection.jsx`: Banner chào mừng.
  - `OrchidExplorer.jsx`: Khối điều khiển tìm kiếm, lọc danh mục, sắp xếp và lưới OrchidCard.
  - `OrchidCard.jsx`: Hiển thị từng đóa hoa với nút toggle yêu thích và nút xem chi tiết.
  - `OrchidModal.jsx`: Modal popup hiển thị đầy đủ thông số kỹ thuật của từng cá thể lan.
  - `AppFooter.jsx`: Chân trang.

## 2. Hướng dẫn chạy

```bash
cd Slot4
npm install
npm run dev
```
