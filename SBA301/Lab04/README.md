# Lab 04 & Slot 18: Orchid RESTful Web Service & Spring Data JPA

Dự án mẫu hoàn chỉnh thực hiện theo yêu cầu của:
- **Lab 04: Building Spring Boot RESTful Web Services and Spring Data JPA**
- **SBA301 Slot 17: JPA Entity, Repository, Service & Relationships**
- **SBA301 Slot 18: Lab 04 Orchid REST API & JPA Integration Kit**

## 1. Yêu cầu kiến trúc bắt buộc (Architectural Rules)
- **Mô hình 3 tầng MVC:** Controller -> Service -> Repository.
- **Service Layer Processing:** Toàn bộ việc xử lý nghiệp vụ, kiểm tra ràng buộc dữ liệu (validation), liên kết Category và quản trị transaction (`@Transactional`) **được thực hiện ở tầng Service (`OrchidService`)**, không xử lý ở Repository.
- **Repository Abstraction:** `IOrchidRepository` và `IOrchidCategoryRepository` chỉ kế thừa `JpaRepository`, chỉ định nghĩa các derived query methods (không chứa code nghiệp vụ).

## 2. Cấu trúc thư mục dự án
```
Lab04/ (và liên kết Slot18/)
├── pom.xml
├── README.md
├── docs/
│   ├── api-contract.md
│   ├── concept-trace.md
│   └── test-matrix.md
├── evidence/
│   ├── console/
│   ├── postman/
│   └── sqlserver/
└── src/
    ├── main/
    │   ├── java/com/example/orchid/
    │   │   ├── OrchidApplication.java
    │   │   ├── config/DataInitializer.java
    │   │   ├── controllers/
    │   │   │   ├── OrchidController.java
    │   │   │   └── OrchidCategoryController.java
    │   │   ├── pojos/
    │   │   │   ├── Orchid.java
    │   │   │   └── OrchidCategory.java
    │   │   ├── repositories/
    │   │   │   ├── IOrchidRepository.java
    │   │   │   └── IOrchidCategoryRepository.java
    │   │   ├── services/
    │   │   │   ├── IOrchidService.java
    │   │   │   ├── OrchidService.java
    │   │   │   ├── IOrchidCategoryService.java
    │   │   │   └── OrchidCategoryService.java
    │   │   └── exception/
    │   │       ├── GlobalExceptionHandler.java
    │   │       └── ResourceNotFoundException.java
    │   └── resources/
    │       ├── application.properties
    │       └── application-test.properties
    └── test/
        └── java/com/example/orchid/
            ├── OrchidApplicationTests.java
            ├── controller/OrchidControllerTest.java
            └── service/OrchidServiceTest.java
```

## 3. Cấu hình Database (Microsoft SQL Server)
Trong file `src/main/resources/application.properties`:
```properties
spring.application.name=lab04-orchid-management
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=OrchidDB;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=Password123!
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
server.port=8080
```

## 4. Hướng dẫn Chạy ứng dụng và Kiểm thử

### 4.1 Chạy Unit & Integration Tests (H2 in-memory)
```bash
mvn clean test
```
*Kết quả:* Toàn bộ 23 tests trong `OrchidServiceTest`, `OrchidControllerTest`, `OrchidApplicationTests` đều PASS 100%.

### 4.2 Chạy ứng dụng với SQL Server
```bash
mvn spring-boot:run
```
hoặc đóng gói và chạy file JAR:
```bash
mvn clean package -DskipTests
java -jar target/lab04-orchid-jpa-rest-1.0.0.jar
```

Khi ứng dụng khởi động lần đầu, `DataInitializer` sẽ tự động tạo bảng và nạp 5 Danh mục cùng 8 Orchids mẫu vào SQL Server database `OrchidDB`.

### 4.3 Danh sách Endpoints chính
- `GET http://localhost:8080/api/orchids`: Lấy toàn bộ danh sách Orchids
- `GET http://localhost:8080/api/orchids?name=Ceasar`: Tìm kiếm theo tên
- `GET http://localhost:8080/api/orchids/1`: Lấy chi tiết Orchid ID 1
- `POST http://localhost:8080/api/orchids`: Tạo mới Orchid
- `PUT http://localhost:8080/api/orchids/1`: Cập nhật Orchid ID 1
- `DELETE http://localhost:8080/api/orchids/1`: Xóa Orchid ID 1
- `GET http://localhost:8080/api/categories`: Lấy danh sách Categories

## 5. Human Verification Gate - Câu hỏi và Trả lời
1. **Vì sao xử lý nghiệp vụ phải đặt ở Service layer thay vì Repository?**
   - Repository chỉ có nhiệm vụ tương tác với cơ sở dữ liệu (data access abstraction). Nghiệp vụ như validate trường bắt buộc, kiểm tra category tồn tại trước khi tạo/sửa, logic transaction và kết nối nhiều thực thể thuộc về Service layer.
2. **Owning side là gì trong quan hệ Orchid và OrchidCategory?**
   - `Orchid` là Owning side vì nó nắm giữ Foreign Key (`category_id`) trong database thông qua `@ManyToOne` và `@JoinColumn(name = "category_id")`.
3. **mappedBy trên OrchidCategory có ý nghĩa gì?**
   - `mappedBy = "orchidCategory"` chỉ ra rằng phía `OrchidCategory` là Inverse side và ánh xạ tới thuộc tính Java `orchidCategory` của entity `Orchid`.
4. **Tại sao cần `@JsonIgnore` trên list orchids của OrchidCategory?**
   - Để tránh lỗi đệ quy tuần hoàn vô tận (`Infinite JSON recursion`) khi Jackson chuyển đổi quan hệ 2 chiều sang chuỗi JSON.
