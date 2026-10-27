import React, { useState, useEffect } from "react";

export const CategoryModal = ({
  show,
  mode = "create", // "create" | "update"
  category = null,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: 1
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      if (mode === "update" && category) {
        setFormData({
          name: category.name || "",
          description: category.description || "",
          status: Number(category.status ?? 1)
        });
      } else {
        // Reset form for create mode
        setFormData({
          name: "",
          description: "",
          status: 1
        });
      }
      setErrors({});
    }
  }, [show, mode, category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? Number(value) : value
    }));
    // Clear validation error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleReset = () => {
    if (mode === "update" && category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        status: Number(category.status ?? 1)
      });
    } else {
      setFormData({
        name: "",
        description: "",
        status: 1
      });
    }
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Tên chuyên mục không được để trống!";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Tên chuyên mục phải có ít nhất 3 ký tự!";
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
                <i className={`bi ${mode === "create" ? "bi-plus-circle" : "bi-pencil-square"} fs-5`}></i>
                <h5 className="modal-title fs-6 fw-bold mb-0">
                  {mode === "create" ? "Thêm Chuyên Mục Mới" : "Cập Nhật Chuyên Mục"}
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
              {/* Category Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Tên chuyên mục <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-body-tertiary">
                    <i className="bi bi-tag"></i>
                  </span>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="VD: Công nghệ thông tin..."
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Mô tả chi tiết</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Nhập mô tả ngắn gọn về phạm vi của chuyên mục..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Status */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Trạng thái hoạt động</label>
                <div className="d-flex gap-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="statusActive"
                      value={1}
                      checked={Number(formData.status) === 1}
                      onChange={handleChange}
                    />
                    <label className="form-check-label text-success fw-semibold" htmlFor="statusActive">
                      <i className="bi bi-check-circle me-1"></i> Hoạt động (Active)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="statusInactive"
                      value={0}
                      checked={Number(formData.status) === 0}
                      onChange={handleChange}
                    />
                    <label className="form-check-label text-secondary fw-semibold" htmlFor="statusInactive">
                      <i className="bi bi-slash-circle me-1"></i> Khóa / Tạm dừng (Inactive)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-body-tertiary border-top-0 px-4 py-3 justify-content-between">
              {/* Reset button (Section 8.1 requirement) */}
              <button
                type="button"
                className="btn btn-outline-warning rounded-3"
                onClick={handleReset}
                title="Đặt lại dữ liệu ban đầu của form"
              >
                <i className="bi bi-arrow-counterclockwise me-1"></i> Làm lại
              </button>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-3 px-3"
                  onClick={onClose}
                >
                  <i className="bi bi-x-circle me-1"></i> Đóng
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded-3 px-4 fw-semibold shadow-sm"
                >
                  <i className={`bi ${mode === "create" ? "bi-check-lg" : "bi-save"} me-1`}></i>
                  {mode === "create" ? "Thêm mới" : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
