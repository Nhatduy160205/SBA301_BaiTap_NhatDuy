# SBA301 - SLOT 31: JAVAFX • FXML • CONTROLLER • CRUD UI INTEGRATION (PART B)

## Giới thiệu & Kiến trúc
Dự án hoàn thiện tầng giao diện người dùng **JavaFX & FXML** tích hợp với hệ thống **Hibernate CRUD** nhiều tầng theo đúng nguyên lý tách biệt trách nhiệm:
`FXML View -> StudentController (UI/Events) -> IStudentService -> Repository -> DAO -> Hibernate -> SQL Server`

> ⚠️ **Quy tắc thiết kế cốt lõi**:
> - `StudentController` **tuyệt đối không mở Hibernate Session, không viết HQL, không chứa transaction logic**.
> - Controller giao tiếp thuần túy với `IStudentService`.
> - Toàn bộ nghiệp vụ kiểm tra email trùng lặp, xác thực điểm số, kiểm tra tồn tại đều nằm ở `StudentService`.

### Cấu trúc các thành phần
1. **FXML View** (`src/main/resources/fu/edu/sba301/ui/student-view.fxml`):
   - Bố cục `BorderPane` với thanh tiêu đề.
   - Form nhập liệu `GridPane`: `txtEmail`, `txtFirstName`, `txtLastName`, `txtMarks`.
   - Các nút chức năng `HBox`: `Create`, `Update`, `Delete`, `Clear`, `Refresh`.
   - Bảng hiển thị `TableView<Student>` với 5 cột: `ID`, `Email`, `First Name`, `Last Name`, `Marks`.
2. **Controller Layer** (`fu.edu.sba301.ui.controller.StudentController`):
   - Khởi tạo `PropertyValueFactory` cho các cột của bảng.
   - Lắng nghe sự kiện chọn dòng (`selectedItemProperty`) để đưa thông tin lên Form (`populateForm`).
   - Xử lý các sự kiện click nút (`handleCreate`, `handleUpdate`, `handleDelete`, `handleClear`, `handleRefresh`).
   - Bắt các ngoại lệ nghiệp vụ (`IllegalArgumentException`, `IllegalStateException`) từ tầng Service để hiển thị thông báo lỗi `Alert` thân thiện với người dùng.
3. **Application Entry Point** (`fu.edu.sba301.ui.StudentApplication`):
   - Kế thừa `javafx.application.Application`, nạp FXML và thực hiện tiêm phụ thuộc (Dependency Injection) tầng Service vào Controller.
4. **Service, Repository, DAO, Entity**:
   - `StudentService`: Tầng nghiệp vụ trung tâm.
   - `StudentRepository`: Tầng trừu tượng dữ liệu.
   - `StudentDAO`: Tầng Hibernate Session & Transaction.
   - `Student`: Thực thể JPA ánh xạ bảng `STUDENTS`.

## Cấu hình Database & Hibernate
- Database: Microsoft SQL Server (`localhost:1433`), Database name: `LibraryDB`.
- File cấu hình: `src/main/resources/hibernate.cfg.xml`.

## Lệnh thực thi & Kiểm thử
```powershell
# Chạy Unit & Integration Tests tự động (100% PASS)
.\mvnw test

# Chạy ứng dụng giao diện JavaFX
.\mvnw javafx:run
```