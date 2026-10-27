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

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center p-3 p-md-4 login-background">
      {/* Top right theme toggle */}
      <div className="position-absolute top-0 end-0 p-3 p-md-4">
        <button
          type="button"
          className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
          style={{ width: "46px", height: "46px" }}
          onClick={toggleTheme}
          title="Đổi giao diện sáng/tối"
        >
          <i className={`bi ${theme === "light" ? "bi-moon-stars-fill text-warning fs-5" : "bi-sun-fill text-warning fs-5"}`}></i>
        </button>
      </div>

      <div className="login-card-container w-100" style={{ maxWidth: "540px" }}>
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-body">
          {/* Brand Header */}
          <div className="p-4 pt-5 text-center bg-primary-subtle border-bottom">
            <div className="d-inline-block shadow-sm rounded-4 overflow-hidden mb-3">
              <img
                src="/assets/logo.jpg"
                alt="FUNews AI Logo"
                style={{ width: "92px", height: "92px", objectFit: "cover" }}
              />
            </div>
            <h3 className="fw-bold text-gradient mb-2 fs-3">FUNewsManagementSystem</h3>
            <p className="text-secondary mb-0 fs-6">
              Cổng thông tin quản trị tin tức FPT University
            </p>
          </div>

          <div className="card-body p-4 p-md-5">
            <div className="mb-4 text-center">
              <h4 className="fw-bold text-body mb-2">Đăng Nhập Quản Trị</h4>
              <p className="text-secondary fs-6 mb-0">
                Vui lòng nhập tài khoản được cấp quyền để tiếp tục
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
              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary fs-6 mb-2">
                  Tên đăng nhập (Username)
                </label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-body-tertiary px-3">
                    <i className="bi bi-person fs-5"></i>
                  </span>
                  <input
                    type="text"
                    id="usernameInput"
                    className={`form-control ${fieldErrors.username ? "is-invalid" : ""}`}
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
                <label className="form-label fw-semibold text-secondary fs-6 mb-2">
                  Mật khẩu
                </label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-body-tertiary px-3">
                    <i className="bi bi-lock fs-5"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="passwordInput"
                    className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`}
                    placeholder="Nhập mật khẩu..."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash fs-5" : "bi-eye fs-5"}`}></i>
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
                className="btn btn-primary btn-lg w-100 py-3 rounded-3 fw-bold shadow-sm mt-2 transition-all fs-6"
              >
                <i className="bi bi-box-arrow-in-right me-2 fs-5"></i>
                Đăng Nhập Vào Hệ Thống
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-4 text-secondary">
          SBA301 • Integrate Single Page Application with Spring Boot • Lab Assignment 01
        </div>
      </div>
    </div>
  );
};