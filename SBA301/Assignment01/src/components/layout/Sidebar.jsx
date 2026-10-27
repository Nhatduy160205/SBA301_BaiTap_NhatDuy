import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Sidebar = () => {
  const { isAdmin, currentUser } = useAuth();

  const navItems = [
    {
      to: "/dashboard",
      icon: "bi-speedometer2",
      label: "Dashboard",
      description: "Thống kê tổng quan",
      badge: null
    },
    {
      to: "/categories",
      icon: "bi-folder2-open",
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
    // User management is visible only to Admin (Role 1), fulfilling Transfer Task 8.2 & Core Role Policy!
    ...(isAdmin
      ? [
          {
            to: "/users",
            icon: "bi-people",
            label: "Tài khoản",
            description: "Quản lý người dùng & phân quyền",
            badge: "Admin"
          }
        ]
      : []),
    {
      to: "/settings",
      icon: "bi-gear",
      label: "Cài đặt",
      description: "Cấu hình hệ thống & hồ sơ",
      badge: null
    }
  ];

  return (
    <aside className="funews-sidebar bg-body border-end d-flex flex-column py-3 px-2 shadow-sm">
      <div className="sidebar-section px-3 mb-2 text-uppercase text-secondary fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>
        Hệ Thống Quản Trị
      </div>

      <nav className="nav nav-pills flex-column gap-1 flex-grow-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center justify-content-between px-3 py-2 rounded-3 transition-all ${
                isActive
                  ? "active bg-primary text-white shadow-sm fw-semibold"
                  : "text-body hover-bg-subtle"
              }`
            }
          >
            <div className="d-flex align-items-center gap-3">
              <i className={`bi ${item.icon} fs-5`}></i>
              <div>
                <div className="lh-1 mb-0">{item.label}</div>
                <small
                  className="d-none d-lg-block text-truncate opacity-75"
                  style={{ fontSize: "0.72rem" }}
                >
                  {item.description}
                </small>
              </div>
            </div>
            {item.badge && (
              <span className="badge bg-warning text-dark rounded-pill px-2 py-1" style={{ fontSize: "0.65rem" }}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Info Card in Sidebar Bottom */}
      <div className="sidebar-footer pt-3 mt-auto border-top px-3">
        <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-body-tertiary">
          <div className="d-flex align-items-center gap-2">
            <span className="status-indicator online"></span>
            <span className="small text-secondary fw-semibold">
              {currentUser?.username || "Guest"}
            </span>
          </div>
          <span className="badge bg-info-subtle text-info border border-info-subtle">
            v1.0.0
          </span>
        </div>
      </div>
    </aside>
  );
};
