# Bài 1 — Origin Map Worksheet

## 1. Khái niệm Origin trong Web Security
Theo chuẩn W3C / RFC 6454, một **Origin** được xác định bởi bộ ba:
$$\text{Origin} = (\text{Scheme}, \text{Host}, \text{Port})$$

Hai URL được coi là **Same-Origin** khi và chỉ khi cả 3 thành phần trên **hoàn toàn trùng khớp**. Nếu bất kỳ thành phần nào khác nhau, trình duyệt sẽ coi là **Cross-Origin** và áp dụng chính sách **Same-Origin Policy (SOP)**.

---

## 2. Bảng phân tích Origin hệ thống Slot 20

| STT | Thành phần | Scheme | Host | Port | Origin Hoàn Chỉnh | Quan hệ với Browser Tab |
|---|---|---|---|---|---|---|
| 1 | **Frontend SPA** | `http` | `localhost` | `5173` | `http://localhost:5173` | **Origin gốc của trang web** (nơi render HTML/JS) |
| 2 | **Backend API** | `http` | `localhost` | `8080` | `http://localhost:8080` | **Cross-Origin** (vì Port `8080 != 5173`) |
| 3 | **Postman / Curl** | N/A | N/A | N/A | Không có Origin header | **Non-browser Client** (Không bị SOP/CORS chặn) |

---

## 3. Hành vi của Trình duyệt khi gửi Cross-Origin Request

1. **Simple Request (GET / POST đơn giản không có custom header):**
   - Trình duyệt tự động đính kèm header: `Origin: http://localhost:5173`.
   - Backend Spring Boot kiểm tra `WebMvcConfigurer` -> nếu nguồn được cho phép, trả về header `Access-Control-Allow-Origin: http://localhost:5173`.
   - Trình duyệt đọc header này và cho phép Javascript đọc response body.

2. **Preflighted Request (PUT, DELETE hoặc POST có `Content-Type: application/json`):**
   - Trước khi gửi request thật, trình duyệt tự động gửi trước một HTTP `OPTIONS` request (Preflight).
   - Kiểm tra các header:
     - `Access-Control-Request-Method: PUT`
     - `Access-Control-Request-Headers: Content-Type`
   - Spring Boot trả về `200 OK` với `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`.
   - Trình duyệt xác nhận được phép -> mới tiếp tục gửi request `PUT /orchids/{id}` thực tế.
