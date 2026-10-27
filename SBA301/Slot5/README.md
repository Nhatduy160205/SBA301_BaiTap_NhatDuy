# SBA301 - Slot 05: EventHub – Campus Event Explorer

Dự án tổng hợp Slot 05 - React Components, Props, Events, useState, Modal Interaction và Kiến trúc MVC Layer Service.

## 1. Kiến trúc dự án (MVC Layer Service)

- **Model Layer (`src/data/events.js`)**: Tập dữ liệu 8 sự kiện campus với thông tin chi tiết (tên, danh mục, thời gian, địa điểm, sức chứa ghế, cờ nổi bật, mô tả).
- **Service Layer (`src/services/eventService.js`)**: Đảm nhiệm toàn bộ nghiệp vụ xử lý dữ liệu:
  - `getAllEvents()`: Lấy danh sách sự kiện.
  - `filterEvents(list, options)`: Lọc theo danh mục, từ khóa tìm kiếm (tiêu đề, địa điểm, mô tả) và trạng thái nổi bật.
  - `getCategories(list)`: Trích xuất danh sách các phân loại sự kiện.
  - `getEventById(id)`: Lấy chi tiết sự kiện kèm kiểm tra hợp lệ.
  - `getMetrics(list)`: Tính toán tổng số sự kiện, sự kiện nổi bật, tổng sức chứa sinh viên, số lượng danh mục.
  - `registerForEvent(registeredEventIds, eventId)`: Kiểm tra nghiệp vụ đăng ký (tránh trùng lặp, thông báo xác nhận).
- **View / Components (`src/components/`)**:
  - `AppNavbar.jsx`: Thanh menu hiển thị số lượng vé/sự kiện sinh viên đã đăng ký.
  - `HeroSection.jsx`: Banner thống kê tổng thể 4 chỉ số quan trọng từ Service.
  - `EventList.jsx`: Thanh chọn danh mục, ô tìm kiếm và danh sách thẻ sự kiện.
  - `EventCard.jsx`: Thẻ hiển thị tóm tắt sự kiện kèm cờ "Featured" và trạng thái "Registered".
  - `EventModal.jsx`: Cửa sổ Modal hiển thị chi tiết và cho phép bấm nút "Register Now".
  - `AppFooter.jsx`: Chân trang.

## 2. Hướng dẫn chạy

```bash
cd Slot5
npm install
npm run dev
```
