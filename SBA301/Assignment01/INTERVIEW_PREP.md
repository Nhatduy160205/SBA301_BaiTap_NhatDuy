# TÀI LIỆU ÔN TẬP VÀ TRẢ LỜI PHỎNG VẤN (INTERVIEW DEFENSE GUIDE)
### SBA301 • Assignment 01 • Working with ReactJS Application

Tài liệu này được biên soạn bám sát **Mục 7 và Mục 12** trong file Hướng dẫn Sinh viên thực hiện Assignment 01, giúp sinh viên tự tin đạt điểm tối đa (10.0 / 10.0) trong phần bảo vệ và phỏng vấn trực tiếp với Giảng viên.

---

## PHẦN 1: KHUNG GIẢI THÍCH MÃ NGUỒN 5 TẦNG (5-LAYER EXPLANATION)

Khi giảng viên yêu cầu: *"Em hãy mở file X và giải thích luồng hoạt động"*, hãy áp dụng chuẩn mực 5 tầng sau:

1. **Purpose (Mục đích):** Component/file này giải quyết bài toán nghiệp vụ gì?
2. **Input (Dữ liệu đầu vào):** Nhận props gì từ cha, lấy state/data nào từ Context hay Service?
3. **Trigger (Tác nhân kích hoạt):** Sự kiện người dùng (`onClick`, `onChange`, `onSubmit`) hoặc Hook vòng đời (`useEffect`) nào khởi phát luồng?
4. **Transform (Xử lý biến đổi):** Dữ liệu được validate ra sao? Lọc (filter) thế nào? Tạo bản ghi mới bất biến (immutable) ra sao?
5. **Output (Dữ liệu đầu ra & UI):** State nào cập nhật? LocalStorage lưu gì? React Virtual DOM render lại phần tử nào trên giao diện?

---

## PHẦN 2: TRẢ LỜI CHI TIẾT CÁC CÂU HỎI INTERVIEW THEO ĐỀ BÀI

### 1. Lệnh và Môi trường thực thi (Section 12.1)
* **Lệnh tạo project Vite React:**
  ```bash
  npm create vite@latest Assignment01 -- --template react
  ```
  *Ý nghĩa:* Vite tải template React tối giản, cấu hình sẵn Rollup/Esbuild cho tốc độ khởi động cực nhanh qua ES Modules native.
* **`npm install` làm gì?**
  Đọc các khai báo phụ thuộc trong file `package.json` và `package-lock.json`, tải mã nguồn các gói thư viện từ npm registry về thư mục cục bộ `node_modules`.
* **`npm run dev` làm gì?**
  Kích hoạt script `"dev": "vite"` trong `package.json`, biên dịch tức thời mã nguồn trong bộ nhớ và khởi chạy development server với tính năng HMR (Hot Module Replacement).
* **`package.json` chứa gì?**
  Chứa metadata dự án (tên, phiên bản, loại module), các scripts thực thi (`dev`, `build`, `preview`), danh sách `dependencies` chạy runtime và `devDependencies` phục vụ quá trình phát triển.
* **`node_modules` là gì? Có nộp không? Vì sao?**
  Là nơi chứa toàn bộ mã nguồn của các thư viện bên ngoài đã cài đặt. **Tuyệt đối không nộp `node_modules`** vì kích thước quá nặng (hàng trăm MB) và hoàn toàn có thể tái tạo tự động chỉ bằng một lệnh `npm install` dựa trên `package.json`.
* **Cách dừng dev server và xử lý khi cổng (port) bị bận?**
  Dừng server bằng tổ hợp phím `Ctrl + C` tại terminal. Nếu cổng 5173 bị chiếm dụng, Vite sẽ tự động đề xuất đổi sang 5174, hoặc có thể chỉ định rõ cổng mong muốn bằng `vite --port 3000`.

---

### 2. Kiến thức cốt lõi React (React Fundamentals - Section 12.2)
* **Component là gì?**
  Là khối xây dựng cơ bản của ứng dụng React, đại diện cho một phần giao diện người dùng độc lập, có thể tái sử dụng nhiều lần. Trong React hiện đại, component là một JavaScript function nhận `props` và trả về `JSX`.
* **JSX là gì?**
  Là cú pháp mở rộng (JavaScript XML) cho phép viết mã giao diện giống HTML ngay bên trong file JavaScript. Trình biên dịch (Babel/Vite) sẽ chuyển JSX thành các lời gọi hàm `React.createElement()`.
* **Props và State khác nhau như thế nào?**
  - **Props (Properties):** Là tham số truyền từ component cha xuống component con, mang tính chất chỉ đọc (**read-only / immutable** đối với component nhận).
  - **State:** Là dữ liệu nội bộ do chính component khởi tạo và quản lý, có thể biến đổi theo thời gian thông qua hàm cập nhật state (`setState`).
* **Khi nào Component bị Re-render?**
  1. Khi State nội tại của component thay đổi.
  2. Khi Props nhận từ component cha thay đổi.
  3. Khi component cha trực tiếp bị re-render.
  4. Khi Context mà component đang lắng nghe (`useContext`) có dữ liệu mới.
