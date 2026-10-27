# API Contract - Orchid RESTful Web Service

Base URL: `http://localhost:8080` (Hỗ trợ cả prefix `/api/orchids` và `/orchids` tương thích Lab 04 & Slot 18)

## 1. Endpoints Overview

| # | Chức năng | HTTP Method | Endpoint | Request Body | Status Code | Mô tả |
|---|-----------|-------------|----------|--------------|-------------|-------|
| 1 | Lấy danh sách Orchids | `GET` | `/api/orchids` | Không | `200 OK` | Trả về mảng JSON chứa tất cả Orchids kèm thông tin OrchidCategory |
| 2 | Tìm kiếm Orchid theo tên | `GET` | `/api/orchids?name={keyword}` | Không | `200 OK` | Tìm kiếm chứa chuỗi (contains ignore case) theo `orchidName` |
| 3 | Lấy chi tiết Orchid | `GET` | `/api/orchids/{id}` | Không | `200 OK` / `404 Not Found` | Lấy Orchid theo ID |
| 4 | Tạo mới Orchid | `POST` | `/api/orchids` | JSON Orchid | `201 Created` / `400 Bad Request` | Tạo Orchid mới, resolve Category ID trong DB |
| 5 | Cập nhật Orchid | `PUT` | `/api/orchids/{id}` | JSON Orchid | `200 OK` / `404 Not Found` / `400 Bad Request` | Cập nhật toàn bộ thuộc tính và Category |
| 6 | Xóa Orchid | `DELETE` | `/api/orchids/{id}` | Không | `204 No Content` / `404 Not Found` | Xóa Orchid theo ID |
| 7 | Lấy danh sách Categories | `GET` | `/api/categories` | Không | `200 OK` | Trả về danh sách Category |
| 8 | Lấy chi tiết Category | `GET` | `/api/categories/{id}` | Không | `200 OK` / `404 Not Found` | Lấy Category theo ID |
| 9 | Tạo mới Category | `POST` | `/api/categories` | JSON Category | `201 Created` / `400 Bad Request` | Tạo Category mới |
| 10 | Cập nhật Category | `PUT` | `/api/categories/{id}` | JSON Category | `200 OK` / `404 Not Found` / `400 Bad Request` | Cập nhật tên Category |
| 11 | Xóa Category | `DELETE` | `/api/categories/{id}` | Không | `204 No Content` / `404 Not Found` | Xóa Category |

---

## 2. Request & Response Payload Examples

### POST `/api/orchids`
**Request Body:**
```json
{
  "orchidName": "Ceasar 4N",
  "isNatural": true,
  "orchidDescription": "Dendrobium nổi bật với màu tím và form hoa cân đối.",
  "orchidCategory": {
    "categoryId": 1
  },
  "isAttractive": true,
  "orchidURL": "/images/orchid-placeholder.svg"
}
```

**Response Body (`201 Created`):**
```json
{
  "orchidID": 1,
  "orchidName": "Ceasar 4N",
  "isNatural": true,
  "orchidDescription": "Dendrobium nổi bật với màu tím và form hoa cân đối.",
  "orchidCategory": {
    "categoryId": 1,
    "categoryName": "Dendrobium"
  },
  "isAttractive": true,
  "orchidURL": "/images/orchid-placeholder.svg"
}
```

**Negative Case (`400 Bad Request` - Category không tồn tại):**
```json
{
  "error": "Bad Request",
  "message": "Category not found: 99999"
}
```
