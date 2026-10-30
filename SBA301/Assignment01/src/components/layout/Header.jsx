import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Determine current page title based on path
  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return { title: "Bảng Điều Khiển", subtitle: "Thống kê tổng quan hệ thống" };
    if (path.includes("categories")) return { title: "Quản Lý Chuyên Mục", subtitle: "Danh mục tin tức & bài viết" };
    if (path.includes("news")) return { title: "Quản Lý Tin Tức", subtitle: "Soạn thảo, kiểm duyệt và xuất bản bài viết" };
    if (path.includes("users")) return { title: "Quản Lý Tài Khoản", subtitle: "Phân quyền và tài khoản người dùng" };
    if (path.includes("settings")) return { title: "Cấu Hình Hệ Thống", subtitle: "Cài đặt & hồ sơ cá nhân" };
    return { title: "Hệ Thống Quản Trị", subtitle: "FUNewsManagementSystem" };
  };

  const pageInfo = getPageInfo();

  return (
    <header className="funews-topbar d-flex align-items-center px-4 py-2">
      <div className="w-100 d-flex justify-content-between align-items-center gap-3">
        {/* Dynamic Page Title / Breadcrumb */}
        <div className="d-flex align-items-center gap-2">
          <div>
            <h5 className="mb-0 fw-bold text-body lh-1">{pageInfo.title}</h5>
            <small className="text-secondary d-none d-sm-inline" style={{ fontSize: "0.78rem" }}>
              {pageInfo.subtitle}
            </small>
          </div>
        </div>

        {/* Center Quick Search (Decorative / Global filter visual) */}
        <div className="search-quickbar d-none d-md-block">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm nhanh..."
            readOnly
            title="Sử dụng ô tìm kiếm riêng biệt trong từng trang chức năng"
          />
          <span className="kbd-shortcut">Ctrl K</span>
        </div>

        {/* Right Actions */}
        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "38px", height: "38px" }}
            onClick={toggleTheme}
            title={theme === "light" ? "Chuyển sang chế độ Tối (Dark)" : "Chuyển sang chế độ Sáng (Light)"}
          >
            <i className={`bi ${theme === "light" ? "bi-moon-stars-fill text-warning" : "bi-sun-fill text-warning"}`}></i>
          </button>

          {/* User Badge Pill */}
          {currentUser && (
            <div className="d-flex align-items-center gap-2 px-3 py-1 bg-body rounded-pill border shadow-sm">
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold ${
                  isAdmin ? "bg-teal-subtle text-success" : "bg-primary-subtle text-primary"
                }`}
                style={{
                  width: "30px",
                  height: "30px",
                  fontSize: "0.85rem",
                  background: isAdmin ? "linear-gradient(135deg, #0d9488, #10b981)" : "linear-gradient(135deg, #6366f1, #3b82f6)"
                }}
              >
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <div className="d-none d-md-block text-start lh-1">
                <span className="fw-bold d-block text-body" style={{ fontSize: "0.82rem" }}>
                  {currentUser.fullName || currentUser.username}
                </span>
                <span
                  className="badge p-0 text-secondary"
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
            className="btn btn-outline-danger btn-sm rounded-3 d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm"
            onClick={handleLogout}
            title="Đăng xuất khỏi hệ thống"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span className="d-none d-sm-inline">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
