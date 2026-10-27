# SBA301 - Slot 15: API Versioning, Paging & Sorting, Page vs Slice

Dự án thực hành tổng hợp Slot 15 - Chiến lược Versioning REST API (URI path, query params, headers, media type negotiation), Phân trang (Paging) và Sắp xếp (Sorting) với Spring Data JPA + H2 In-Memory Database, và so sánh `Page` vs `Slice`.

## 1. Cấu trúc thư mục

```
com.fpt.sba301.slot15/
├── Slot15Application.java
├── config/
│   └── DataInitializer.java     # Tự động nạp 35 bản ghi vào H2 để kiểm thử phân trang
├── controller/
│   ├── NewsVersioningController.java # 4 chiến lược định tuyến API Versioning (v1 vs v2)
│   └── NewsPagingController.java     # Endpoints phân trang với Pageable & Slice
├── service/                          # Xử lý nghiệp vụ & guards
│   └── NewsService.java              # Ràng buộc max page size <= 50, whitelist sort fields
├── repository/
│   └── NewsRepository.java           # JpaRepository hỗ trợ Page và Slice
├── model/
│   └── NewsEntity.java               # JPA Entity ánh xạ bảng cơ sở dữ liệu
└── dto/
    ├── NewsV1DTO.java                # Contract V1 tiêu chuẩn
    └── NewsV2DTO.java                # Contract V2 mở rộng (summary, tags, viewCount, formattedDate)
```

## 2. Các chiến lược Versioning

1. **URI Path**:
   - `GET /api/v1/news`
   - `GET /api/v2/news`
2. **Query Parameter**:
   - `GET /api/versioned-news?version=1`
   - `GET /api/versioned-news?version=2`
3. **Custom Request Header**:
   - `GET /api/versioned-news` with Header `X-API-Version: 1`
   - `GET /api/versioned-news` with Header `X-API-Version: 2`
4. **Content Negotiation / Media Type**:
   - `GET /api/versioned-news` with Header `Accept: application/vnd.fpt.news.v1+json`
   - `GET /api/versioned-news` with Header `Accept: application/vnd.fpt.news.v2+json`

## 3. Paging & Sorting Endpoints

- **Page Pagination (kèm totalElements, totalPages)**:
  `GET http://localhost:8080/api/news?page=0&size=5&sort=createdAt,desc`
- **Slice Pagination (tối ưu hiệu năng, không count tổng)**:
  `GET http://localhost:8080/api/news/slice?page=0&size=10`

## 4. Hướng dẫn chạy

```bash
cd Slot15
mvn spring-boot:run
```
