# SBA301 - LAB 02: Orchid Gallery SPA – Fetching & Caching Data

> **Môn học**: SBA301 – Integrate Single Page Application with Spring Boot  
> **Slot liên quan**: Slot 6 Hooks → Slot 7 Routing → Slot 8 HTTP/REST → Slot 9 Fetching/Caching  
> **Công nghệ**: ReactJS, Vite, React Bootstrap, Fetch API, Axios (awareness), Client-side Cache (TTL 30s).

---

## 1. Mục tiêu và Giới thiệu dự án

Dự án này là giải pháp hoàn chỉnh cho **Lab 02 (Orchid Gallery SPA)** kết hợp các kỹ thuật kiến trúc của **Slot 9**:
- **Lớp A (Lab 02 Core)**: Xây dựng Single Page Application với React Bootstrap (`Navbar`, `Container`, `Row`, `Col`, `Card`, `Modal`, `Badge`, `Button`), hiển thị danh sách hoa lan (Orchids) và xem chi tiết qua Modal.
- **Lớp B (Slot 9 Extension)**: Tách kiến trúc theo mô hình phân tầng:
  - **Service Layer** (`orchidService.js`): Đóng gói giao tiếp HTTP (Fetch API), xử lý lỗi và quản lý cache.
  - **Custom Hook** (`useOrchids.js`): Quản lý vòng đời và State machine (`loading`, `error`, `data`, `empty`, `reload`).
  - **Client Cache**: Caching trong bộ nhớ (Module-level cache) với TTL 30s và cơ chế **Force Reload** để chủ động làm mới dữ liệu.
  - **Axios Awareness** (`apiClient.js`, `orchidService.axios.example.js`): Cấu hình và so sánh hành vi giữa Fetch và Axios.
- **Lớp C (Optional Extension)**: Tìm kiếm theo tên lan (`SearchBox`), lọc theo danh mục (`CategoryFilter`), lọc lan đặc biệt (`isSpecial`) hoàn toàn bằng **Derived State** (không sinh thêm request HTTP).

---

## 2. Yêu cầu hệ thống (Prerequisites)

- **Node.js**: Khuyến nghị phiên bản Node 20.19+, Node 21.x (dùng Vite 5) hoặc Node 22.12+ (dùng Vite hiện hành).
- **Trình duyệt**: Google Chrome hoặc Microsoft Edge (sử dụng DevTools Network & Console).

---

## 3. Cài đặt và Khởi chạy (Install & Run)

### Bước 1: Cài đặt thư viện phụ thuộc
Di chuyển vào thư mục dự án và cài đặt:
```bash
cd orchid-gallery-spa
npm install
```
*(Các dependencies bao gồm: `react`, `react-dom`, `react-bootstrap`, `bootstrap`, `axios`).*

### Bước 2: Chạy môi trường phát triển (Dev server)
```bash
npm run dev
```
Mặc định ứng dụng sẽ chạy tại: **`http://localhost:5173/`** hoặc **`http://127.0.0.1:5173/`**.

### Bước 3: Kiểm tra chất lượng mã (Lint)
```bash
npm run lint
```

### Bước 4: Đóng gói và kiểm tra bản phát hành (Production Build & Preview)
```bash
npm run build
npm run preview
```

---

## 4. Cấu trúc thư mục dự án (Project Architecture)

```
orchid-gallery-spa/
├── public/
│   ├── orchids.json                      # Tệp dữ liệu JSON tĩnh 8 loài lan
│   └── images/
│       └── orchid-placeholder.svg        # Ảnh vector placeholder chuẩn SVG
├── src/
│   ├── api/
│   │   ├── apiClient.js                  # Axios client cấu hình timeout & header
│   │   ├── orchidService.js              # Service chính: Fetch + TTL Cache 30s + Clear Cache
│   │   └── orchidService.axios.example.js# Phiên bản ví dụ dùng Axios so sánh cú pháp
│   ├── components/
│   │   ├── NavBar.jsx                    # Navigation bar responsive (Home/Orchids/About)
│   │   ├── Orchids.jsx                   # Component cha quản lý state, search/filter, grid
│   │   ├── OrchidCard.jsx                # Card hiển thị thông tin từng lan + nút Detail
│   │   ├── OrchidDetailModal.jsx         # Modal xem chi tiết an toàn với null
│   │   ├── SearchBox.jsx                 # Ô tìm kiếm theo tên lan
│   │   ├── CategoryFilter.jsx            # Dropdown phân loại và switch Special
│   │   ├── LoadingSpinner.jsx            # UI trạng thái đang tải (Loading)
│   │   └── ErrorMessage.jsx              # UI trạng thái lỗi có nút Retry
│   ├── hooks/
│   │   └── useOrchids.js                 # Custom Hook đóng gói state machine & reload
│   ├── shared/
│   │   └── ListOfOrchids.js              # Dữ liệu tĩnh 8 orchids dùng cho baseline
│   ├── styles/
│   │   └── app.css                       # Tùy chỉnh CSS giao diện hiện đại & responsive
│   ├── App.jsx                           # Layout chính của ứng dụng
│   └── main.jsx                          # Điểm nhập ứng dụng, nạp Bootstrap CSS
├── index.html                            # Tệp HTML gốc với thẻ SEO và responsive viewport
├── package.json                          # Khai báo scripts và dependencies
└── vite.config.js                        # Cấu hình Vite React plugin
```

