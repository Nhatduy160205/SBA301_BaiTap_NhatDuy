import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

export const AdminLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Preserve attempted URL location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="funews-master-layout bg-body-tertiary">
      {/* Edge-to-Edge Left Full-Height Sidebar */}
      <Sidebar />

      {/* Main Workspace Panel (Header + Main View + Footer) */}
      <div className="funews-main-panel">
        <Header />
        <main className="flex-grow-1 p-3 p-md-4 overflow-auto content-area">
          <div className="container-fluid py-2">
            <Outlet />
          </div>
        </main>
        <footer className="footer bg-body border-top py-3 px-4 text-center text-secondary small">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
            <span>
              © 2026 <strong>FUNewsManagementSystem</strong> • FPT University
            </span>
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-teal-subtle text-success border border-success-subtle px-2 py-1">
                SBA301 Assignment 01
              </span>
              <span className="text-secondary opacity-75">React 19 + Bootstrap 5</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
