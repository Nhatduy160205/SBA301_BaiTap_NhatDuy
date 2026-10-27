# Bài 4, 5, 6, 8, 9 — CORS Diagnostic & Break-It Workshop

## 1. Bài 4 & 5: Hiện tượng CORS Failure (Vì sao Postman chạy được mà Browser lại lỗi?)

### Câu hỏi cốt lõi:
*"Khi tắt cấu hình CORS trên Backend Spring Boot, gửi request qua Postman vẫn trả về dữ liệu 200 OK, nhưng mở trên React Browser lại bị lỗi chặn màu đỏ trong Console. Tại sao?"*

### Giải thích nguyên lý:
1. **Bản chất của CORS là Browser-side Security Mechanism**, không phải Server-side Firewall:
   - Khi frontend gửi request, server Spring Boot **vẫn nhận được request, vẫn query SQL Server và vẫn trả về response 200 OK**.
   - Tuy nhiên, vì thiếu header `Access-Control-Allow-Origin`, chính **trình duyệt (Chrome/Edge)** đã chặn không cho mã Javascript trong React app truy cập dữ liệu đó vì mục đích bảo mật chống tấn công CSRF / data leaking.
2. **Postman không phải là trình duyệt web**:
   - Postman là HTTP client độc lập, không áp dụng Same-Origin Policy, không chặn việc đọc response dù server có hay không có CORS headers.

---

## 2. Bài 6: Phân tích chi tiết Preflight OPTIONS Trace

### Request Header của Browser:
```http
OPTIONS /orchids/4 HTTP/1.1
Host: localhost:8080
Origin: http://localhost:5173
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: Content-Type
```

### Response Header từ Spring Boot WebConfig:
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD
Access-Control-Allow-Headers: *
Access-Control-Max-Age: 3600
```

---

## 3. Bài 8: Xác minh hậu điều kiện Database (DB Post-conditions)

| Thao tác API | Endpoint | HTTP Status | Trạng thái trước (Before) | Trạng thái sau (After DB verify) |
|---|---|---|---|---|
| **POST** | `/orchids/` | `201 Created` | Chưa có record với tên mới | Sinh `orchid_id` mới, có khóa ngoại `category_id = 1` |
| **PUT** | `/orchids/{id}` | `200 OK` | `category_id = 1` (Cattleya) | Cập nhật thành `category_id = 2` (Dendrobium) |
| **DELETE** | `/orchids/{id}` | `204 No Content` | Record tồn tại trong `orchids` | Record bị xóa khỏi DB, `SELECT` trả 0 rows |

---

## 4. Bài 9: So sánh Direct CORS vs. Vite Dev Proxy

| Tiêu chí | Direct CORS (Cấu hình WebConfig) | Vite Dev Proxy (`vite.config.js`) |
|---|---|---|
| **Cơ chế** | FE gọi thẳng `http://localhost:8080` qua kết nối Cross-Origin | FE gọi `http://localhost:5173/api/*`, Vite server chuyển tiếp tới `localhost:8080` |
| **Góc nhìn Browser** | Cross-Origin (Phải có CORS & Preflight) | Same-Origin (Không kích hoạt CORS trong browser) |
| **Cấu hình Backend** | Bắt buộc khai báo `WebMvcConfigurer` | Không bắt buộc CORS cho môi trường local |
| **Tính ứng dụng** | Rèn luyện hiểu biết sâu về CORS & Web Security | Tiện lợi trong development, mô phỏng reverse proxy |