---

## 5. Luồng dữ liệu (Data Flow) và Cơ chế Caching

### 5.1 End-to-End Data Flow
```
User mở trang / App Mount
   │
   ▼
App.jsx ──► NavBar.jsx
   │
   ▼
Orchids.jsx ──► useOrchids() hook
                   │
                   ├──► setLoading(true), setError(null)
                   │
                   └──► orchidService.getOrchids({ force: false })
                           │
                           ├──► [Cache còn hạn (< 30s)?] ──(YES)──► Trả về orchidCache (No network)
                           │
                           └──► [Cache hết hạn hoặc force=true]
                                   │
                                   ├──► fetch('/orchids.json')
                                   ├──► Kiểm tra !response.ok ? throw Error
                                   ├──► Parse JSON
                                   ├──► Cập nhật orchidCache & cacheTime
                                   └──► Trả về dữ liệu
                   │
                   ├──► setOrchids(data), setLoading(false)
                   │
                   ▼
Orchids.jsx nhận dữ liệu ──► Tính toán Derived State (visibleOrchids)
   │
   ├──► Render LoadingSpinner (khi loading = true)
   ├──► Render ErrorMessage (khi có error, hỗ trợ Try Again)
   ├──► Render OrchidCard Grid (khi có data)
   └──► Bấm "Detail" ──► setSelectedOrchid(orchid), setShow(true) ──► Hiển thị OrchidDetailModal
```

### 5.2 Chính sách Caching (Cache Policy)
- **Thời gian sống (TTL - Time To Live)**: **30 giây** (`CACHE_DURATION = 30_000`).
- **Cache Hit**: Khi `useOrchids` gọi `getOrchids()` trong vòng 30 giây kể từ lần fetch gần nhất, service lập tức trả về dữ liệu trong biến `orchidCache` mà không gửi thêm request mạng nào đến dev server.
- **Cache Miss / Stale Data**: Sau 30 giây, điều kiện `now - cacheTime < CACHE_DURATION` sai, service sẽ phát request mới đến `/orchids.json` và cập nhật timestamp mới.
- **Force Reload (Bypass Cache)**: Nút **"Force Reload (Bypass Cache)"** gọi hàm `reload()`, kích hoạt `loadOrchids(true)` và truyền `{ force: true }` vào `orchidService.getOrchids({ force: true })`. Service bỏ qua cache còn hạn và lập tức gửi request HTTP mới lấy dữ liệu tươi.

---

## 6. So sánh Fetch API và Axios

| Tiêu chí | Fetch API (Trong dự án) | Axios (`orchidService.axios.example.js`) |
| :--- | :--- | :--- |
| **Cài đặt thư viện** | Tích hợp sẵn trong trình duyệt (Native) | Cần cài đặt gói `axios` qua npm |
| **Trích xuất dữ liệu** | Phải gọi `await response.json()` | Tự động phân tích JSON, truy cập qua `response.data` |
| **Xử lý lỗi HTTP (4xx, 5xx)**| Chỉ reject khi mất mạng; HTTP 404/500 **vẫn resolve**, bắt buộc phải kiểm tra `response.ok` | Tự động **reject Promise** khi status code nằm ngoài khoảng 2xx |
| **Request Cancellation** | Dùng `AbortController` | Hỗ trợ `AbortController` hoặc `CancelToken` cũ |
| **Interceptors** | Không có sẵn, phải tự bọc wrapper | Tích hợp sẵn request/response interceptors |

---

## 7. Break-It Lab: Báo cáo bằng chứng gỡ lỗi (Debugging Evidence)

