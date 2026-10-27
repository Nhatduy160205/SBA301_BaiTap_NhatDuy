# SBA301 - Slot 06: React Hook Product Manager

Dự án tổng hợp Slot 06 - React Hooks (useState, useEffect, useContext, useRef, Custom Hook), Controlled Form, Immutable Updates, LocalStorage Persistence và Kiến trúc MVC Layer Service.

## 1. Kiến trúc dự án (MVC Layer Service)

- **Model Layer (`src/data/initialProducts.js`)**: Dữ liệu hạt giống cho danh mục sản phẩm thiết bị văn phòng / công nghệ.
- **Service Layer (`src/services/productService.js`)**: Nơi tập trung toàn bộ business logic và validation:
  - `validateProduct(productData)`: Kiểm tra hợp lệ từng trường dữ liệu (tên không rỗng, giá > 0, số lượng >= 0).
  - `createProduct(currentProducts, productData)`: Tạo mới sản phẩm với ID tự tăng và cập nhật mảng bất biến (immutable).
  - `updateProduct(currentProducts, id, productData)`: Cập nhật sản phẩm bằng `map()`.
  - `deleteProduct(currentProducts, id)`: Xóa sản phẩm bằng `filter()`.
  - `filterProducts(products, options)`: Tìm kiếm theo tên/danh mục và sắp xếp theo giá/số lượng/tên.
  - `calculateStats(products)`: Tính toán số lượng sản phẩm, tổng tồn kho, giá trị tài sản kho hàng, cảnh báo tồn kho thấp (<5).
- **Custom Hook Layer (`src/hooks/`)**:
  - `useLocalStorage.js`: Quản lý lưu trữ tự động vào localStorage với xử lý ngoại lệ JSON an toàn.
- **Context Layer (`src/context/ThemeContext.jsx`)**: Quản lý chủ đề giao diện (Dark/Light mode) lưu trữ bền vững.
- **View / Components (`src/components/`)**:
  - `AppNavbar.jsx`: Điều hướng, nút thêm sản phẩm và nút chuyển đổi Dark/Light mode.
  - `ProductStats.jsx`: Bảng thẻ thống kê số liệu tồn kho theo thời gian thực.
  - `ProductFilter.jsx`: Bộ lọc danh mục, tìm kiếm và sắp xếp.
  - `ProductList.jsx`: Danh sách sản phẩm.
  - `ProductCard.jsx`: Thẻ sản phẩm với huy hiệu In Stock / Low Stock.
  - `ProductForm.jsx`: Controlled Form hỗ trợ cả Thêm mới và Sửa sản phẩm kèm validation.
  - `DeleteModal.jsx`: Modal xác nhận xóa an toàn.
  - `AppFooter.jsx`: Chân trang.

## 2. Hướng dẫn chạy

```bash
cd Slot6
npm install
npm run dev
```
