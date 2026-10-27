# SBA301 - SLOT 30: HIBERNATE APPLICATION DEVELOPMENT & CRUD OPERATIONS (PART A)

## Giới thiệu & Kiến trúc
Dự án được triển khai theo kiến trúc **3-Layer MVC** với **Service Layer xử lý nghiệp vụ trung tâm**:
`Presentation/Main -> Service -> Repository -> DAO -> Hibernate (Session/Transaction) -> SQL Server (LibraryDB)`

### Phân công trách nhiệm
1. **Presentation / Main** (`fu.edu.sba301.slot30.app`):
   - `Main`: Composition root, khởi tạo và liên kết các tầng `Service -> Repository -> DAO`.
2. **Service Layer** (`fu.edu.sba301.slot30.service`): **Toàn bộ xử lý logic tập trung ở đây**:
   - `StudentService`:
     - Kiểm tra dữ liệu đầu vào: email không rỗng, tên không rỗng, điểm từ 0.0 đến 10.0 (`validate(s)`).
     - Kiểm tra email trùng lặp: gọi `repository.findByEmail(email)`, nếu tồn tại thì ném `IllegalStateException("Email already exists")`.
     - Xử lý Not Found: ném `IllegalArgumentException("Student not found")` khi tìm kiếm hoặc cập nhật/xóa id không tồn tại.
     - Cập nhật điểm `updateMarks`: kiểm tra biên điểm hợp lệ trước khi gọi persistence.
3. **Repository Layer** (`fu.edu.sba301.slot30.repository`):
   - `IStudentRepository`, `StudentRepository`: Che giấu hoàn toàn các thao tác Hibernate/HQL khỏi tầng Service, chỉ khai báo và thực thi contract lưu trữ.
4. **DAO Layer** (`fu.edu.sba301.slot30.dao`):
   - `StudentDAO`: Thao tác trực tiếp với Session, HQL, Transaction, rollback an toàn khi xảy ra ngoại lệ.
5. **Entity** (`fu.edu.sba301.slot30.entity`):
   - `Student`: Ánh xạ bảng `STUDENTS` (id, email UNIQUE, firstName, lastName, marks).
   - `Book`: Ánh xạ bảng `BOOKS`.

## Cấu hình Database & Hibernate
- Database: Microsoft SQL Server (`localhost:1433`), Database name: `LibraryDB`.
- File cấu hình: `src/main/resources/hibernate.cfg.xml`.

## CRUD Test Matrix (12 Test Cases - 100% PASS)
- C01: Create valid Student -> Tạo thành công, sinh ID.
- C02: Create duplicate email -> Service chặn, ném lỗi duplicate.
- R01: Get existing ID -> Trả về đúng Student.
- R02: Get missing ID -> Ném IllegalArgumentException.
- R03: List students -> Trả về danh sách có thứ tự.
- U01: Update valid marks -> Cập nhật thành công.
- U02: Update invalid marks -> Service từ chối.
- U03: Update missing ID -> Ném ngoại lệ.
- D01: Delete existing -> Xóa thành công.
- D02: Delete missing -> Ném ngoại lệ.
- T01: Rollback test -> Không xảy ra partial commit khi có lỗi.
- L01: Paging query -> Trả về kết quả phân trang chính xác.

## Lệnh thực thi & Kiểm thử
```powershell
# Chạy toàn bộ 12 Tests tự động
.\mvnw test

# Chạy ứng dụng Main console
.\mvnw exec:java -Dexec.mainClass="fu.edu.sba301.slot30.app.Main"
```