| Tên lỗi | Thao tác tái hiện | Triệu chứng quan sát | Phân tích & Giải pháp |
| :--- | :--- | :--- | :--- |
| **1. 404 Not Found** | Đổi URL fetch thành `/orchidss.json` | Giao diện hiện `ErrorMessage` đỏ: *"Không thể tải dữ liệu: HTTP 404: Không thể tải orchids.json"*. Tab Network hiện mã đỏ 404. | `fetch()` không tự reject lỗi 404. Phải kiểm tra `if (!response.ok) throw new Error(...)` để đưa vào luồng `catch` của hook. |
| **2. Null Pointer khi mở Modal** | Xóa kiểm tra an toàn `orchid?.orchidName` trong modal khi `orchid = null` | Trình duyệt ném ngoại lệ Runtime: `Cannot read properties of null (reading 'orchidName')`, làm sập UI. | Sử dụng **Optional Chaining (`orchid?.`)** kết hợp **Nullish Coalescing (`??`)** và kiểm tra `orchid ? (...) : <p>Chưa chọn Orchid.</p>`. |
| **3. Vòng lặp Fetch vô tận (Infinite Loop)** | Không dùng `useCallback` hoặc để dependency array của `useEffect` tạo lại hàm mỗi render | Tab Network liên tục bắn hàng trăm request `/orchids.json` làm đơ trình duyệt. | Sử dụng `useCallback` cho `loadOrchids` với mảng phụ thuộc rỗng `[]`, truyền `[loadOrchids]` vào `useEffect`. |
| **4. Reload không cập nhật dữ liệu** | Nút Reload gọi hàm không truyền cờ `force: true` | Bấm Reload nhưng không có request mới xuất hiện trong Network vì cache 30s đang kích hoạt. | Thiết kế hàm `reload = useCallback(() => loadOrchids(true), [loadOrchids])` để kích hoạt cờ bypass cache. |

---

## 8. Trả lời 20 câu hỏi Human Verification Gate (Phần 12.1)

1. **Vì sao Lab 02 core nên chạy với static data trước khi chuyển sang Fetch?**  
   *Trả lời*: Giúp kiểm chứng độc lập rằng toàn bộ cấu trúc Component, giao diện React Bootstrap, Props, và State Modal hoạt động chính xác trước; tránh nhầm lẫn giữa lỗi rendering UI và lỗi mạng/bất đồng bộ.
2. **Props nào đi từ `Orchids` xuống `OrchidCard`?**  
   *Trả lời*: Gồm `orchid` (object chứa thông tin chi tiết một loài lan) và `onDetail` (hàm callback nhận `orchid` khi người dùng bấm nút xem chi tiết).
3. **Event nào đi từ `OrchidCard` lên `Orchids`?**  
   *Trả lời*: Event click nút "Detail" thông qua hàm callback `onDetail(orchid)` được truyền từ cha xuống.
4. **`selectedOrchid` và `show` khác nhau về vai trò thế nào?**  
   *Trả lời*: `show` là biến boolean điều khiển việc hiển thị (ẩn/hiện) của Modal; `selectedOrchid` là dữ liệu đối tượng hoa lan cụ thể cần hiển thị bên trong Modal.
5. **Nếu `orchid=null`, Modal cần xử lý gì?**  
   *Trả lời*: Modal phải áp dụng safe rendering: dùng `orchid?.orchidName ?? 'Orchid detail'` cho tiêu đề và hiển thị thông báo tạm (ví dụ: `<p>Chưa chọn Orchid.</p>`) thay vì truy cập trực tiếp các thuộc tính gây crash.
6. **Promise có ba trạng thái nào?**  
   *Trả lời*: `pending` (đang chờ), `fulfilled` (hoàn thành thành công), và `rejected` (thất bại/bị từ chối).
7. **`await` làm gì với Promise?**  
   *Trả lời*: `await` tạm dừng việc thực thi hàm `async` hiện tại cho đến khi Promise được giải quyết (resolved/rejected), và trả về giá trị kết quả hoặc ném ngoại lệ nếu Promise bị từ chối.
8. **Tại sao loading phải tắt trong `finally`?**  
   *Trả lời*: Đảm bảo trạng thái `loading` luôn luôn được chuyển về `false` trong cả hai kịch bản: tải thành công hoặc xảy ra lỗi, tránh tình trạng spinner quay vô tận.
9. **Vì sao `fetch` 404 không tự vào `catch` chỉ vì status 404?**  
   *Trả lời*: Vì `fetch` coi mọi phản hồi nhận được từ máy chủ (kể cả HTTP 4xx và 5xx) là một giao tiếp HTTP thành công; `fetch` chỉ reject Promise khi gặp sự cố mạng (network failure) hoặc request bị chặn hoàn toàn.
