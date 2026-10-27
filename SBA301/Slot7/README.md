# SBA301 - Slot 07: Campus Event Navigator

Dự án tổng hợp Slot 07 - React Router & Navigation: Client-Side Routing, Route Trees, Dynamic Route Parameter `:id`, useParams, useNavigate, NotFound 404, và Kiến trúc MVC Layer Service.

## 1. Kiến trúc dự án (MVC Layer Service)

- **Model Layer (`src/data/events.js`)**: Danh sách 8 sự kiện campus với thông tin chi tiết (thời gian, địa điểm, diễn giả, số ghế, ảnh, mô tả).
- **Service Layer (`src/services/eventService.js`)**: Xử lý logic dữ liệu và hỗ trợ route:
  - `getAllEvents()`: Lấy danh sách tất cả sự kiện.
  - `getFeaturedEvents()`: Lấy sự kiện nổi bật hiển thị ở trang chủ.
  - `getEventById(id)`: Lấy chi tiết sự kiện theo ID; ném lỗi khi không tìm thấy để View hiển thị Not Found.
  - `filterEvents(list, options)`: Lọc theo danh mục và từ khóa tìm kiếm.
  - `getCategories()`: Trích xuất danh mục.
  - `getEventStats()`: Thống kê số lượng phục vụ hiển thị summary.
- **Pages / Views (`src/pages/`)**:
  - `Home.jsx`: Trang chủ hiển thị banner và các sự kiện Featured.
  - `EventsPage.jsx`: Thư mục duyệt toàn bộ sự kiện với thanh tìm kiếm và lọc danh mục.
  - `EventDetail.jsx`: Trang chi tiết sự kiện dynamic segment (`/events/:id`) sử dụng `useParams` và `useNavigate`.
  - `About.jsx`: Bảng giải thích chi tiết kiến trúc Routing và URL mapping.
  - `NotFound.jsx`: Trang 404 thân thiện cho các đường dẫn không tồn tại.
- **Component Layer (`src/components/`)**:
  - `AppNavbar.jsx`: Navbar tích hợp `NavLink` cho active routing link.
  - `EventCard.jsx`: Thẻ sự kiện tích hợp `Link` chuyển hướng chi tiết.
  - `AppFooter.jsx`: Chân trang.

## 2. Hướng dẫn chạy

```bash
cd Slot7
npm install
npm run dev
```
