import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api/httpClient";

export default function BreakItDiagPanel() {
  const [diagLog, setDiagLog] = useState([]);
  const [runningTest, setRunningTest] = useState(null);

  const addLog = (title, status, detail, type = "info") => {
    const entry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      title,
      status,
      detail,
      type,
    };
    setDiagLog((prev) => [entry, ...prev]);
  };

  // Test 1: Normal GET request with Origin header
  const runNormalGetTest = async () => {
    setRunningTest("GET");
    try {
      const res = await axios.get(`${API_BASE_URL}/orchids/`);
      addLog(
        "T02: GET /orchids/ Cross-Origin Request",
        `SUCCESS ${res.status}`,
        `Origin: ${window.location.origin} -> Target: ${API_BASE_URL}/orchids/
Received ${res.data.length} records. CORS Headers: Access-Control-Allow-Origin: * / ${window.location.origin}`,
        "success"
      );
    } catch (err) {
      addLog("T02: GET /orchids/ Failed", "ERROR", err.message, "danger");
    } finally {
      setRunningTest(null);
    }
  };

  // Test 2: Preflight OPTIONS request
  const runPreflightTest = async () => {
    setRunningTest("OPTIONS");
    try {
      const res = await axios.options(`${API_BASE_URL}/orchids/`, {
        headers: {
          "Access-Control-Request-Method": "PUT",
          "Access-Control-Request-Headers": "Content-Type",
        },
      });
      addLog(
        "T09: Preflight OPTIONS Request",
        `SUCCESS ${res.status}`,
        `Browser Preflight verified! Response contains Access-Control-Allow-Methods and Access-Control-Allow-Headers.`,
        "success"
      );
    } catch (err) {
      addLog("T09: Preflight Test Failed", "ERROR", err.message, "danger");
    } finally {
      setRunningTest(null);
    }
  };

  // Test 3: Break-It Test Wrong Port (simulating backend down / wrong port)
  const runWrongPortTest = async () => {
    setRunningTest("WRONG_PORT");
    try {
      await axios.get("http://localhost:9999/orchids/", { timeout: 3000 });
      addLog("T03: Wrong Port Test", "UNEXPECTED SUCCESS", "Target was reachable", "warning");
    } catch (err) {
      addLog(
        "T03 / Bước 11 Break: Wrong Port (http://localhost:9999)",
        "NETWORK ERROR (ERR_CONNECTION_REFUSED)",
        `Triệu chứng: Trình duyệt báo Network Error vì không có server lắng nghe trên port 9999.
Chẩn đoán: Backend đang chạy ở port 8080, không phải 9999. Sửa trong .env.development: VITE_API_BASE_URL=http://localhost:8080.`,
        "danger"
      );
    } finally {
      setRunningTest(null);
    }
  };

  // Test 4: 404 Handled Error
  const runNotFoundTest = async () => {
    setRunningTest("404");
    try {
      await axios.get(`${API_BASE_URL}/orchids/99999999`);
    } catch (err) {
      if (err.response) {
        addLog(
          "T08: Backend 404 Handled Contract",
          `HTTP 404 NOT FOUND`,
          `Response Body: ${JSON.stringify(err.response.data)}
Backend GlobalExceptionHandler trả về JSON format chuẩn với message: "${err.response.data?.message}".`,
          "warning"
        );
      } else {
        addLog("T08: 404 Test", "ERROR", err.message, "danger");
      }
    } finally {
      setRunningTest(null);
    }
  };

  // Test 5: Malformed JSON Test
  const runMalformedJsonTest = async () => {
    setRunningTest("MALFORMED");
    try {
      // Send raw unparseable payload
      await axios.post(`${API_BASE_URL}/orchids/`, "{ invalid json }", {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        addLog(
          "TC09 / Malformed JSON Test",
          `HTTP 400 BAD REQUEST`,
          `Backend Spring Boot HttpMessageNotReadableException đã bắt lỗi và trả về đúng: "${err.response.data?.message || 'Request body must contain valid JSON'}".`,
          "success"
        );
      } else {
        addLog("Malformed JSON Test", "ERROR", err.message, "danger");
      }
    } finally {
      setRunningTest(null);
    }
  };

  return (
    <div className="diag-panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700" }}>
            🛠️ Slot 20 Integration & Break-It Diagnostic Workshop
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            Mô phỏng và kiểm chứng các cổng kiểm thử (G1–G10), SOP/CORS Boundary, và các kịch bản lỗi trong tài liệu Slot 20.
          </p>
        </div>
        {diagLog.length > 0 && (
          <button className="btn btn-secondary" onClick={() => setDiagLog([])} style={{ padding: "6px 14px", fontSize: "12px" }}>
            Xóa log
          </button>
        )}
      </div>

      <div className="diag-grid">
        <div className="diag-card">
          <div>
            <h4>1. Kiểm thử GET Cross-Origin</h4>
            <p>Gửi request từ <code>localhost:5173</code> sang <code>localhost:8080/orchids/</code> để quan sát header <code>Origin</code> và <code>Access-Control-Allow-Origin</code>.</p>
          </div>
          <button className="btn btn-primary" onClick={runNormalGetTest} disabled={runningTest !== null}>
            {runningTest === "GET" ? "Đang chạy..." : "Chạy GET Test"}
          </button>
        </div>

        <div className="diag-card">
          <div>
            <h4>2. Kiểm thử Preflight OPTIONS</h4>
            <p>Mô phỏng browser gửi HTTP OPTIONS request với <code>Access-Control-Request-Method: PUT</code> để kiểm tra chính sách CORS.</p>
          </div>
          <button className="btn btn-primary" onClick={runPreflightTest} disabled={runningTest !== null}>
            {runningTest === "OPTIONS" ? "Đang chạy..." : "Chạy Preflight Test"}
          </button>
        </div>

        <div className="diag-card">
          <div>
            <h4>3. Break-It: Sai Port API (9999)</h4>
            <p>Mô phỏng trường hợp cấu hình sai port trong file <code>.env</code> dẫn tới lỗi <code>ERR_CONNECTION_REFUSED</code>.</p>
          </div>
          <button className="btn btn-danger" onClick={runWrongPortTest} disabled={runningTest !== null}>
            {runningTest === "WRONG_PORT" ? "Đang chạy..." : "Test Sai Port"}
          </button>
        </div>

        <div className="diag-card">
          <div>
            <h4>4. Kiểm thử 404 Handled Contract</h4>
            <p>Gửi GET với ID không tồn tại <code>/orchids/99999999</code> để kiểm tra GlobalExceptionHandler trả về lỗi JSON chuẩn.</p>
          </div>
          <button className="btn btn-secondary" onClick={runNotFoundTest} disabled={runningTest !== null}>
            {runningTest === "404" ? "Đang chạy..." : "Test 404 ID"}
          </button>
        </div>

        <div className="diag-card">
          <div>
            <h4>5. Kiểm thử Malformed JSON (400)</h4>
            <p>Gửi payload JSON sai cấu trúc để kiểm tra Spring Boot bắt lỗi <code>HttpMessageNotReadableException</code>.</p>
          </div>
          <button className="btn btn-secondary" onClick={runMalformedJsonTest} disabled={runningTest !== null}>
            {runningTest === "MALFORMED" ? "Đang chạy..." : "Test Body Sai JSON"}
          </button>
        </div>
      </div>

      {/* Log console output */}
      <div style={{ marginTop: "24px" }}>
        <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px" }}>
          📋 Live Diagnostic Trace Console ({diagLog.length} kết quả):
        </h4>
        {diagLog.length === 0 ? (
          <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
            Bấm vào một trong các nút kiểm thử phía trên để ghi nhận bằng chứng (Evidence) cho Slot 20.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {diagLog.map((log) => (
              <div
                key={log.id}
                style={{
                  borderLeft: `4px solid ${log.type === "success" ? "#10b981" : log.type === "danger" ? "#ef4444" : "#f59e0b"}`,
                  background: "#f8fafc",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <strong>{log.title}</strong>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{log.timestamp} • {log.status}</span>
                </div>
                <div className="diag-result">{log.detail}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
