# AI Verification Worksheet (Slot 20 Gate G1–G10)

Bảng đối soát kiểm chứng 10 cổng nghiệm thu (Integration Gates) của học phần Slot 20:

| Cổng (Gate) | Tên tiêu chí | Bằng chứng kiểm chứng thực tế (Evidence) | Đánh giá |
|---|---|---|---|
| **G1 Baseline** | FE + BE khởi động độc lập | Backend maven package và test 14/14 PASS. Frontend Vite build thành công. | **ĐẠT** |
| **G2 API config** | Base URL tập trung, không hard-code | Quản lý qua `httpClient.js` sử dụng `import.meta.env.VITE_API_BASE_URL`. | **ĐẠT** |
| **G3 Browser trace** | Trace GET từ React -> DB -> React | `ListOfOrchids.jsx` gọi `getOrchids()` -> Controller -> Service -> Repository -> SQL. | **ĐẠT** |
| **G4 CORS understanding** | Hiểu rõ Origin & SOP | Có tài liệu `origin-map.md` và bảng phân tích Port 5173 vs 8080. | **ĐẠT** |
| **G5 Preflight** | Quan sát & kiểm thử OPTIONS | Unit test `preflightCorsOptions_ShouldReturn200AndAllowHeaders` PASS; panel chẩn đoán hỗ trợ test live. | **ĐẠT** |
| **G6 UI state** | Đầy đủ loading, error, empty state | Component có state `loading`, `error` banner có nút Thử lại, empty icon khi tìm kiếm không ra. | **ĐẠT** |
| **G7 Persistence** | POST/PUT/DELETE lưu bền vững vào DB | Đã kiểm chứng JPA Entity mapping với foreign key `FK1nau98c2g1u4qk2nx7fmj0dt5`. | **ĐẠT** |
| **G8 Break/Fix** | Chẩn đoán ít nhất 2 lỗi integration | Tab `BreakItDiagPanel` có sẵn kịch bản mô phỏng sai port, sai JSON, 404 not found. | **ĐẠT** |
| **G9 Environment** | Chiến lược Dev / Staging / Prod | Có file `.env.development`, `.env.production` và tài liệu `production-migration-note.md`. | **ĐẠT** |
| **G10 Explain** | Khả năng giải thích kiến trúc | Mã nguồn phân tầng rõ ràng: Controller -> Service -> Repository, chú thích chi tiết. | **ĐẠT** |
