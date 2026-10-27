import React from "react";

export default function Navbar({ activeTab, setActiveTab, backendStatus, latency }) {
  return (
    <nav className="navbar">
      <div className="brand-section">
        <div className="brand-logo">🌸</div>
        <div>
          <div className="brand-title">Orchid Management SPA</div>
          <div className="brand-subtitle">SBA301 Slot 20 • Full-Stack React & Spring Boot CORS</div>
        </div>
      </div>

      <div className="nav-links">
        <button
          className={`nav-btn ${activeTab === "catalog" ? "active" : ""}`}
          onClick={() => setActiveTab("catalog")}
        >
          🌺 Danh Sách Orchid
        </button>
        <button
          className={`nav-btn ${activeTab === "diagnostic" ? "active" : ""}`}
          onClick={() => setActiveTab("diagnostic")}
        >
          🛠️ CORS & Integration Diagnostic
        </button>
        <button
          className={`nav-btn ${activeTab === "origin-map" ? "active" : ""}`}
          onClick={() => setActiveTab("origin-map")}
        >
          🗺️ Origin Map & SOP
        </button>
      </div>

      <div className="nav-meta-pills">
        <div className={`meta-pill ${backendStatus === "CONNECTED" ? "connected" : "error"}`}>
          <span className="status-dot"></span>
          <span>
            {backendStatus === "CONNECTED"
              ? `Backend Live (${latency || 0}ms)`
              : "Backend Offline / CORS Error"}
          </span>
        </div>
        <div className="meta-pill">
          <span>FE: <code>localhost:5173</code></span>
        </div>
        <div className="meta-pill">
          <span>BE: <code>localhost:8080</code></span>
        </div>
      </div>
    </nav>
  );
}
