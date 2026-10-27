import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createOrchid, getOrchid, updateOrchid } from "../services/orchidApi";

const emptyForm = {
  orchidName: "",
  natural: false,
  orchidDescription: "",
  orchidCategory: "",
  attractive: false,
  orchidURL: "",
};

export default function EditOrchid({ createMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!createMode && id) {
      setLoading(true);
      getOrchid(id)
        .then((r) => {
          setForm(r.data);
          setError("");
        })
        .catch((e) => {
          setError(e.message || "Không thể tải thông tin hoa lan");
        })
        .finally(() => setLoading(false));
    } else {
      setForm(emptyForm);
    }
  }, [createMode, id]);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.orchidName || !form.orchidName.trim()) {
      setError("Tên hoa lan (Name) là bắt buộc và không được để trống!");
      return;
    }

    try {
      setLoading(true);
      if (createMode) {
        await createOrchid(form);
      } else {
        await updateOrchid(id, form);
      }
      navigate("/");
    } catch (e) {
      setError(e.message || "Lỗi khi lưu dữ liệu lên server");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !createMode && !form.orchidName) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card shadow-sm border-0 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <h2 className="fw-bold mb-0">
              {createMode ? "➕ Tạo Mới Hoa Lan (Create Orchid)" : `✏️ Chỉnh Sửa Hoa Lan #${id}`}
            </h2>
            <Link to="/" className="btn btn-outline-secondary btn-sm">
              ← Quay lại danh sách
            </Link>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <strong>⚠️ Lỗi:</strong> {error}
            </div>
          )}

          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Tên hoa lan (Name) <span className="text-danger">*</span>
              </label>
              <input
                className="form-control"
                name="orchidName"
                value={form.orchidName ?? ""}
                onChange={change}
                placeholder="VD: Taichung Beauty, Dendrobium Nobile..."
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Danh mục (Category)</label>
              <input
                className="form-control"
                name="orchidCategory"
                value={form.orchidCategory ?? ""}
                onChange={change}
                placeholder="VD: Cattleya, Dendrobium, Phalaenopsis..."
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Mô tả (Description)</label>
              <textarea
                className="form-control"
                rows="3"
                name="orchidDescription"
                value={form.orchidDescription ?? ""}
                onChange={change}
                placeholder="Nhập mô tả về đặc điểm, hương thơm, màu sắc..."
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Đường dẫn ảnh trực tiếp (Direct Image URL)</label>
              <input
                className="form-control"
                name="orchidURL"
                value={form.orchidURL ?? ""}
                onChange={change}
                placeholder="https://example.com/image.jpg (.jpg, .png, .webp)"
              />
              <small className="text-muted d-block mt-1">
                💡 Lưu ý: Phải là link ảnh trực tiếp (đuôi <code>.jpg</code>, <code>.png</code>, <code>.webp</code>), không phải link bài báo trang web (đuôi <code>.htm</code>, <code>.html</code>).
              </small>
              {form.orchidURL && (
                <div className="mt-2 p-2 bg-light rounded d-flex align-items-center gap-3">
                  <img
                    src={form.orchidURL}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <small className="text-muted">Xem trước ảnh đại diện</small>
                </div>
              )}
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <div className="form-check p-3 bg-light rounded">
                  <input
                    className="form-check-input ms-0 me-2"
                    type="checkbox"
                    id="naturalCheck"
                    name="natural"
                    checked={!!form.natural}
                    onChange={change}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="naturalCheck">
                    🌿 Tự nhiên (Natural Orchid)
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check p-3 bg-light rounded">
                  <input
                    className="form-check-input ms-0 me-2"
                    type="checkbox"
                    id="attractiveCheck"
                    name="attractive"
                    checked={!!form.attractive}
                    onChange={change}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="attractiveCheck">
                    ✨ Quyến rũ / Nổi bật (Attractive)
                  </label>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <Link to="/" className="btn btn-secondary">
                Hủy bỏ
              </Link>
              <button className="btn btn-success px-4" type="submit" disabled={loading}>
                {loading ? "Đang lưu..." : "💾 Lưu Dữ Liệu (Save)"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
