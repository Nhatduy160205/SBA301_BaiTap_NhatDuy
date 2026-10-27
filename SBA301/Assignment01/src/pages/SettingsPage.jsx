import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { storageService } from "../services/storageService";
import { userService } from "../services/userService";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { ToastNotification } from "../components/common/ToastNotification";

export const SettingsPage = () => {
  const { currentUser, updateUserProfile, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || ""
  });

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    title: "",
    message: ""
  });

  const [resetModal, setResetModal] = useState(false);

  const showToast = (type, title, message) => {
    setToast({ show: true, type, title, message });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!profileForm.fullName.trim()) {
      showToast("danger", "Lỗi dữ liệu", "Họ tên không được để trống!");
      return;
    }
    if (!profileForm.email.trim()) {
      showToast("danger", "Lỗi dữ liệu", "Email không được để trống!");
      return;
    }

    try {
      if (currentUser?.id) {
        userService.update(currentUser.id, {
          username: currentUser.username,
          fullName: profileForm.fullName,
          email: profileForm.email,
          role: currentUser.role,
          status: 1
        });
      }
      updateUserProfile({
        fullName: profileForm.fullName,
        email: profileForm.email
      });
      showToast("success", "Cập nhật thành công!", "Thông tin hồ sơ cá nhân đã được lưu.");
    } catch (err) {
      showToast("danger", "Lỗi", err.message || "Không thể cập nhật hồ sơ!");
    }
  };

  const handleResetDatabase = () => {
    storageService.resetAll();
    setResetModal(false);
    showToast("success", "Khôi phục thành công!", "Toàn bộ dữ liệu chuyên mục, tin tức và người dùng đã trở về mặc định ban đầu.");
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="settings-page">
      <ToastNotification toast={toast} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />

      <div className="mb-4">
        <h4 className="fw-bold mb-1 text-body">Cài Đặt Hệ Thống & Hồ Sơ</h4>
        <p className="text-secondary small mb-0">
          Tùy chỉnh giao diện hiển thị, quản lý thông tin tài khoản và cấu hình hệ thống
        </p>
      </div>

      <div className="row g-4">
        {/* Profile Settings */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 bg-body mb-4">
            <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-person-lines-fill text-primary fs-5"></i>
                <h5 className="fw-bold mb-0 text-body">Thông Tin Tài Khoản</h5>
              </div>
              <small className="text-secondary">Chỉnh sửa thông tin định danh của người dùng hiện tại</small>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleProfileSubmit}>
                {/* Username read-only */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">
                    Tên đăng nhập (Username)
                  </label>
                  <input
                    type="text"
                    className="form-control bg-body-tertiary"
                    value={currentUser?.username || ""}
                    disabled
                  />
                  <div className="form-text text-secondary">Tên đăng nhập không thể thay đổi sau khi khởi tạo.</div>
                </div>

                {/* Role read-only */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">
                    Vai trò hiện tại (Role)
                  </label>
                  <div>
                    <span className={`badge px-3 py-2 rounded-pill ${isAdmin ? "bg-primary-subtle text-primary border" : "bg-success-subtle text-success border"}`}>
                      <i className={`bi ${isAdmin ? "bi-shield-check" : "bi-person-badge"} me-1`}></i>
                      {currentUser?.roleName}
                    </span>
                  </div>
                </div>

                {/* Full name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">
                    Họ và tên hiển thị
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="form-label fw-semibold small text-secondary">
                    Địa chỉ Email liên hệ
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary rounded-3 px-4 fw-semibold shadow-sm">
                  <i className="bi bi-save me-1"></i> Lưu thông tin hồ sơ
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* System Settings & Theme */}
        <div className="col-12 col-lg-5">
          {/* Appearance card */}
          <div className="card border-0 shadow-sm rounded-4 bg-body mb-4">
            <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-palette-fill text-warning fs-5"></i>
                <h5 className="fw-bold mb-0 text-body">Giao Diện & Màu Sắc</h5>
              </div>
              <small className="text-secondary">Chuyển đổi chủ đề màu sắc giao diện</small>
            </div>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-body-tertiary border mb-3">
                <div>
                  <div className="fw-bold text-body">Chế độ hiển thị tối (Dark Mode)</div>
                  <small className="text-secondary">
                    {theme === "dark" ? "Đang bật chế độ ban đêm" : "Đang bật chế độ ban ngày"} (Được lưu vĩnh viễn trong LocalStorage)
                  </small>
                </div>
                <div className="form-check form-switch fs-4 mb-0">
                  <input
                    className="form-check-input cursor-pointer"
                    type="checkbox"
                    role="switch"
                    checked={theme === "dark"}
                    onChange={toggleTheme}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Database maintenance card */}
          <div className="card border-0 shadow-sm rounded-4 bg-body">
            <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-database-fill-gear text-danger fs-5"></i>
                <h5 className="fw-bold mb-0 text-body">Khôi Phục Dữ Liệu (Demo / Test)</h5>
              </div>
              <small className="text-secondary">Hỗ trợ giảng viên và sinh viên kiểm thử nhanh</small>
            </div>
            <div className="card-body p-4">
              <p className="text-secondary small mb-3">
                Nếu bạn muốn đặt lại toàn bộ dữ liệu mẫu (Chuyên mục, Tin tức, Người dùng) về trạng thái chuẩn ban đầu theo đề bài SBA301, bấm nút bên dưới:
              </p>
              <button
                type="button"
                className="btn btn-outline-danger w-100 rounded-3 py-2 fw-semibold"
                onClick={() => setResetModal(true)}
              >
                <i className="bi bi-arrow-repeat me-1"></i> Khôi phục dữ liệu ban đầu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Reset Data Modal */}
      <ConfirmModal
        show={resetModal}
        title="Xác nhận khôi phục dữ liệu"
        message="Hành động này sẽ nạp lại toàn bộ dữ liệu mẫu mặc định cho Chuyên mục, Tin tức và Người dùng. Các thay đổi của bạn sẽ được làm mới."
        confirmText="Đồng ý khôi phục"
        cancelText="Hủy bỏ"
        variant="warning"
        onConfirm={handleResetDatabase}
        onCancel={() => setResetModal(false)}
      />
    </div>
  );
};
