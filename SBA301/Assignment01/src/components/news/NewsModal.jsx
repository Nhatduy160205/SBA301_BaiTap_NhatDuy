import React, { useState, useEffect } from "react";

export const NewsModal = ({
  show,
  mode = "create",
  newsItem = null,
  categories = [],
  currentUser = null,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId: "",
    status: 1,
    tagsString: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      if (mode === "update" && newsItem) {
        setFormData({
          title: newsItem.title || "",
          content: newsItem.content || "",
          categoryId: newsItem.categoryId ? String(newsItem.categoryId) : "",
          status: Number(newsItem.status ?? 1),
          tagsString: Array.isArray(newsItem.tags) ? newsItem.tags.join(", ") : (newsItem.tags || "")
        });
      } else {
        setFormData({
          title: "",
          content: "",
          categoryId: categories.length > 0 ? String(categories[0].id) : "",
          status: 1,
          tagsString: ""
        });
      }
      setErrors({});
    }
  }, [show, mode, newsItem, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? Number(value) : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleReset = () => {
    if (mode === "update" && newsItem) {
      setFormData({
        title: newsItem.title || "",
        content: newsItem.content || "",
        categoryId: newsItem.categoryId ? String(newsItem.categoryId) : "",
        status: Number(newsItem.status ?? 1),
        tagsString: Array.isArray(newsItem.tags) ? newsItem.tags.join(", ") : (newsItem.tags || "")
      });
    } else {
      setFormData({
        title: "",
        content: "",
        categoryId: categories.length > 0 ? String(categories[0].id) : "",
        status: 1,
        tagsString: ""
      });
    }
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề bài viết không được để trống!";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Tiêu đề phải có ít nhất 5 ký tự!";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn một chuyên mục!";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Nội dung bài viết không được để trống!";
    } else if (formData.content.trim().length < 10) {
      newErrors.content = "Nội dung bài viết phải có ít nhất 10 ký tự!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      title: formData.title,
      content: formData.content,
      categoryId: Number(formData.categoryId),
      status: Number(formData.status),
      tags: formData.tagsString,
      createdBy: newsItem?.createdBy || currentUser?.username || "Admin"
    });
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="modal-header bg-primary text-white px-4 py-3">
              <div className="d-flex align-items-center gap-2">
                <i className={`bi ${mode === "create" ? "bi-journal-plus" : "bi-pencil-square"} fs-5`}></i>
                <h5 className="modal-title fs-6 fw-bold mb-0">
                  {mode === "create" ? "Soạn Thảo Bài Viết Mới" : "Cập Nhật Bài Viết"}
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
              {/* Title */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Tiêu đề bài viết <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  placeholder="Nhập tiêu đề tin tức nổi bật..."
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              {/* Category & Status Row */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Chuyên mục trực thuộc <span className="text-danger">*</span>
                  </label>
                  <select
                    name="categoryId"
                    className={`form-select ${errors.categoryId ? "is-invalid" : ""}`}
                    value={formData.categoryId}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn chuyên mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {Number(c.status) === 0 ? "(Tạm khóa)" : ""}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <div className="invalid-feedback">{errors.categoryId}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Trạng thái xuất bản</label>
                  <div className="d-flex gap-3 pt-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="status"
                        id="newsActive"
                        value={1}
                        checked={Number(formData.status) === 1}
                        onChange={handleChange}
                      />
                      <label className="form-check-label text-success fw-semibold" htmlFor="newsActive">
                        <i className="bi bi-check-circle me-1"></i> Xuất bản (Active)
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="status"
                        id="newsInactive"
                        value={0}
                        checked={Number(formData.status) === 0}
                        onChange={handleChange}
                      />
                      <label className="form-check-label text-secondary fw-semibold" htmlFor="newsInactive">
                        <i className="bi bi-clock-history me-1"></i> Nháp (Inactive)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Thẻ gắn (Tags)</label>
                <div className="input-group">
                  <span className="input-group-text bg-body-tertiary">
                    <i className="bi bi-tags"></i>
                  </span>
                  <input
                    type="text"
                    name="tagsString"
                    className="form-control"
                    placeholder="VD: AI, Công nghệ, FPT Edu (ngăn cách bởi dấu phẩy)"
                    value={formData.tagsString}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-text text-secondary">
                  Nhập các từ khóa phân loại, ngăn cách bằng dấu phẩy.
                </div>
              </div>

              {/* Content */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Nội dung chi tiết bài viết <span className="text-danger">*</span>
                </label>
                <textarea
                  name="content"
                  className={`form-control ${errors.content ? "is-invalid" : ""}`}
                  rows="6"
                  placeholder="Nhập nội dung đầy đủ của bài tin tức..."
                  value={formData.content}
                  onChange={handleChange}
                ></textarea>
                {errors.content && <div className="invalid-feedback">{errors.content}</div>}
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
                  <i className={`bi ${mode === "create" ? "bi-send-check" : "bi-save"} me-1`}></i>
                  {mode === "create" ? "Đăng tin" : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
