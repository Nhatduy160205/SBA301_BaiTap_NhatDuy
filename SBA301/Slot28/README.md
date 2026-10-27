# SBA301 - SLOT 28: HIBERNATE ARCHITECTURE, CONFIGURATION, MAPPING (PART A)

## Giới thiệu & Kiến trúc
Dự án được xây dựng theo kiến trúc **3-Layer phân tầng rõ ràng**:
`Application/Main -> Service -> Repository -> DAO -> Hibernate (Session/Transaction) -> SQL Server (LibraryDB)`

### Phân tầng trách nhiệm
1. **Presentation / Main** (`fu.edu.sba301.slot28.app`):
   - `Main`: Điểm khởi chạy ứng dụng (Composition Root), khởi tạo SessionFactory, wire các dependency `Service -> Repository -> DAO`.
2. **Service Layer** (`fu.edu.sba301.slot28.service`): **Toàn bộ logic nghiệp vụ xử lý ở đây**:
   - `StudentService`:
     - Validate thông tin sinh viên (email định dạng hợp lệ, tên không rỗng, điểm từ 0..10).
     - Kiểm tra nghiệp vụ email duy nhất (`findByEmail`) trước khi lưu.
     - Nghiệp vụ mượn sách `assignBookToStudent`: kiểm tra sinh viên tồn tại, sách tồn tại, kiểm tra đã mượn chưa, quản lý association.
3. **Repository Layer** (`fu.edu.sba301.slot28.repository`):
   - `IStudentRepository`, `StudentRepository`, `IBookRepository`, `BookRepository`:
     - Đóng gói persistence contract độc lập, thuần túy delegate sang DAO, không chứa business logic.
4. **DAO Layer** (`fu.edu.sba301.slot28.dao`):
   - `StudentDAO`, `BookDAO`: Quản lý trực tiếp `Session`, `Transaction`, truy vấn `HQL` với named parameters, phân trang `setFirstResult`/`setMaxResults`, dirty checking, merge detached entity, rollback khi có ngoại lệ.
5. **Entity & Mapping** (`fu.edu.sba301.slot28.entity`):
   - `Student` & `Book`: Ánh xạ quan hệ `@ManyToMany` qua bảng phụ `STUDENTS_BOOKS`.

## Cấu hình Database & Hibernate
- Database: Microsoft SQL Server (`localhost:1433`), Database name: `LibraryDB` (và H2 in-memory cho unit tests).
- File cấu hình: `src/main/resources/hibernate.cfg.xml`.

## Lệnh thực thi & Kiểm thử
```powershell
# Chạy toàn bộ 9 Unit/Integration Tests
.\mvnw test

# Chạy class Main console
.\mvnw exec:java -Dexec.mainClass="fu.edu.sba301.slot28.app.Main"
```