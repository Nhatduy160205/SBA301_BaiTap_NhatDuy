# SBA301 - Slot 23: Chapter 15 Part B - React CRUD Client

Ứng dụng Frontend Single Page Application (SPA) hoàn chỉnh sử dụng React, Vite, Axios, React Router và Bootstrap theo đúng tài liệu **`SBA301 - SLOT 23`**.

---

## 1. Cấu Trúc Thành Phần Theo File Hướng Dẫn

- **`src/api/axiosClient.js`**: Axios instance cấu hình tập trung đọc base URL từ `VITE_API_URL` (`http://localhost:8080/orchids`).
- **`src/api/orchidApi.js`**: Đóng gói các hàm gọi API CRUD: `getAllOrchids`, `getOrchidById`, `createOrchid`, `updateOrchid`, `deleteOrchid`.
- **`src/components/NavBar.jsx`**: Thanh điều hướng Bootstrap Navbar.
- **`src/components/OrchidForm.jsx`**: Reusable Controlled Form bên trong React-Bootstrap Modal dùng cho use case Tạo mới (Create).
- **`src/pages/ListOfOrchids.jsx`**: Quản lý state danh sách hoa lan, hiển thị bảng dữ liệu, loading spinner, lỗi và thao tác xóa với `deletingId` pending state.
- **`src/pages/EditOrchid.jsx`**: Route-based edit (`/orchids/:id/edit`) với `useParams`, prefill dữ liệu và submit cập nhật `PUT`.

---

## 2. Hướng Dẫn Vận Hành

```bash
cd Slot23
npm run dev
# Truy cập giao diện tại: http://localhost:5173
```
