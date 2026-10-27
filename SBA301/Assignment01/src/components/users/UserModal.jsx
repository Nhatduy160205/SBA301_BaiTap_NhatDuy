import React, { useState, useEffect } from "react";

export const UserModal = ({
  show,
  mode = "create",
  user = null,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    role: 2, // 1: Admin, 2: Staff
    status: 1
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      if (mode === "update" && user) {
        setFormData({
          username: user.username || "",
          password: "", // Leave blank if not changing
          fullName: user.fullName || "",
          email: user.email || "",
          role: Number(user.role ?? 2),
          status: Number(user.status ?? 1)
        });
      } else {
        setFormData({
          username: "",
          password: "",
          fullName: "",
          email: "",
          role: 2,
          status: 1
        });
      }
      setErrors({});
    }
  }, [show, mode, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "role" || name === "status" ? Number(value) : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleReset = () => {
    if (mode === "update" && user) {
      setFormData({
        username: user.username || "",
        password: "",
        fullName: user.fullName || "",
        email: user.email || "",
        role: Number(user.role ?? 2),
        status: Number(user.status ?? 1)
      });
    } else {
      setFormData({
        username: "",
        password: "",
        fullName: "",
        email: "",
        role: 2,
        status: 1
      });
    }
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống!";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự!";
    }

    if (mode === "create" && !formData.password) {
      newErrors.password = "Mật khẩu không được để trống khi tạo mới!";
    } else if (formData.password && formData.password.length < 4) {
      newErrors.password = "Mật khẩu phải có ít nhất 4 ký tự!";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống!";
    }

    // Email validation (Section 8.1 requirement)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Địa chỉ email không được để trống!";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Định dạng email không hợp lệ (VD: user@fpt.edu.vn)!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="modal-header bg-primary text-white px-4 py-3">
              <div className="d-flex align-items-center gap-2">
                <i className={`bi ${mode === "create" ? "bi-person-plus-fill" : "bi-person-gear"} fs-5`}></i>
                <h5 className="modal-title fs-6 fw-bold mb-0">
                  {mode === "create" ? "Tạo Tài Khoản Mới" : "Cập Nhật Tài Khoản"}
                </h5>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body p-4">
              {/* Username */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Tên đăng nhập (Username) <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-body-tertiary">@</span>
                  <input
                    type="text"
                    name="username"
                    className={`form-control ${errors.username ? "is-invalid" : ""}`}
                    placeholder="VD: staff_thanhphong"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {mode === "create" ? "Mật khẩu" : "Mật khẩu mới (Để trống nếu giữ nguyên)"}{" "}
                  {mode === "create" && <span className="text-danger">*</span>}
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-body-tertiary">
                    <i className="bi bi-key"></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    placeholder={mode === "create" ? "Nhập mật khẩu..." : "Nhập mật khẩu mới nếu muốn đổi..."}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
              </div>

              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Họ và tên <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                  placeholder="VD: Trần Thanh Phong"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
              </div>

              {/* Email with validation */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Địa chỉ Email <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-body-tertiary">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="VD: phongtt@funews.fpt.edu.vn"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
              </div>

              {/* Role */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Phân quyền (Role)</label>
                <div className="d-flex gap-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="role"
                      id="roleAdmin"
                      value={1}
                      checked={Number(formData.role) === 1}
                      onChange={handleChange}
                    />
                    <label className="form-check-label text-primary fw-semibold" htmlFor="roleAdmin">
                      <i className="bi bi-shield-lock-fill me-1"></i> Quản trị viên (Admin = 1)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="role"
                      id="roleStaff"
                      value={2}
                      checked={Number(formData.role) === 2}
                      onChange={handleChange}
                    />
                    <label className="form-check-label text-success fw-semibold" htmlFor="roleStaff">
                      <i className="bi bi-person-badge-fill me-1"></i> Nhân viên (Staff = 2)
                    </label>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Trạng thái tài khoản</label>
                <div className="d-flex gap-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="userActive"
                      value={1}
                      checked={Number(formData.status) === 1}
                      onChange={handleChange}
                    />
                    <label className="form-check-label text-success fw-semibold" htmlFor="userActive">
                      <i className="bi bi-check-circle me-1"></i> Hoạt động (Active)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="userInactive"
                      value={0}
                      checked={Number(formData.status) === 0}
                      onChange={handleChange}
                    />
                    <label className="form-check-label text-secondary fw-semibold" htmlFor="userInactive">
                      <i className="bi bi-lock me-1"></i> Khóa (Inactive)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-body-tertiary border-top-0 px-4 py-3 justify-content-between">
              <button
                type="button"
                className="btn btn-outline-warning rounded-3"
                onClick={handleReset}
                title="Làm lại form"
              >
                <i className="bi bi-arrow-counterclockwise me-1"></i> Làm lại
              </button>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-3 px-3"
                  onClick={onClose}
                >
                  <i className="bi bi-x-circle me-1"></i> Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded-3 px-4 fw-semibold shadow-sm"
                >
                  <i className={`bi ${mode === "create" ? "bi-check-lg" : "bi-save"} me-1`}></i>
                  {mode === "create" ? "Tạo người dùng" : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
