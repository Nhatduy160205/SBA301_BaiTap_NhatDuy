# Production Migration Note & Deployment Strategy

## 1. Chiến lược URL theo từng môi trường

```
                    ┌─────────────────────────┐
                    │ Môi Trường Development  │
                    │ FE: localhost:5173      │
                    │ BE: localhost:8080      │
                    │ CORS: Explicit Local    │
                    └─────────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  Môi Trường Staging     │
                    │ FE: staging.example.com │
                    │ BE: api-stg.example.com │
                    │ CORS: Staging Domain    │
                    └─────────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  Môi Trường Production  │
                    │ https://app.example.com │
                    │ Reverse Proxy / Nginx   │
                    │ /api/* -> Backend 8080  │
                    └─────────────────────────┘
```

---

## 2. Cấu hình Reverse Proxy (Nginx) mẫu cho Production

Khi triển khai thực tế trên server production, kiến trúc chuẩn là đặt **Nginx hoặc Cloudflare/API Gateway** ở phía trước. Lúc này, cả Frontend và Backend đều nằm chung một domain công khai `https://app.example.com`, loại bỏ hoàn toàn vấn đề CORS đối với trình duyệt người dùng:

```nginx
server {
    listen 443 ssl;
    server_name app.example.com;

    # Phục vụ Single Page Application (Static Files)
    location / {
        root /var/www/orchid-frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Chuyển tiếp các request /api/* vào Spring Boot service
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 3. Nguyên tắc bảo mật (Least Privilege & Secret Handling)

1. **Không lưu trữ Secret trong Frontend**:
   - Mọi biến môi trường bắt đầu bằng `VITE_*` đều sẽ được bundler đưa công khai vào mã nguồn Javascript tải về máy người dùng.
   - Tuyệt đối không để API keys bí mật, Database passwords, hoặc Private keys trong client bundle.
2. **CORS Least Privilege**:
   - Trên production, tuyệt đối không dùng `@CrossOrigin("*")` hoặc wildcard `allowedOrigins("*")`.
   - Chỉ cho phép đúng tên miền chính thức của Frontend và các HTTP method tối thiểu cần dùng (`GET, POST, PUT, DELETE`).
