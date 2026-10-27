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
    <div className="d-flex flex-column min-vh-100 bg-body-tertiary funews-app-wrapper">
      <Header />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-3 p-md-4 overflow-auto content-area">
          <div className="container-fluid py-2">
            <Outlet />
          </div>
        </main>
      </div>
      <footer className="footer bg-body border-top py-2 px-4 text-center text-secondary small">
        <span>
          © 2026 <strong>FUNewsManagementSystem</strong> • FPT University • SBA301 Assignment 01
        </span>
      </footer>
    </div>
  );
};
