import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Sidebar = () => {
  const { isAdmin, currentUser } = useAuth();

  const navItems = [
    {
      to: "/dashboard",
      icon: "bi-grid-1x2-fill",
      label: "Dashboard",
      description: "Thống kê tổng quan",
      badge: null
    },
    {
      to: "/categories",
      icon: "bi-collection-fill",
      label: "Chuyên mục",
      description: "Quản lý danh mục tin tức",
      badge: null
    },
    {
      to: "/news",
      icon: "bi-newspaper",
      label: "Tin tức",
      description: "Quản lý bài viết",
      badge: null
    },
    // User management is visible only to Admin (Role 1)
    ...(isAdmin
      ? [
          {
            to: "/users",
            icon: "bi-people-fill",
            label: "Tài khoản",
            description: "Quản lý người dùng & phân quyền",
            badge: "Admin"
          }
        ]
      : []),
    {
      to: "/settings",
      icon: "bi-sliders2",
      label: "Cài đặt",
      description: "Cấu hình hệ thống & hồ sơ",
      badge: null
    }
  ];

  return (
    <aside className="funews-full-sidebar shadow-sm">
      {/* Brand Header */}
      <div className="sidebar-brand d-flex align-items-center justify-content-between">
        <Link to="/dashboard" className="d-flex align-items-center gap-3 text-decoration-none">
          <div className="rounded-3 overflow-hidden shadow-sm p-1 bg-dark d-flex align-items-center justify-content-center border border-secondary border-opacity-25" style={{ width: "42px", height: "42px" }}>
            <img
              src="/assets/logo.jpg"
              alt="FUNews AI Logo"
              style={{ width: "34px", height: "34px", objectFit: "cover", borderRadius: "6px" }}
            />
          </div>
          <div className="sidebar-brand-name">
            <div className="fw-bold text-white lh-1 fs-6">
              FUNews<span className="text-gradient-emerald">Admin</span>
            </div>
            <small className="text-secondary opacity-75" style={{ fontSize: "0.7rem" }}>
              FPT University Portal
            </small>
          </div>
        </Link>
        <span className="brand-badge d-none d-lg-inline">SBA301</span>
      </div>

      {/* Navigation Section */}
      <div className="p-3 flex-grow-1 overflow-y-auto">
        <div className="sidebar-section-title px-2 mb-3 text-uppercase text-secondary fw-bold" style={{ fontSize: "0.68rem", letterSpacing: "1px" }}>
          Menu Điều Hướng
        </div>

        <nav className="nav flex-column">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-item-link d-flex align-items-center justify-content-between ${isActive ? "active" : ""}`
              }
            >
              <div className="d-flex align-items-center gap-2 text-truncate me-2" style={{ minWidth: 0, flex: 1 }}>
                <div className="nav-icon-wrap flex-shrink-0">
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <div className="sidebar-text-label text-truncate" style={{ minWidth: 0 }}>
                  <div className="lh-1 mb-1 text-truncate fw-semibold">{item.label}</div>
                  <small
                    className="d-none d-lg-block text-truncate opacity-75"
                    style={{ fontSize: "0.72rem" }}
                  >
                    {item.description}
                  </small>
                </div>
              </div>
              {item.badge && (
                <span
                  className="badge bg-warning text-dark rounded-pill px-2 py-1 sidebar-text-label flex-shrink-0 ms-auto shadow-sm"
                  style={{ fontSize: "0.68rem", lineHeight: "1.1", fontWeight: "700" }}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Modern Profile Card at Sidebar Bottom */}
      <div className="sidebar-footer">
        <div className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
          <div className="d-flex align-items-center gap-2">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm ${
                isAdmin ? "bg-success" : "bg-primary"
              }`}
              style={{ width: "34px", height: "34px", fontSize: "0.85rem" }}
            >
              {currentUser?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="sidebar-text-label lh-1">
              <span className="fw-semibold text-white d-block" style={{ fontSize: "0.82rem" }}>
                {currentUser?.fullName || currentUser?.username || "Guest"}
              </span>
              <div className="d-flex align-items-center gap-1 mt-1">
                <span className="status-indicator online"></span>
                <span className="text-secondary" style={{ fontSize: "0.7rem" }}>
                  {currentUser?.roleName || "User"}
                </span>
              </div>
            </div>
          </div>
          <span className="badge bg-dark text-secondary border border-secondary border-opacity-25 sidebar-text-label" style={{ fontSize: "0.68rem" }}>
            v2.1
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
