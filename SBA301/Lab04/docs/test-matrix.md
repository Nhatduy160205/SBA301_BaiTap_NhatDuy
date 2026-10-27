# Test Matrix & Verification Results - Lab 04 / Slot 18

| Test ID | Tên Kiểm thử | Phương thức & URL | Precondition | Input Data | Expected Status / Result | Actual Status / Result | Đánh giá |
|---------|--------------|-------------------|--------------|------------|--------------------------|------------------------|----------|
| **T01** | Lấy danh sách Orchids | `GET /api/orchids` | DB có dữ liệu seed | None | `200 OK`, JSON array >= 8 phần tử | `200 OK`, mảng 8 Orchids, category đầy đủ | **PASS** |
| **T02** | Tìm kiếm theo tên | `GET /api/orchids?name=Ceasar` | DB có Ceasar 4N | `name=Ceasar` | `200 OK`, mảng chứa Orchid có tên khớp | `200 OK`, trả về 1 Orchid "Ceasar 4N" | **PASS** |
| **T03** | Lấy chi tiết Orchid tồn tại | `GET /api/orchids/1` | Orchid ID 1 tồn tại | `id=1` | `200 OK`, JSON Orchid chi tiết | `200 OK`, ID=1, "Ceasar 4N" | **PASS** |
| **T04** | Lấy chi tiết Orchid không tồn tại | `GET /api/orchids/9999` | Không có ID 9999 | `id=9999` | `404 Not Found` | `404 Not Found` | **PASS** |
| **T05** | Tạo mới Orchid hợp lệ | `POST /api/orchids` | Category ID 1 tồn tại | JSON Orchid với `categoryId: 1` | `201 Created`, trả về entity có ID mới | `201 Created`, ID mới = 9, CategoryId = 1 | **PASS** |
| **T06** | Tạo Orchid với Category không tồn tại | `POST /api/orchids` | Không có Category ID 99999 | JSON Orchid với `categoryId: 99999` | `400 Bad Request`, message báo lỗi Category | `400 Bad Request`, "Category not found: 99999" | **PASS** |
| **T07** | Cập nhật Orchid tồn tại | `PUT /api/orchids/9` | Orchid ID 9 tồn tại | JSON Orchid cập nhật (`categoryId: 2`) | `200 OK`, các thuộc tính được cập nhật | `200 OK`, tên và category đổi sang Cattleya | **PASS** |
| **T08** | Cập nhật Orchid không tồn tại | `PUT /api/orchids/99999` | Không có ID 99999 | JSON Orchid | `404 Not Found` | `404 Not Found` | **PASS** |
| **T09** | Xóa Orchid tồn tại | `DELETE /api/orchids/9` | Orchid ID 9 tồn tại | `id=9` | `204 No Content`, DB mất row | `204 No Content`, row bị xóa trong DB | **PASS** |
| **T10** | Xóa Orchid không tồn tại | `DELETE /api/orchids/9` | ID 9 vừa bị xóa | `id=9` | `404 Not Found` | `404 Not Found` | **PASS** |
| **T11** | Kiểm tra Foreign Key trong SQL Server | SQL Query | Bảng orchids & orchid_categories tồn tại | `SELECT * FROM sys.foreign_keys` | Có ràng buộc FK `FK1nau98c2g1u4qk2nx7fmj0dt5` | FK tồn tại, nối `orchids(category_id)` -> `orchid_categories(category_id)` | **PASS** |
| **T12** | Tính bền vững sau Restart | Khởi động lại Server | Đã seed dữ liệu | `GET /api/orchids` | Dữ liệu vẫn còn nguyên vẹn trong SQL Server | 8 Orchids còn nguyên vẹn trong DB | **PASS** |
