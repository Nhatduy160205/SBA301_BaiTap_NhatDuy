# Bài 10 / Bước 10 — Integration Test Matrix (T01 – T10)

Bảng ma trận kiểm thử tích hợp toàn diện theo đặc tả Slot 20:

| Mã Test | Thao tác / Hành động | Kết quả mong đợi trên Browser / UI | Xác minh Backend / Database | Trạng thái |
|---|---|---|---|---|
| **T01** | Load FE App (`http://localhost:5173`) | Render giao diện đầy đủ, không có lỗi console | Backend độc lập, không bị ảnh hưởng | **PASS** |
| **T02** | GET orchids (`/orchids/`) | Trả về 200 OK, danh sách hiển thị dạng card | Database không đổi | **PASS** |
| **T03** | Sai API port (Giả lập port 9999) | Báo Network Error / ERR_CONNECTION_REFUSED thân thiện | Backend log không nhận request | **PASS** |
| **T04** | CORS disabled | Trình duyệt chặn, Console báo lỗi CORS policy | Postman vẫn gọi được API | **PASS** |
| **T05** | POST Orchid hợp lệ | 201 Created + UI xuất hiện Orchid mới | Database có thêm 1 dòng mới | **PASS** |
| **T06** | PUT Orchid hợp lệ | 200 OK + UI cập nhật dữ liệu và category mới | Dòng trong DB được cập nhật chính xác | **PASS** |
| **T07** | DELETE Orchid | 204 No Content + card biến mất khỏi UI | Dòng trong DB bị xóa vĩnh viễn | **PASS** |
| **T08** | Backend 404 (ID không tồn tại) | UI hiển thị thông báo lỗi 404 có cấu trúc | DB không phát sinh thay đổi bất thường | **PASS** |
| **T09** | Preflight OPTIONS request | OPTIONS 200 OK trả đủ headers cho phép | Spring WebMvcConfigurer phản hồi chính xác | **PASS** |
| **T10** | Staging / Prod env simulation | Base URL được lấy từ `.env`, không hard-code | Kiểm tra source code client không chứa localhost rải rác | **PASS** |
