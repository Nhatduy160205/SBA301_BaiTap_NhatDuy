# Concept Trace & Architecture Flow - Lab 04 / Slot 17-18

## 1. Mô hình 3-Layer MVC & Tách biệt trách nhiệm Service Layer vs Repository

### Nguyên tắc cốt lõi:
- **Presentation Layer (`OrchidController`):** Chịu trách nhiệm tiếp nhận HTTP Request, đọc PathVariable/RequestParam/RequestBody, điều phối tới `IOrchidService` và trả về `ResponseEntity` với HTTP Status Code chuẩn (`200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `404 Not Found`). **Tuyệt đối không gọi trực tiếp Repository.**
- **Service Layer (`OrchidService`):** **Toàn bộ xử lý nghiệp vụ (Business Logic) và Transaction Boundary nằm ở đây.**
  - Kiểm tra tính hợp lệ của dữ liệu đầu vào (`orchidName` không rỗng).
  - Xác thực quan hệ: Kiểm tra `categoryId` có được truyền không, tra cứu Category trong database. Nếu không tồn tại thì ném `IllegalArgumentException`.
  - Quản lý trạng thái thực thể: Gán đối tượng Category đã được Hibernate quản lý (`managed entity`) vào Orchid trước khi lưu.
  - Xử lý khi tạo (`setOrchidID(null)` để database tự sinh khóa).
  - Quản lý transaction: `@Transactional(readOnly = true)` ở class level và `@Transactional` ở các thao tác ghi dữ liệu (`create`, `update`, `delete`).
- **Repository Layer (`IOrchidRepository`, `IOrchidCategoryRepository`):** Kế thừa `JpaRepository<Entity, Long>`. **Chỉ là tầng trừu tượng truy cập dữ liệu (Data Access Layer), hoàn toàn không chứa nghiệp vụ xử lý hay điều kiện validation.**

---

## 2. Quan hệ Thực thể JPA: Owning Side vs Inverse Side

### Relationship:
- `Orchid` (N) <---> (1) `OrchidCategory`
- `OrchidCategory` (1) <---> (N) `Orchid`

### Owning Side (`Orchid.java`):
```java
@ManyToOne(optional = false, fetch = FetchType.EAGER)
@JoinColumn(name = "category_id", nullable = false)
private OrchidCategory orchidCategory;
```
- Phía `Orchid` là **Owning Side** vì nó trực tiếp giữ Foreign Key column `category_id` trong database.
- Bất kỳ thay đổi nào về quan hệ giữa Orchid và Category đều được cập nhật xuống database qua trường này.

### Inverse Side (`OrchidCategory.java`):
```java
@OneToMany(mappedBy = "orchidCategory", cascade = CascadeType.ALL)
@JsonIgnore
private List<Orchid> orchids = new ArrayList<>();
```
- Phía `OrchidCategory` là **Inverse Side** sử dụng thuộc tính `mappedBy = "orchidCategory"`.
- `mappedBy` trỏ tới **tên biến Java** (`orchidCategory`) ở Owning Side, **không phải tên cột database `category_id`**.
- `@JsonIgnore` được gắn để ngăn ngừa hiện tượng **Infinite JSON Recursion** (vòng lặp đệ quy vô tận) khi Jackson serialize quan hệ hai chiều.

---

## 3. Request-to-Database Trace Worksheet

### Flow A: Tạo mới Orchid (`POST /api/orchids`)
1. **HTTP Client (Postman):** Gửi `POST http://localhost:8080/api/orchids` kèm JSON body chứa `orchidName`, `orchidCategory: { "categoryId": 1 }`, ...
2. **Controller (`OrchidController.create`):** `@RequestBody Orchid orchid` deserialize JSON thành Java object, gọi `orchidService.create(orchid)`.
3. **Service Layer (`OrchidService.create`):**
   - Mở Transaction (`@Transactional`).
   - Validate `orchidName != null && !orchidName.isBlank()`.
   - Gọi `resolveCategory(orchid)`: lấy `categoryId = 1`, truy vấn `categoryRepository.findById(1L)`.
   - Nếu tồn tại -> nhận `OrchidCategory` managed instance.
   - Gán `orchid.setOrchidID(null)` và `orchid.setOrchidCategory(managedCategory)`.
   - Gọi `orchidRepository.save(orchid)`.
4. **Data Access / Hibernate / JPA:**
   - Hibernate kiểm tra entity state (Transient -> Persistent).
   - Sinh câu lệnh SQL INSERT: `insert into orchids (is_attractive, is_natural, category_id, orchid_description, orchid_name, orchid_url) values (?, ?, ?, ?, ?, ?)`.
   - SQL Server tự động sinh ID IDENTITY và lưu vào bảng `orchids` với Foreign Key `category_id = 1`.
5. **Controller Response:** Trả về HTTP `201 Created` kèm JSON của Orchid vừa được tạo.

### Flow B: Lấy danh sách kèm Search (`GET /api/orchids?name=Ceasar`)
1. **HTTP Client:** Gửi `GET http://localhost:8080/api/orchids?name=Ceasar`.
2. **Controller:** Trích xuất `@RequestParam(required = false) String name`.
3. **Service Layer:**
   - Kiểm tra `name`: chuỗi không rỗng -> gọi `orchidRepository.findByOrchidNameContainingIgnoreCase("Ceasar")`.
4. **Repository & Hibernate:**
   - Hibernate tạo câu lệnh SQL: `select o1_0.orchidid, ... from orchids o1_0 where upper(o1_0.orchid_name) like upper(?) escape '\'`.
   - Hibernate nạp kết quả và eager load Category liên kết.
5. **Controller Response:** Trả về HTTP `200 OK` kèm danh sách Orchids phù hợp.
