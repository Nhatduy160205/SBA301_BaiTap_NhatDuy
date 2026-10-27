import React, { useState, useEffect } from "react";
import { createOrchid, updateOrchid, getCategories } from "../api/orchidApi";

export default function EditOrchid({ isOpen, onClose, orchidToEdit, onSaveSuccess, onShowToast }) {
  const isEditMode = Boolean(orchidToEdit && orchidToEdit.orchidID);

  const [formData, setFormData] = useState({
    orchidName: "",
    categoryId: "1",
    isNatural: true,
    isAttractive: false,
    orchidDescription: "",
    orchidURL: "",
  });

  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    getCategories()
      .then((res) => {
        setCategories(res.data);
        if (res.data.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({ ...prev, categoryId: String(res.data[0].categoryId) }));
        }
      })
      .catch((err) => {
        console.error("Could not fetch categories:", err);
      });
  }, []);

  useEffect(() => {
    if (orchidToEdit) {
      setFormData({
        orchidName: orchidToEdit.orchidName || "",
        categoryId: String(orchidToEdit.orchidCategory?.categoryId || "1"),
        isNatural: orchidToEdit.isNatural ?? true,
        isAttractive: orchidToEdit.isAttractive ?? false,
        orchidDescription: orchidToEdit.orchidDescription || "",
        orchidURL: orchidToEdit.orchidURL || "",
      });
    } else {
      setFormData({
        orchidName: "",
        categoryId: categories.length > 0 ? String(categories[0].categoryId) : "1",
        isNatural: true,
        isAttractive: false,
        orchidDescription: "",
        orchidURL: "",
      });
    }
    setFieldErrors({});
  }, [orchidToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errors = {};
    if (!formData.orchidName || !formData.orchidName.trim()) {
      errors.orchidName = "Tên Orchid không được để trống";
    }
    if (!formData.categoryId) {
      errors.categoryId = "Vui lòng chọn danh mục Orchid";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const payload = {
      orchidName: formData.orchidName.trim(),
      isNatural: formData.isNatural,
      isAttractive: formData.isAttractive,
      orchidDescription: formData.orchidDescription.trim(),
      orchidURL: formData.orchidURL.trim(),
      orchidCategory: {
        categoryId: Number(formData.categoryId),
      },
    };

    const actionPromise = isEditMode
      ? updateOrchid(orchidToEdit.orchidID, payload)
      : createOrchid(payload);

    actionPromise
      .then((res) => {
        onShowToast(
          isEditMode
            ? `Cập nhật Orchid #${res.data.orchidID} thành công!`
            : `Đã tạo mới Orchid "${res.data.orchidName}" thành công!`,
          "success"
        );
        onSaveSuccess();
        onClose();
      })
      .catch((err) => {
        onShowToast(err.friendlyMessage || "Lỗi khi lưu Orchid", "error");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditMode ? `Chỉnh sửa Orchid #${orchidToEdit.orchidID}` : "Thêm Mới Orchid"}
          </h3>
          <button className="modal-close" onClick={onClose} disabled={submitting}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Step 8 Preflight callout note */}
            <div style={{ background: "#eef2ff", border: "1px solid #c7d2fe", padding: "10px 14px", borderRadius: "8px", fontSize: "12px", color: "#3730a3", marginBottom: "16px" }}>
              💡 <strong>CORS Note:</strong> Thao tác {isEditMode ? "PUT" : "POST"} gửi dữ liệu JSON (<code>Content-Type: application/json</code>), trình duyệt sẽ tự động kích hoạt <strong>preflight OPTIONS request</strong> để kiểm tra header <code>Access-Control-Allow-Methods</code> trước khi gửi request thật.
            </div>

            <div className="form-group">
              <label className="form-label">Tên Orchid <span style={{ color: "red" }}>*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="VD: Cattleya Labiata Queen"
                value={formData.orchidName}
                onChange={(e) => setFormData({ ...formData, orchidName: e.target.value })}
              />
              {fieldErrors.orchidName && (
                <div style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>
                  {fieldErrors.orchidName}
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-col form-group">
                <label className="form-label">Danh Mục (Category) <span style={{ color: "red" }}>*</span></label>
                <select
                  className="form-select"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName} (ID: {c.categoryId})
                    </option>
                  ))}
                </select>
                {fieldErrors.categoryId && (
                  <div style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>
                    {fieldErrors.categoryId}
                  </div>
                )}
              </div>

              <div className="form-col form-group" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", gap: "20px", marginTop: "16px" }}>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isNatural}
                      onChange={(e) => setFormData({ ...formData, isNatural: e.target.checked })}
                    />
                    🌿 Tự nhiên
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isAttractive}
                      onChange={(e) => setFormData({ ...formData, isAttractive: e.target.checked })}
                    />
                    ✨ Quyến rũ
                  </label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Đường dẫn ảnh (URL)</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.orchidURL}
                onChange={(e) => setFormData({ ...formData, orchidURL: e.target.value })}
              />
              {formData.orchidURL && (
                <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src={formData.orchidURL}
                    alt="Preview"
                    style={{ width: "48px", height: "48px", borderRadius: "6px", objectFit: "cover", border: "1px solid #cbd5e1" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Xem trước ảnh đại diện</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Mô Tả Chi Tiết</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Nhập mô tả về đặc tính, nguồn gốc, sắc hoa..."
                value={formData.orchidDescription}
                onChange={(e) => setFormData({ ...formData, orchidDescription: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner"></span> Đang lưu...
                </>
              ) : isEditMode ? (
                "Lưu Thay Đổi"
              ) : (
                "Tạo Mới Orchid"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
