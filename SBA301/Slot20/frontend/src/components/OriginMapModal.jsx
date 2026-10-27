import React from "react";

export default function OriginMapModal() {
  return (
    <div style={{ background: "white", padding: "28px", borderRadius: "16px", border: "1px solid var(--card-border)", boxShadow: "var(--shadow-sm)" }}>
      <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>
        🗺️ Origin Map Worksheet & Same-Origin Policy (SOP)
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
        Định nghĩa chi tiết về Origin, cơ chế Same-Origin Policy, và giải pháp CORS cho kiến trúc Full-Stack SPA React & Spring Boot.
      </p>

      {/* Table 1: Origin Matrix */}
      <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "10px" }}>
        1. Bảng Phân Tích Origin (Slot 20 Worksheet)
      </h3>
      <div style={{ overflowX: "auto", marginBottom: "28px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#f8fafc", textAlign: "left" }}>
              <th style={{ padding: "12px", border: "1px solid #e2e8f0" }}>Thành phần</th>
              <th style={{ padding: "12px", border: "1px solid #e2e8f0" }}>Scheme</th>
              <th style={{ padding: "12px", border: "1px solid #e2e8f0" }}>Host</th>
              <th style={{ padding: "12px", border: "1px solid #e2e8f0" }}>Port</th>
              <th style={{ padding: "12px", border: "1px solid #e2e8f0" }}>Full Origin</th>
              <th style={{ padding: "12px", border: "1px solid #e2e8f0" }}>Quan hệ với Browser</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Frontend SPA</td>
              <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}><code>http</code></td>
              <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}><code>localhost</code></td>
              <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}><code>5173</code></td>
              <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}><code>http://localhost:5173</code></td>
              <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>Nơi ứng dụng React tải vào tab trình duyệt</td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <td style={{ padding: "12px", border: "1px solid #e2e8f0", fontWeight: "600" }}>Backend REST API</td>
              <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}><code>http</code></td>
              <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}><code>localhost</code></td>
              <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}><code>8080</code></td>
              <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}><code>http://localhost:8080</code></td>
              <td style={{ padding: "12px", border: "1px solid #e2e8f0", color: "#dc2626", fontWeight: "600" }}>Khác Port (5173 != 8080) ➔ CROSS-ORIGIN</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Visual Diagram */}
      <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "10px" }}>
        2. Sơ đồ Luồng Request Cross-Origin & Preflight OPTIONS
      </h3>
      <div style={{ background: "#0f172a", color: "#e2e8f0", padding: "20px", borderRadius: "12px", fontFamily: "monospace", fontSize: "13px", lineHeight: "1.6", overflowX: "auto", marginBottom: "28px" }}>
{`[ React Component (ListOfOrchids) ]
      │
      ▼ (Calls orchidApi.js)
[ Axios HTTP Client ] ─── Base URL: http://localhost:8080
      │
      ▼
[ Browser Security Boundary (localhost:5173) ]
      │
      ├─► 1. Phát hiện target là Cross-Origin (localhost:8080)
      ├─► 2. Với POST/PUT (Content-Type: application/json):
      │      Tự động gửi HTTP OPTIONS (Preflight)
      │      Header: Origin: http://localhost:5173
      │              Access-Control-Request-Method: POST
      │              Access-Control-Request-Headers: Content-Type
      │
      ▼
[ Spring Boot WebConfig (localhost:8080) ]
      │
      ├─► Kiểm tra WebMvcConfigurer: allowedOrigins("http://localhost:5173")
      ├─► Trả lời 200 OK: Access-Control-Allow-Origin: http://localhost:5173
      │                   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
      │
      ▼ (Browser nhận thấy cho phép -> gửi request thực tế)
[ Actual Request: POST /orchids/ ]
      │
      ▼
[ OrchidController ] ──► [ OrchidService (Logic Layer) ] ──► [ IOrchidRepository ] ──► [ SQL Server OrchidDB ]`}
      </div>

      {/* Section 3: So sánh Direct CORS vs Vite Dev Proxy */}
      <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "10px" }}>
        3. So Sánh: Direct CORS vs. Vite Dev Proxy (Bài 9)
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ border: "1px solid #e2e8f0", padding: "16px", borderRadius: "10px", background: "#f8fafc" }}>
          <h4 style={{ color: "#4f46e5", marginBottom: "8px" }}>Phương Án 1: Direct CORS (Course Baseline)</h4>
          <ul style={{ fontSize: "13px", paddingLeft: "18px", lineHeight: "1.6", color: "#334155" }}>
            <li>Frontend gọi thẳng <code>http://localhost:8080/orchids/</code>.</li>
            <li>Browser trực tiếp áp dụng quy tắc SOP và gửi header <code>Origin</code>.</li>
            <li>Backend cấu hình <code>WebMvcConfigurer</code> để cho phép origin <code>http://localhost:5173</code>.</li>
            <li><strong>Ưu điểm:</strong> Học viên hiểu rõ bản chất CORS, Preflight OPTIONS và Network tab trong DevTools.</li>
          </ul>
        </div>

        <div style={{ border: "1px solid #e2e8f0", padding: "16px", borderRadius: "10px", background: "#f8fafc" }}>
          <h4 style={{ color: "#059669", marginBottom: "8px" }}>Phương Án 2: Vite Dev Proxy / Reverse Proxy</h4>
          <ul style={{ fontSize: "13px", paddingLeft: "18px", lineHeight: "1.6", color: "#334155" }}>
            <li>Frontend gọi relative URL <code>/api/orchids/</code> cùng origin với Vite.</li>
            <li>Vite Dev Server (Node.js) đứng giữa chuyển tiếp request tới <code>localhost:8080</code>.</li>
            <li>Browser nhìn thấy là Same-Origin nên không kích hoạt CORS/OPTIONS.</li>
            <li><strong>Ưu điểm:</strong> Giống môi trường production khi đứng sau Nginx / API Gateway.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
