# BẢNG MA TRẬN KIỂM THỬ BẮT BUỘC (MANDATORY TEST MATRIX)
### FUNewsManagementSystem • SBA301 Assignment 01

| # | Nhóm kiểm thử | Trường hợp (Case) | Thao tác thực hiện | Kết quả mong đợi | Kết quả thực tế (Actual / Pass) |
| :-: | :--- | :--- | :--- | :--- | :---: |
| **1** | Login | Empty | Bấm nút Submit khi để trống username hoặc password | Không cho phép đăng nhập; hiển thị thông báo validation màu đỏ dưới các ô input | **PASS** |
| **2** | Login | Wrong credential | Nhập sai username hoặc password (VD: `wrong` / `wrong`) | Không vào trang admin; hiển thị alert màu đỏ cảnh báo sai thông tin đăng nhập | **PASS** |
| **3** | Login | Valid Admin | Nhập `Admin` / `Admin` (hoặc bấm nút 1-click test fill) | Đăng nhập thành công, chuyển hướng vào `/dashboard`, lưu phiên vào LocalStorage | **PASS** |
| **4** | Auth | Logout | Bấm nút "Đăng xuất" tại góc trên bên phải Header | Xóa session trong LocalStorage, chuyển hướng về `/login`; chặn truy cập trái phép | **PASS** |
| **5** | Layout | Menu completeness | Quan sát menu bên trái (Sidebar) khi đăng nhập tài khoản Admin | Hiển thị đầy đủ 5 mục: Dashboard, Chuyên mục, Tin tức, Tài khoản, Cài đặt | **PASS** |
| **6** | Navigation | All menus | Bấm lần lượt qua các mục trên thanh Menu Sidebar | Chuyển đúng nội dung tương ứng theo URL SPA, không bị full reload trang | **PASS** |
| **7** | Category | Read | Mở trang Quản lý Chuyên mục (`/categories`) | Danh sách hiển thị chính xác các trường: ID, Tên, Mô tả, Số bài viết, Trạng thái, Ngày tạo | **PASS** |
| **8** | Category | Create valid | Bấm "Thêm Chuyên Mục Mới", nhập tên "Trí Tuệ Nhân Tạo Mở", bấm "Thêm mới" | Modal đóng lại; bản ghi mới xuất hiện trên đầu bảng; hiển thị Toast thành công | **PASS** |
| **9** | Category | Create invalid | Mở dialog thêm chuyên mục nhưng để trống trường Tên, bấm submit | Không thêm dữ liệu; hiển thị cảnh báo "Tên chuyên mục không được để trống!" | **PASS** |
| **10** | Category | Update | Bấm nút Edit (cây bút chì), sửa tên chuyên mục, bấm "Lưu thay đổi" | Dữ liệu trên đúng hàng được cập nhật tức thì; modal đóng lại; có Toast thông báo | **PASS** |
| **11** | Category | Delete cancel | Bấm nút Delete (thùng rác), sau đó bấm "Hủy bỏ" trong modal xác nhận | Modal đóng lại; bản ghi vẫn giữ nguyên vị trí trong bảng, không bị xóa | **PASS** |
| **12** | Category | Delete confirm | Bấm nút Delete trên chuyên mục chưa có bài viết ràng buộc, bấm "Xác nhận xóa" | Bản ghi biến mất khỏi bảng; danh sách cập nhật bất biến (immutable update) | **PASS** |
| **13** | Category | Search hit | Nhập từ khóa "Công nghệ" vào ô tìm kiếm chuyên mục | Bảng chỉ hiển thị các chuyên mục có tên hoặc mô tả chứa từ khóa "Công nghệ" | **PASS** |
| **14** | Category | Search miss | Nhập từ khóa không tồn tại như "xyz999" vào ô tìm kiếm | Hiển thị giao diện Empty State với biểu tượng và nút "Xóa bộ lọc tìm kiếm" | **PASS** |
| **15** | News | Read | Mở trang Quản lý Tin tức (`/news`) | Bảng hiển thị đầy đủ danh sách bài viết kèm badge Chuyên mục, Tác giả, Thẻ Tags | **PASS** |
| **16** | News | Create valid | Bấm "Soạn Bài Viết Mới", nhập đầy đủ Tiêu đề, chọn Chuyên mục, Nội dung, bấm Đăng tin | Bài viết mới xuất hiện trên bảng tin; số đếm danh mục tự động tăng | **PASS** |
| **17** | News | Create invalid | Để trống ô Tiêu đề hoặc Nội dung khi soạn thảo bài viết | Form hiển thị viền đỏ validation; không gửi dữ liệu đi | **PASS** |
| **18** | News | Update | Bấm Edit bài viết, thay đổi tiêu đề hoặc chuyên mục, bấm "Lưu thay đổi" | Bài viết được cập nhật chính xác nội dung mới và thời gian chỉnh sửa | **PASS** |
| **19** | News | Delete cancel | Bấm nút Delete bài viết, trong popup chọn "Hủy bỏ" | Bản ghi bài viết được bảo toàn, không thay đổi | **PASS** |
| **20** | News | Delete confirm | Bấm nút Delete bài viết, trong popup chọn "Xóa bài viết" | Bài viết bị xóa khỏi danh sách và LocalStorage; hiển thị Toast thành công | **PASS** |
| **21** | News | Search hit | Nhập từ khóa "FPT" hoặc "AI" vào ô tìm kiếm tin tức | Hiển thị chính xác các bài viết có tiêu đề, nội dung hoặc thẻ tags chứa từ khóa | **PASS** |
| **22** | News | Search miss | Nhập chuỗi ký tự ngẫu nhiên không có trong bài viết nào | Hiển thị Empty State kèm thông báo không tìm thấy kết quả | **PASS** |
| **23** | Users | Read | Đăng nhập tài khoản Admin, mở trang Quản lý Tài khoản (`/users`) | Bảng người dùng hiển thị đầy đủ Username, Họ tên, Email, Role badge, Status | **PASS** |
| **24** | Users | Create valid | Bấm "Thêm Tài Khoản Mới", điền username, mật khẩu, họ tên, email hợp lệ | Tài khoản mới được thêm vào danh sách, có thể dùng để đăng nhập ngay | **PASS** |
| **25** | Users | Create invalid | Bỏ trống các trường bắt buộc hoặc nhập email sai định dạng (VD: `abc@`) | Form chặn submit và hiển thị thông báo lỗi định dạng email cụ thể | **PASS** |
| **26** | Users | Update | Bấm Edit người dùng, sửa họ tên hoặc chuyển đổi vai trò Admin/Staff | Thông tin người dùng cập nhật chuẩn xác, badge vai trò đổi màu tương ứng | **PASS** |
| **27** | Users | Delete cancel | Bấm nút Xóa tài khoản, chọn "Hủy bỏ" trong modal xác nhận | Tài khoản vẫn giữ nguyên, không bị ảnh hưởng | **PASS** |
| **28** | Users | Delete confirm | Bấm nút Xóa một tài khoản nhân viên thông thường, chọn "Xác nhận xóa" | Tài khoản biến mất khỏi bảng và bị vô hiệu hóa quyền đăng nhập | **PASS** |
| **29** | Users | Search hit | Nhập tên "staff" hoặc "Long" vào ô tìm kiếm tài khoản | Lọc danh sách trả về đúng tài khoản khớp với từ khóa tìm kiếm | **PASS** |
| **30** | Users | Search miss | Nhập tên người dùng không tồn tại | Hiển thị giao diện Không tìm thấy tài khoản người dùng | **PASS** |
| **31** | News | Relation | Mở modal soạn bài viết mới, kiểm tra dropdown Chuyên mục trực thuộc | Dropdown liệt kê chính xác các chuyên mục đang có; liên kết `categoryId` hợp lệ | **PASS** |
| **32** | User | Role | Đăng nhập bằng tài khoản Staff (`staff` / `staff123`) | Menu Tài khoản (`/users`) tự động ẩn; truy cập trực tiếp URL bị chặn về Dashboard | **PASS** |
| **33** | Status | Display | Quan sát các bản ghi trong danh sách Chuyên mục, Tin tức, Tài khoản | Status `1` hiển thị badge xanh "Active / Xuất bản", Status `0` hiển thị badge xám "Inactive / Nháp" | **PASS** |
| **34** | Data | Empty state | Sử dụng bộ lọc tìm kiếm chuỗi không tồn tại hoặc xóa hết danh sách | Giao diện không bị crash/trắng màn hình; hiển thị card hướng dẫn thân thiện | **PASS** |
| **35** | Persistence | Reload | Thực hiện thêm 1 bài viết mới, sau đó bấm phím F5 Reload trình duyệt | Bài viết vừa tạo vẫn tồn tại đầy đủ nhờ cơ chế hydrate state từ LocalStorage | **PASS** |

---
**Tỷ lệ kiểm thử đạt:** 35 / 35 Cases (100% Pass)