10. **`response.ok` dùng để làm gì?**  
    *Trả lời*: Là một thuộc tính boolean của Fetch Response, trả về `true` nếu mã trạng thái HTTP nằm trong dải thành công (200 - 299), giúp lập trình viên phát hiện lỗi HTTP và chủ động ném Error.
11. **`public/orchids.json` được truy cập bằng URL nào?**  
    *Trả lời*: Được truy cập trực tiếp bằng đường dẫn tuyệt đối tại gốc trình duyệt: `/orchids.json` (Vite tự động ánh xạ thư mục `public/` ra root).
12. **Service layer giải quyết coupling nào?**  
    *Trả lời*: Tách rời hoàn toàn logic truy xuất dữ liệu (HTTP client, URL, headers, parse JSON, caching) ra khỏi giao diện người dùng (React Components), giúp UI không phụ thuộc vào chi tiết cài đặt của tầng dữ liệu.
13. **`useOrchids` chịu trách nhiệm gì, và không nên chịu trách nhiệm gì?**  
    *Trả lời*: Chịu trách nhiệm quản lý state machine (`orchids`, `loading`, `error`) và vòng đời React (lifecycle); KHÔNG nên chịu trách nhiệm về giao diện hiển thị (HTML/JSX) hay các chi tiết mạng cấp thấp của Fetch/Axios.
14. **Cache hit khác cache miss thế nào?**  
    *Trả lời*: `Cache hit` là khi dữ liệu hợp lệ đã có sẵn trong bộ nhớ đệm và còn hạn TTL, trả về ngay lập tức không cần request mạng. `Cache miss` là khi chưa có cache hoặc cache đã quá hạn, buộc phải gửi request mạng mới đến server.
15. **TTL 30 giây có nghĩa gì?**  
    *Trả lời*: Time-To-Live = 30s nghĩa là dữ liệu trong cache chỉ được xem là hợp lệ (fresh) trong vòng 30 giây kể từ thời điểm nạp. Quá thời gian này, dữ liệu trở thành `stale` và cần được làm mới ở lần đọc tiếp theo.
16. **Force Reload khác normal load thế nào?**  
    *Trả lời*: `Normal load` ưu tiên kiểm tra tính hợp lệ của cache trước (chỉ fetch nếu miss); `Force Reload` truyền cờ bỏ qua cache (`force: true`), ép buộc service luôn gửi request HTTP mới đến server và ghi đè cache.
17. **Dùng DevTools chứng minh request thực sự xảy ra bằng cách nào?**  
    *Trả lời*: Mở DevTools (F12) → chọn tab **Network** → chọn bộ lọc **Fetch/XHR**; khi có request xảy ra, sẽ thấy dòng `orchids.json` với Method GET, Status 200, Content-Type `application/json` và thời gian phản hồi (Time/Waterfall).
18. **Axios trả dữ liệu ở đâu?**  
    *Trả lời*: Axios tự động parse JSON và gán payload vào thuộc tính `response.data`.
19. **Search/filter local có nên gọi API mới không? Vì sao?**  
    *Trả lời*: Không nên; vì toàn bộ 8 bản ghi đã có sẵn trong state trên client, việc lọc chỉ cần dùng hàm `filter()` của JavaScript để tạo **Derived State**, giúp phản hồi tức thì và tiết kiệm tài nguyên mạng.
20. **Nếu thay JSON file bằng Spring Boot API, component nào lý tưởng không cần đổi?**  
    *Trả lời*: Các UI components như `App`, `NavBar`, `Orchids`, `OrchidCard`, `OrchidDetailModal`, `SearchBox`, `CategoryFilter`, và thậm chí cả hook `useOrchids` đều giữ nguyên không cần thay đổi. Chỉ duy nhất tệp **`orchidService.js`** (hoặc `apiClient.js`) cần cập nhật endpoint URL sang Spring Boot API (ví dụ: `http://localhost:8080/api/orchids`).

---

## 9. Ma trận kiểm thử (Test Matrix Verification)

