# SBA301 Slot 20 — Full-Stack SPA: React <-> Spring Boot / CORS Integration

Dự án hoàn chỉnh Full-Stack Single Page Application (SPA) cho hệ thống **Orchid Management** theo đúng yêu cầu học phần **SBA301 Slot 20 (Chapter 14 & Lab 05)**.

---

## 1. Kiến trúc hệ thống (3-Layer MVC & Client-Server Integration)

```
[ Frontend: React / Vite SPA ]  (Origin: http://localhost:5173)
       │
       ▼ (Axios Centralized HTTP Client: baseURL from .env)
[ Browser Security Boundary ] ─── Enforces Same-Origin Policy (SOP) & CORS Preflight (OPTIONS)
       │
       ▼ (HTTP GET / POST / PUT / DELETE)
[ Backend: Spring Boot 3 REST API ] (Origin: http://localhost:8080)
       ├── WebConfig (WebMvcConfigurer: allowedOrigins="http://localhost:5173")
       ├── Controllers (OrchidController, OrchidCategoryController)
       ├── Service Layer (OrchidService, OrchidCategoryService - All Business Logic & Validation)
       ├── Repository Layer (IOrchidRepository, IOrchidCategoryRepository - Pure Spring Data JPA)
       └── Database (Microsoft SQL Server: OrchidDB / H2 Test)
```

> [!IMPORTANT]
> **Nguyên tắc phân tầng Service (3-Layer MVC)**: Toàn bộ kiểm tra nghiệp vụ (validation tên không rỗng, kiểm tra categoryId hợp lệ, tra cứu entity cha con, dirty checking khi cập nhật, và ngoại lệ nghiệp vụ) đều được xử lý tập trung tại **Service Layer**, Repositories chỉ đóng vai trò truy xuất dữ liệu JPA.

---

## 2. Thông tin Port & Môi Trường

| Thành phần | URL / Origin | Giao thức | Nhiệm vụ |
|---|---|---|---|
| **Frontend SPA** | `http://localhost:5173` | HTTP | Giao diện React SPA (Vite) |
| **Backend REST API** | `http://localhost:8080` | HTTP | Spring Boot 3 RESTful API & JPA |
| **Database** | `localhost:1433` | TCP / JDBC | Microsoft SQL Server (`OrchidDB`) |

### Cấu hình biến môi trường (`frontend/.env.development`):
```properties
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=Orchid Management SPA (Slot 20)
VITE_APP_ENV=development
```

---

## 3. Hướng dẫn cài đặt và khởi chạy

### A. Khởi động Backend (Spring Boot)
1. Đảm bảo SQL Server đang chạy database `OrchidDB` (hoặc ứng dụng tự động fallback nếu cần).
2. Di chuyển vào thư mục backend:
   ```bash
   cd Slot20/backend
   ```
3. Chạy lệnh:
   ```bash
   mvn spring-boot:run
   # Hoặc chạy file jar đã đóng gói sẵn:
   java -jar target/slot20-orchid-spa-backend-1.0.0.jar
   ```
4. Backend sẽ lắng nghe tại `http://localhost:8080`.

### B. Khởi động Frontend (React / Vite)
1. Di chuyển vào thư mục frontend:
   ```bash
   cd Slot20/frontend
   ```
2. Cài đặt dependencies (nếu chưa cài):
   ```bash
   npm install
   ```
3. Chạy dev server:
   ```bash
   npm run dev
   ```
4. Mở trình duyệt tại: `http://localhost:5173`.

---

## 4. Kiểm thử (Testing & Verification)

### A. Chạy Unit & Integration Tests của Backend
```bash
cd Slot20/backend
mvn test
```
*Kết quả:* **14/14 tests PASS** (Bao gồm `@WebMvcTest` kiểm tra CORS header, MockMvc Preflight OPTIONS, Service validation logic, và context load).

### B. Chạy Build Production Frontend
```bash
cd Slot20/frontend
npm run build
```

---

## 5. Tài liệu chuyên sâu (Worksheets & Evidence)

- [docs/origin-map.md](docs/origin-map.md): Bảng phân tích Origin, Scheme, Host, Port và cơ chế SOP.
- [docs/cors-diagnostic.md](docs/cors-diagnostic.md): Chẩn đoán lỗi CORS, giải thích Preflight OPTIONS và so sánh Direct CORS vs Vite Proxy.
- [docs/integration-test-matrix.md](docs/integration-test-matrix.md): Ma trận 10 bài test tích hợp (T01 – T10) theo tài liệu Slot 20.
- [docs/production-migration-note.md](docs/production-migration-note.md): Hướng dẫn chuyển đổi môi trường Staging/Production & Reverse Proxy.
- [docs/ai-verification-worksheet.md](docs/ai-verification-worksheet.md): Bảng tự kiểm chứng tích hợp theo chuẩn Slot 20 Gate G1–G10.
