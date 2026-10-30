import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const validate = () => {
    const errs = {};
    if (!username.trim()) {
      errs.username = "Vui lòng nhập tên đăng nhập!";
    }
    if (!password) {
      errs.password = "Vui lòng nhập mật khẩu!";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) {
      return;
    }

    const result = login(username, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || "Tên đăng nhập hoặc mật khẩu không chính xác!");
    }
  };

  // Quick fill test account for easy grading/testing
  const handleQuickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
    setFieldErrors({});
    setError("");
  };

  return (
    <div className="login-split-page">
      {/* Left Brand Showcase Hero Panel */}
      <div className="login-hero-panel">
        {/* Top Logo */}
        <div className="d-flex align-items-center gap-3">
          <div className="p-2 rounded-4 bg-dark bg-opacity-50 border border-white border-opacity-10 shadow">
            <img
              src="/assets/logo.jpg"
              alt="FUNews AI Logo"
              style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "10px" }}
            />
          </div>
          <div>
            <h4 className="fw-bold mb-0 text-white">FUNews Enterprise</h4>
            <small className="text-secondary">SBA301 • Single Page Application</small>
          </div>
        </div>

        {/* Center Hero Statement */}
        <div className="my-5 py-4">
          <div className="badge bg-teal-subtle text-info border border-info border-opacity-25 px-3 py-2 rounded-pill mb-3">
            <i className="bi bi-shield-check me-1"></i> Hệ Thống Quản Trị Tin Tức Thế Hệ Mới
          </div>
          <h1 className="display-6 fw-bold text-white mb-3 lh-sm">
            Quản lý nội dung và phân quyền chuẩn <span className="text-gradient-emerald">Enterprise</span>
          </h1>
          <p className="text-light opacity-75 fs-6 mb-4" style={{ maxWidth: "480px" }}>
            Nền tảng tích hợp công nghệ Single Page Application hiện đại, tối ưu hóa tốc độ xuất bản và kiểm soát luồng tin tức tại FPT University.
          </p>

          <div className="d-flex flex-column gap-3" style={{ maxWidth: "440px" }}>
            <div className="feature-pill">
              <i className="bi bi-key-fill text-warning fs-5"></i>
              <div>
                <strong className="d-block text-white">Bảo mật RBAC Hai Tầng</strong>
                <small className="text-secondary">Phân tách nghiêm ngặt quyền Admin và Staff theo nghiệp vụ</small>
              </div>
            </div>

            <div className="feature-pill">
              <i className="bi bi-lightning-charge-fill text-info fs-5"></i>
              <div>
                <strong className="d-block text-white">Cập Nhật Trực Quan Thời Gian Thực</strong>
                <small className="text-secondary">Bộ lọc tức thì và quản lý danh mục tin tức chuẩn xác</small>
              </div>
            </div>

            <div className="feature-pill">
              <i className="bi bi-pie-chart-fill text-success fs-5"></i>
              <div>
                <strong className="d-block text-white">Báo Cáo & Thống Kê Tổng Quan</strong>
                <small className="text-secondary">Biểu đồ trực quan và chỉ số phân bố danh mục</small>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer on Hero */}
        <div className="pt-4 border-top border-white border-opacity-10 d-flex justify-content-between align-items-center">
          <span className="small text-secondary">© 2026 FPT University</span>
          <span className="badge bg-dark text-secondary border border-secondary border-opacity-25 px-2 py-1">
            Build v2.1.0
          </span>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="login-form-panel">
        {/* Top Right Theme Toggle */}
        <div className="position-absolute top-0 end-0 p-4">
          <button
            type="button"
            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: "42px", height: "42px" }}
            onClick={toggleTheme}
            title="Đổi giao diện sáng/tối"
          >
            <i className={`bi ${theme === "light" ? "bi-moon-stars-fill text-warning" : "bi-sun-fill text-warning"}`}></i>
          </button>
        </div>

        <div className="w-100" style={{ maxWidth: "440px" }}>
          <div className="mb-4">
            <h3 className="fw-bold text-body mb-2">Đăng Nhập Quản Trị</h3>
            <p className="text-secondary fs-6 mb-0">
              Nhập tài khoản quản trị viên hoặc nhân viên biên tập để truy cập hệ thống
            </p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center rounded-3 p-3 mb-4 shadow-sm" role="alert">
              <i className="bi bi-exclamation-triangle-fill fs-4 me-3 flex-shrink-0"></i>
              <div className="fw-semibold">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Username Input */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary small mb-1">
                TÊN ĐĂNG NHẬP (USERNAME)
              </label>
              <div className="input-group">
                <span className="input-group-text bg-body-tertiary px-3 border-end-0">
                  <i className="bi bi-person text-secondary"></i>
                </span>
                <input
                  type="text"
                  id="usernameInput"
                  className={`form-control form-control-lg border-start-0 ${fieldErrors.username ? "is-invalid" : ""}`}
                  placeholder="Nhập username..."
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (fieldErrors.username) setFieldErrors((prev) => ({ ...prev, username: "" }));
                  }}
                  autoFocus
                />
                {fieldErrors.username && (
                  <div className="invalid-feedback">{fieldErrors.username}</div>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary small mb-1">
                MẬT KHẨU
              </label>
              <div className="input-group">
                <span className="input-group-text bg-body-tertiary px-3 border-end-0">
                  <i className="bi bi-lock text-secondary"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="passwordInput"
                  className={`form-control form-control-lg border-start-0 border-end-0 ${fieldErrors.password ? "is-invalid" : ""}`}
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary px-3 border-start-0"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
                {fieldErrors.password && (
                  <div className="invalid-feedback">{fieldErrors.password}</div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="btnLoginSubmit"
              className="btn btn-primary btn-lg w-100 py-3 rounded-3 fw-bold shadow-sm mb-3"
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Đăng Nhập Vào Hệ Thống
            </button>
          </form>

          {/* Quick-fill sample credentials for instructor / tester */}
          <div className="p-3 rounded-3 bg-body-tertiary border mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small fw-semibold">
                <i className="bi bi-lightning-fill text-warning me-1"></i> Tài khoản thử nghiệm nhanh:
              </span>
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-success flex-fill rounded-2"
                onClick={() => handleQuickFill("Admin", "Admin")}
              >
                <strong>Admin</strong> (Quyền quản trị)
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary flex-fill rounded-2"
                onClick={() => handleQuickFill("staff", "staff123")}
              >
                <strong>Staff</strong> (Nhân viên)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;