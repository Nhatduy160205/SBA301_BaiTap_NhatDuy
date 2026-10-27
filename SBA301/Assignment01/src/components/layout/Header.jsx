import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar navbar-expand sticky-top bg-body shadow-sm border-bottom px-3 py-2 funews-header">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Brand with AI Logo */}
        <Link to="/dashboard" className="navbar-brand d-flex align-items-center gap-3 text-decoration-none">
          <div className="brand-logo-container shadow-sm rounded-3 overflow-hidden">
            <img
              src="/assets/logo.jpg"
              alt="FUNews AI Logo"
              className="brand-logo-img"
              style={{ width: "42px", height: "42px", objectFit: "cover" }}
            />
          </div>
          <div>
            <div className="brand-title fw-bold text-gradient lh-1 fs-5">
              FUNewsManagementSystem
            </div>
            <small className="text-secondary" style={{ fontSize: "0.75rem" }}>
              Admin Management Portal • SBA301
            </small>
          </div>
        </Link>

        {/* Right Action Bar */}
        <div className="d-flex align-items-center gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "36px", height: "36px" }}
            onClick={toggleTheme}
            title={theme === "light" ? "Chuyển sang chế độ Tối (Dark)" : "Chuyển sang chế độ Sáng (Light)"}
          >
            <i className={`bi ${theme === "light" ? "bi-moon-stars-fill text-warning" : "bi-sun-fill text-warning"}`}></i>
          </button>

          {/* Current User Badge */}
          {currentUser && (
            <div className="d-flex align-items-center gap-2 px-3 py-1 bg-body-tertiary rounded-pill border">
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold ${
                  isAdmin ? "bg-primary" : "bg-success"
                }`}
                style={{ width: "28px", height: "28px", fontSize: "0.8rem" }}
              >
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <div className="d-none d-sm-block text-start lh-1">
                <span className="fw-bold d-block text-body" style={{ fontSize: "0.85rem" }}>
                  {currentUser.fullName || currentUser.username}
                </span>
                <span
                  className={`badge p-0 ${
                    isAdmin ? "text-primary" : "text-success"
                  }`}
                  style={{ fontSize: "0.7rem" }}
                >
                  {currentUser.roleName}
                </span>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            type="button"
            className="btn btn-outline-danger btn-sm rounded-3 d-flex align-items-center gap-1 px-3 py-1 fw-semibold"
            onClick={handleLogout}
            title="Đăng xuất khỏi hệ thống"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span className="d-none d-md-inline">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};