* **Vì sao KHÔNG ĐƯỢC mutate trực tiếp state?**
  React sử dụng thuật toán so sánh nông (**Shallow equality check / `Object.is()`**) để quyết định có re-render hay không. Nếu ta mutate trực tiếp mảng hoặc object (ví dụ `list.push(item)`), địa chỉ vùng nhớ (tham chiếu) của object không hề đổi. Do đó React hiểu là dữ liệu không đổi và sẽ **không kích hoạt re-render giao diện**.
* **Controlled Input là gì?**
  Là thẻ input mà giá trị hiển thị của nó (`value`) được kiểm soát hoàn toàn bởi State của React, và mỗi khi người dùng gõ phím, sự kiện `onChange` sẽ cập nhật lại State đó.
* **Vì sao dùng `map()` cần có thuộc tính `key`? Có nên dùng `index` không?**
  React dùng `key` để định danh duy nhất từng phần tử trong danh sách trong quá trình Reconciliation (thuật toán đối soát Virtual DOM). `key` giúp React biết chính xác phần tử nào bị xóa, thêm hoặc đổi chỗ để cập nhật DOM tối ưu nhất. **Không nên dùng index** vì khi danh sách bị lọc, sắp xếp hoặc xóa phần tử ở giữa, index sẽ bị xáo trộn dẫn đến render sai state của component con.
* **Conditional Rendering là gì?**
  Là kỹ thuật hiển thị các phần tử giao diện khác nhau dựa trên điều kiện logic. Ví dụ: hiển thị nút Đăng xuất khi đã login, hoặc hiển thị `EmptyState` khi danh sách bài viết rỗng.

---

### 3. Luồng thực thi chi tiết (Execution Flow - Section 12.3)
* **Khi khởi động ứng dụng, cơ chế nào quyết định Login hay Admin?**
  Tại `App.jsx`, các route quản trị được bao bọc trong `AdminLayout`. `AdminLayout` gọi hook `useAuth()` để lấy `isAuthenticated`. Nếu chưa đăng nhập (`isAuthenticated === false`), nó sẽ render `<Navigate to="/login" replace />` chuyển hướng người dùng sang trang đăng nhập ngay lập tức.
* **Khi submit `Admin` / `Admin`, các bước diễn ra như thế nào?**
  1. Form `LoginPage` bắt sự kiện `onSubmit`, gọi `e.preventDefault()` để tránh reload trang.
  2. Gọi `login(username, password)` từ `AuthContext`.
  3. `userService.authenticate` kiểm tra tài khoản trong danh sách người dùng.
  4. Nếu khớp: lưu thông tin session vào State `currentUser` và đồng bộ vào `localStorage` qua `storageService.saveAuth()`.
  5. `useNavigate` chuyển hướng người dùng vào `/dashboard`.
* **Luồng Create dữ liệu hoạt động ra sao?**
  Người dùng bấm nút "Thêm mới" -> State `modalState` chuyển thành `{ show: true, mode: "create", selectedItem: null }` -> Modal mở ra với form trắng -> Người dùng nhập liệu và bấm submit -> Form validate các trường bắt buộc -> Gọi `service.create()` -> Tạo id mới duy nhất và trả về object mới -> Cập nhật State danh sách bất biến: `setList([newRecord, ...list])` -> Lưu LocalStorage -> Đóng modal -> Bật Toast thông báo thành công.
* **Luồng Search hoạt động ra sao? Có làm mất mảng gốc không?**
  Dữ liệu hiển thị trên bảng được tính toán động qua hàm lọc:
  ```javascript
  const displayedNews = newsService.search(newsList, searchKeyword, categoryFilter, statusFilter);
  ```
  Mảng gốc `newsList` không bao giờ bị can thiệp. Khi người dùng xóa ô tìm kiếm, `searchKeyword` trở về rỗng và `displayedNews` lại trả về đầy đủ toàn bộ phần tử của mảng gốc.

---

### 4. Xử lý yêu cầu thay đổi (Transfer Task Rehearsal - Section 8)
Khi giảng viên yêu cầu thực hiện một chỉnh sửa trực tiếp tại buổi chấm:

* **Bài tập mẫu 1: Thêm validation email cho User:**
  - Vị trí sửa: `src/components/users/UserModal.jsx` hàm `validate()`.
  - Code thực hiện:
    ```javascript
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Email không đúng định dạng!";
    }
    ```
* **Bài tập mẫu 2: Thêm bộ lọc trạng thái (Active / Inactive):**
  - Đã được tích hợp sẵn ở cả 3 trang Quản lý Chuyên mục, Tin tức, và Tài khoản thông qua thẻ `<select>` trạng thái!
* **Bài tập mẫu 3: Thêm nút Reset làm lại form trong Modal:**
  - Đã được tích hợp sẵn nút màu vàng "Làm lại" trong tất cả các Modal (`CategoryModal`, `NewsModal`, `UserModal`).
* **Bài tập mẫu 4: Giới hạn phân quyền cho Staff (Role = 2):**
  - Tại `Sidebar.jsx`, mục "Tài khoản" được bảo vệ bởi điều kiện `{isAdmin && (...)}`.
  - Tại `App.jsx`, route `/users` được bọc bởi `<AdminRoute>`: nếu người dùng là Staff cố tình gõ URL `/users` trên thanh địa chỉ, hệ thống sẽ tự động chặn và điều hướng về `/dashboard`.

---
*Tài liệu dành cho sinh viên SBA301 - Chúc bạn tự tin đạt điểm A+!*
