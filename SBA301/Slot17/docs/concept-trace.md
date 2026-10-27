# Concept Trace & Architecture Answers - Slot 17

## 1. Owning Side vs Inverse Side
- Trong quan hệ `Category (1) <---> (N) News`:
  - `News` là **Owning Side** vì nó mang trường `@JoinColumn(name = "category_id")` tương ứng với Foreign Key thật trong database.
  - `Category` là **Inverse Side** với `mappedBy = "category"`. `mappedBy` bắt buộc phải trỏ đến tên biến Java `category` ở class `News`.

## 2. Dirty Checking & Transaction Boundary
- Khi một entity đang ở trạng thái `Managed` trong phạm vi `@Transactional`, Hibernate tự động theo dõi các thay đổi trên object thông qua Dirty Checking.
- Khi Transaction hoàn tất (commit/flush), Hibernate tự động sinh câu lệnh `UPDATE` tương ứng xuống database mà không bắt buộc phải gọi lại `save()`.

## 3. Vì sao xử lý nghiệp vụ phải đặt ở Service layer?
- `Repository` chỉ đại diện cho tầng truy cập dữ liệu (Data Access Layer). Nếu nhét kiểm tra logic (như check trùng tên, check category active, kiểm tra ràng buộc không cho xóa category có bài viết) vào Repository sẽ làm vỡ nguyên lý Single Responsibility Principle (SRP) và gây khó khăn khi tái sử dụng hoặc viết unit test.