| Mã test | Kịch bản kiểm thử | Thao tác | Kết quả thực tế | Đánh giá |
| :---: | :--- | :--- | :--- | :---: |
| **T01** | Startup | `npm run dev` | Server khởi động mượt mà, không lỗi blocking | **PASS** |
| **T02** | Navbar | Mở trang chủ | Navbar hiển thị thương hiệu "Orchid Gallery", menu Home/Orchids/About | **PASS** |
| **T03** | Bootstrap | Quan sát Card & Button | Các phần tử mang giao diện chuẩn Bootstrap 5 | **PASS** |
| **T04** | List orchids | Quan sát danh sách | 8 thẻ hoa lan hiển thị chuẩn dạng Grid | **PASS** |
| **T05** | Card fields | Kiểm tra nội dung thẻ | Đầy đủ ảnh, tên lan, phân loại và nút Detail | **PASS** |
| **T06** | Detail modal | Bấm Detail card 1 | Modal mở hiển thị chi tiết "Ceasar 4N" (Dendrobium, Thailand, 4.8) | **PASS** |
| **T07** | Change detail | Bấm Detail card 5 | Modal cập nhật nội dung "Taichung Beauty" (Cattleya, Taiwan, 4.9) | **PASS** |
| **T08** | Close modal | Bấm Close / nút X | Modal đóng hoàn toàn, không đọng state lỗi | **PASS** |
| **T09** | Loading state | Reload trang | Spinner "Loading Orchids..." xuất hiện trong khi chờ dữ liệu | **PASS** |
| **T10** | Fetch HTTP | Kiểm tra tab Network | Gửi request `GET /orchids.json` thành công | **PASS** |
| **T11** | HTTP Status | Tab Network status | Trả về mã **200 OK** | **PASS** |
| **T12** | Response body | Tab Network Preview | Nhận đủ mảng JSON gồm 8 objects hoa lan | **PASS** |
| **T13** | Error 404 | Thử nghiệm sai URL | Hiển thị Alert đỏ thông báo lỗi và nút "Try Again" | **PASS** |
| **T14** | Retry | Bấm "Try Again" | Tải lại danh sách bình thường | **PASS** |
| **T15** | Force Reload | Bấm nút "Force Reload" | Request mới được gửi lên server bỏ qua cache | **PASS** |
| **T16** | Cache TTL | Re-render trong 30s | Đọc dữ liệu từ memory cache, không sinh request thừa | **PASS** |
| **T17** | Empty state | Kiểm tra khi mảng rỗng | Thông báo "Không có Orchid nào." | **PASS** |
| **T18** | Console Log | Tab Console | Hoàn toàn sạch lỗi ngoại lệ | **PASS** |
| **T19** | Responsive Grid | Thay đổi kích thước màn hình | Chuyển đổi linh hoạt 1 cột (xs), 2 cột (sm), 4 cột (lg) | **PASS** |
| **T20** | Production Build| `npm run build` | Tạo thư mục `dist` thành công, không phát sinh lỗi cú pháp | **PASS** |
| **T21** | Production Preview | `npm run preview` | Bản build chạy hoàn hảo trên preview server | **PASS** |
| **T22** | Search Box | Nhập "Vanda" | Lọc tức thì chỉ hiển thị 1 thẻ "Blue Vanda" | **PASS** |
| **T23** | Category Filter | Chọn "Cattleya" | Lọc chính xác 1 thẻ "Taichung Beauty" | **PASS** |
| **T24** | Special Switch | Bật switch "Special only" | Chỉ hiển thị các hoa lan có huy hiệu "Special" | **PASS** |

---

## 10. AI Verification Log

| Yêu cầu / Prompt | Đề xuất từ AI | Phương pháp kiểm chứng | Quyết định | Bài học rút ra |
| :--- | :--- | :--- | :--- | :--- |
| Thiết kế Caching TTL | Lưu cache trong biến module kèm timestamp | Gọi hàm nhiều lần trong 30s và kiểm tra tab Network | Chấp nhận triển khai | Biến module tồn tại theo vòng đời trang SPA, rất phù hợp cho client caching đơn giản không cần cài thêm Redux |
| Lọc danh sách theo từ khóa và loại lan | Dùng `useEffect` kết hợp `useState` phụ để lưu `filteredOrchids` | Phân tích quy tắc React: trạng thái có thể tính toán từ state gốc nên dùng Derived State | Bác bỏ dùng `useEffect`, chuyển sang tính trực tiếp `visibleOrchids = orchids.filter(...)` | Tránh hiện tượng redundant state và re-render thừa |
| Xử lý an toàn cho Modal Detail | Render có điều kiện và dùng Optional Chaining `orchid?.orchidName` | Kiểm tra render khi `orchid = null` | Chấp nhận triển khai | Luôn kiểm tra null safety cho component modal khi dữ liệu được truyền bất đồng bộ hoặc động |
