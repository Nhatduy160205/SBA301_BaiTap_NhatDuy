# SBA301 - Slot 08: Product REST API Design & Inspection Kit

Bài tập tổng hợp Slot 08 - Client–Server Architecture, HTTP Methods, JSON Parsing, Mock Server với `json-server`, REST Contract Inspection, và Kiến trúc MVC Layer Service.

## 1. Cấu trúc dự án

```
Slot8/
├── db.json                       # Live mock database do json-server đọc và ghi
├── db.seed.json                  # Clean database seed dùng để khôi phục
├── docs/
│   └── api-contract.md           # Hợp đồng REST API chi tiết (methods, endpoints, codes)
├── scripts/
│   ├── parse-json-demo.js        # Script minh họa JSON.parse, JSON.stringify & error handling
│   ├── reset-db.js               # Script khôi phục dữ liệu từ db.seed.json sang db.json
│   └── test-api.js               # Bộ test tự động kiểm tra REST endpoints
├── services/
│   └── productApiService.js      # Tầng Service xử lý kết nối HTTP, business logic, validation
├── package.json
└── README.md
```

## 2. Hướng dẫn sử dụng

### 2.1 Cài đặt dependencies
```bash
cd Slot8
npm install
```

### 2.2 Chạy demo JSON Serialization
```bash
npm run demo:json
```

### 2.3 Khởi động Mock REST API Server
```bash
npm run server
```
Server chạy tại: `http://localhost:5000`

### 2.4 Chạy bộ kiểm thử tự động REST API Contract
(Mở terminal thứ hai trong khi server đang chạy)
```bash
npm run test:api
```

### 2.5 Khôi phục dữ liệu sạch sau khi test (Reset DB)
```bash
npm run reset
```
