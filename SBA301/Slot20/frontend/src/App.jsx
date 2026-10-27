import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import ListOfOrchids from "./components/ListOfOrchids.jsx";
import EditOrchid from "./components/EditOrchid.jsx";
import BreakItDiagPanel from "./components/BreakItDiagPanel.jsx";
import OriginMapModal from "./components/OriginMapModal.jsx";
import { getOrchids } from "./api/orchidApi";

export default function App() {
  const [activeTab, setActiveTab] = useState("catalog"); // catalog | diagnostic | origin-map
  const [backendStatus, setBackendStatus] = useState("CHECKING");
  const [latency, setLatency] = useState(0);
  const [toasts, setToasts] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orchidToEdit, setOrchidToEdit] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Check Backend connectivity on mount
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = () => {
    getOrchids()
      .then((res) => {
        setBackendStatus("CONNECTED");
        setLatency(res.latencyMs || 45);
      })
      .catch(() => {
        setBackendStatus("ERROR");
      });
  };

  const showToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleOpenCreate = () => {
    setOrchidToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (orchid) => {
    setOrchidToEdit(orchid);
    setIsModalOpen(true);
  };

  const handleSaveSuccess = () => {
    setRefreshKey((k) => k + 1);
    checkHealth();
  };

  return (
    <div>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        latency={latency}
      />

      <main className="app-container">
        {/* Hero banner */}
        <div className="hero-banner">
          <div className="hero-content">
            <h1>Bộ Sưu Tập Hoa Lan Quý (Orchid SPA)</h1>
            <p>
              Tích hợp hoàn chỉnh Single Page Application (React / Vite) với RESTful API Backend (Spring Boot 3 + JPA) qua kết nối CORS chuẩn bảo mật.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-box">
              <div className="number">5173</div>
              <div className="label">Frontend Port</div>
            </div>
            <div className="stat-box">
              <div className="number">8080</div>
              <div className="label">Backend Port</div>
            </div>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "catalog" && (
          <ListOfOrchids
            key={refreshKey}
            onOpenCreate={handleOpenCreate}
            onOpenEdit={handleOpenEdit}
            onShowToast={showToast}
          />
        )}

        {activeTab === "diagnostic" && (
          <BreakItDiagPanel />
        )}

        {activeTab === "origin-map" && (
          <OriginMapModal />
        )}

        {/* Create / Edit Modal */}
        <EditOrchid
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          orchidToEdit={orchidToEdit}
          onSaveSuccess={handleSaveSuccess}
          onShowToast={showToast}
        />

        {/* Toast notifications */}
        <div className="toast-container">
          {toasts.map((t) => (
            <div key={t.id} className={`toast toast-${t.type}`}>
              <span>{t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}</span>
              <span>{t.message}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
