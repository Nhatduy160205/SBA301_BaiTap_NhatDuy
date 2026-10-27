# PA02 - Project Assistant 02: Database & JPA Readiness Checkpoint

## Checklist Nghiệm thu PA02:
- [x] **Entity & Constraints:** Đã thiết kế các entity với khóa chính IDENTITY, trường bắt buộc (`nullable = false`), trường duy nhất (`unique = true`).
- [x] **Relationship Mapping:**
  - One-to-Many / Many-to-One: Đã xác định rõ Owning side (`@ManyToOne` + `@JoinColumn`) và Inverse side (`mappedBy`).
  - Many-to-Many: Đã cấu hình Join Table (`news_tags`) với `joinColumns` và `inverseJoinColumns`.
- [x] **3-Layer MVC Architecture:** Controller -> Service -> Repository. Mọi nghiệp vụ đặt tại Service.
- [x] **Testing Slice:** Đã có `@DataJpaTest` để kiểm thử Repository và Unit Test với Mockito cho Service.
- [x] **DTO Boundary:** Đã tách riêng DTO và Entity để loại bỏ nguy cơ JSON recursion.
