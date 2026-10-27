# SBA301 - Slot 16: Testing REST Services with MockMvc, JUnit 5 & Mockito

Dự án thực hành tổng hợp Slot 16 - Chiến lược kiểm thử tự động toàn diện cho hệ thống REST API theo 3 tầng (Controller, Service, Repository) sử dụng MockMvc, JUnit 5 Jupiter, Mockito, AssertJ và JsonPath.

## 1. Cấu trúc bài tập & Các bài kiểm thử

```
Slot16/
├── src/main/java/com/fpt/sba301/slot16/
│   ├── controller/NewsController.java
│   ├── service/NewsService.java & NewsServiceImpl.java
│   ├── repository/NewsRepository.java
│   └── exception/GlobalExceptionHandler.java
└── src/test/java/com/fpt/sba301/slot16/
    ├── controller/NewsControllerTest.java    # @WebMvcTest + MockMvc + @MockBean
    ├── service/NewsServiceTest.java          # Plain JUnit 5 + Mockito (@ExtendWith(MockitoExtension.class))
    └── repository/NewsRepositoryTest.java    # Repository unit test
```

## 2. Phạm vi kiểm thử chi tiết

1. **Controller Slice Tests (`@WebMvcTest`)**:
   - `testGetAllNews_Success`: Kiểm tra `GET /api/news` trả về HTTP 200 và mảng JSON.
   - `testGetNewsById_Found`: Kiểm tra `GET /api/news/{id}` trả về HTTP 200 và dữ liệu chi tiết.
   - `testGetNewsById_NotFound`: Kiểm tra `GET /api/news/{id}` không tồn tại trả về HTTP 404 và mã lỗi.
   - `testCreateNews_Success`: Kiểm tra `POST /api/news` trả về HTTP 201 cùng Location header.
   - `testCreateNews_ValidationError`: Kiểm tra khi gửi request body thiếu trường bắt buộc trả về HTTP 400 Bad Request.
   - `testUpdateNews_Success`: Kiểm tra `PUT /api/news/{id}` trả về HTTP 200.
   - `testDeleteNews_Success`: Kiểm tra `DELETE /api/news/{id}` trả về HTTP 204 No Content.
2. **Service Unit Tests (`Mockito`)**:
   - Cô lập tầng Service bằng cách mock `NewsRepository`.
   - Kiểm tra nghiệp vụ lọc theo từ khóa, ném lỗi `NewsNotFoundException` khi thiếu ID, và ném `ValidationException` khi phát hiện tiêu đề trùng lặp.
   - Sử dụng `verify(...)` để xác minh số lần tương tác giữa Service và Repository.
3. **Repository Tests**:
   - Kiểm tra các thao tác lưu trữ, sinh ID tự tăng, và xóa bản ghi.

## 3. Chạy toàn bộ Test Suite

```bash
cd Slot16
mvn test
```
