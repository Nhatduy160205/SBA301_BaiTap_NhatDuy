# SBA301 - SLOT 29: MANY-TO-MANY DEMO • DAO • REPOSITORY • SERVICE (PART B)

## Giới thiệu & Kiến trúc
Dự án hoàn thiện toàn bộ tầng quan hệ nhiều-nhiều (**Many-to-Many**) giữa `Student` và `Book` theo kiến trúc **3-Layer MVC**:
`Presentation/Main -> Service -> Repository -> DAO -> Hibernate (Session/Transaction) -> SQL Server (LibraryDB)`

### Phân công trách nhiệm
1. **Presentation / Main** (`fu.edu.sba301.slot29.app`):
   - `Main`: Điểm khởi chạy ứng dụng (Composition Root), điều phối dependency giữa các tầng.
2. **Service Layer** (`fu.edu.sba301.slot29.service`): **Toàn bộ logic nghiệp vụ xử lý ở đây**:
   - `StudentService`:
     - `borrowBook(studentId, bookId)`: Kiểm tra sự tồn tại của học sinh và sách, kiểm tra xem sách đã được mượn hay chưa (`alreadyBorrowed`), ném ngoại lệ `IllegalStateException` nếu vi phạm, duy trì quan hệ hai chiều và cập nhật persistence.
     - `returnBook(studentId, bookId)`: Tìm sách trong danh sách mượn của học sinh, ném `IllegalStateException` nếu không tìm thấy liên kết, loại bỏ liên kết và cập nhật database.
     - `deleteStudent(id)`: Xóa sinh viên mà không làm xóa các cuốn sách dùng chung (`shared Books remain`).
     - `getStudentsByBook(bookId)`: Lấy danh sách các sinh viên đang mượn cuốn sách cụ thể.
3. **Repository Layer** (`fu.edu.sba301.slot29.repository`):
   - `IStudentRepository`, `StudentRepository`, `IBookRepository`, `BookRepository`:
     - Cung cấp persistence contract trừu tượng, thuần túy giao tiếp với DAO, không chứa logic nghiệp vụ.
4. **DAO Layer** (`fu.edu.sba301.slot29.dao`):
   - `StudentDAO`: Thực hiện các thao tác mức thấp với Hibernate Session, HQL (`left join fetch s.books`, `join s.books b where b.id = :bookId`), transaction commit & rollback.
   - `BookDAO`: Quản lý thực thể `Book`.
5. **Entity & Mapping** (`fu.edu.sba301.slot29.entity`):
   - `Student`: Owning side với `@JoinTable(name = "STUDENTS_BOOKS")` cùng helper methods `addBook(Book)` và `removeBook(Book)`.
   - `Book`: Inverse side với `@ManyToMany(mappedBy = "books")`.
   - `Borrowing`: Thực thể Association Entity mở rộng (hỗ trợ lưu `borrowedDate`, `dueDate`, `status`).

## Cấu hình Database & Hibernate
- Database: Microsoft SQL Server (`localhost:1433`), Database name: `LibraryDB` (và in-memory H2 cho unit tests).
- File cấu hình: `src/main/resources/hibernate.cfg.xml`.

## Lệnh thực thi & Kiểm thử
```powershell
# Chạy toàn bộ 9 Unit/Integration Tests (100% PASS)
.\mvnw test

# Chạy ứng dụng Main console
.\mvnw exec:java -Dexec.mainClass="fu.edu.sba301.slot29.app.Main"
```