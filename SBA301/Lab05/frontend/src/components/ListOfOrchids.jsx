import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getOrchids, deleteOrchid } from "../services/orchidApi";

export default function ListOfOrchids() {
  const [orchids, setOrchids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Phần mở rộng: Tìm kiếm, lọc và sắp xếp
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [filterNaturalOnly, setFilterNaturalOnly] = useState(false);
  const [filterAttractiveOnly, setFilterAttractiveOnly] = useState(false);
  const [sortBy, setSortBy] = useState("ID_ASC");

  // Modal xem ảnh phóng to
  const [selectedImage, setSelectedImage] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getOrchids();
      setOrchids(response.data);
      setError("");
    } catch (e) {
      setError(e.message || "Không thể kết nối đến Backend API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa hoa lan "${name || id}"?`)) return;
    try {
      await deleteOrchid(id);
      setSuccessMsg(`Đã xóa thành công hoa lan "${name || id}" (HTTP 204 No Content)!`);
      await loadData();
    } catch (e) {
      setError(e.message || "Lỗi khi xóa hoa lan");
    }
  };

  // Trích xuất danh sách category duy nhất cho filter dropdown
  const categories = useMemo(() => {
    const set = new Set();
    orchids.forEach((o) => {
      if (o.orchidCategory && o.orchidCategory.trim()) {
        set.add(o.orchidCategory.trim());
      }
    });
    return Array.from(set);
  }, [orchids]);

  // Lọc và sắp xếp dữ liệu
  const filteredOrchids = useMemo(() => {
    let result = [...orchids];

    // 1. Tìm kiếm theo tên hoa hoặc mô tả
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
          (o.orchidName && o.orchidName.toLowerCase().includes(q)) ||
          (o.orchidDescription && o.orchidDescription.toLowerCase().includes(q))
      );
    }

    // 2. Lọc theo danh mục
    if (selectedCategory !== "ALL") {
      result = result.filter((o) => (o.orchidCategory || "").toLowerCase() === selectedCategory.toLowerCase());
    }

    // 3. Lọc hoa tự nhiên
    if (filterNaturalOnly) {
      result = result.filter((o) => o.natural);
    }

    // 4. Lọc hoa quyến rũ
    if (filterAttractiveOnly) {
      result = result.filter((o) => o.attractive);
    }

    // 5. Sắp xếp
    if (sortBy === "ID_ASC") {
      result.sort((a, b) => (a.orchidId || 0) - (b.orchidId || 0));
    } else if (sortBy === "ID_DESC") {
      result.sort((a, b) => (b.orchidId || 0) - (a.orchidId || 0));
    } else if (sortBy === "NAME_ASC") {
      result.sort((a, b) => (a.orchidName || "").localeCompare(a.orchidName || ""));
    } else if (sortBy === "NAME_DESC") {
      result.sort((a, b) => (b.orchidName || "").localeCompare(a.orchidName || ""));
    }

    return result;
  }, [orchids, searchTerm, selectedCategory, filterNaturalOnly, filterAttractiveOnly, sortBy]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" style={{ width: "3.5rem", height: "3.5rem" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted fs-5">Đang tải dữ liệu từ Backend (GET /orchids)...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header trang */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 fs-2">🌿 Quản Lý Danh Sách Hoa Lan (Orchids)</h2>
          <p className="text-muted mb-0 fs-6">
            Hiển thị <strong>{filteredOrchids.length}</strong> / <strong>{orchids.length}</strong> bản ghi từ SQL Server
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary px-3 py-2 fs-6" onClick={loadData}>
            🔄 Làm mới
          </button>
          <Link className="btn btn-primary px-3 py-2 fs-6 fw-semibold shadow-sm" to="/orchids/new">
            ➕ Create Orchid
          </Link>
        </div>
      </div>

      {/* Thông báo lỗi & thành công */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show fs-6" role="alert">
          <strong>⚠️ Lỗi:</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show fs-6" role="alert">
          <strong>✅ Thành công:</strong> {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg("")}></button>
        </div>
      )}

      {/* THANH CÔNG CỤ MỞ RỘNG: TÌM KIẾM, LỌC VÀ SẮP XẾP */}
      <div className="card shadow-sm border-0 mb-4 bg-white p-3">
        <div className="row g-3 align-items-center">
          {/* Ô tìm kiếm */}
          <div className="col-lg-4 col-md-6">
            <label className="form-label small text-muted mb-1 fw-bold">🔍 Tìm kiếm tên / mô tả:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập từ khóa tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Lọc danh mục */}
          <div className="col-lg-3 col-md-6">
            <label className="form-label small text-muted mb-1 fw-bold">🏷️ Danh mục (Category):</label>
            <select
              className="form-select form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">-- Tất cả danh mục --</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sắp xếp */}
          <div className="col-lg-3 col-md-6">
            <label className="form-label small text-muted mb-1 fw-bold">↕️ Sắp xếp:</label>
            <select
              className="form-select form-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="ID_ASC">ID tăng dần (Mặc định)</option>
              <option value="ID_DESC">ID giảm dần (Mới nhất)</option>
              <option value="NAME_ASC">Tên hoa (A ➔ Z)</option>
              <option value="NAME_DESC">Tên hoa (Z ➔ A)</option>
            </select>
          </div>

          {/* Nút reset filter */}
          <div className="col-lg-2 col-md-6 d-flex align-items-end">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("ALL");
                setFilterNaturalOnly(false);
                setFilterAttractiveOnly(false);
                setSortBy("ID_ASC");
              }}
            >
              🧹 Đặt lại lọc
            </button>
          </div>

          {/* Bộ lọc checkbox */}
          <div className="col-12 d-flex gap-4 pt-1 flex-wrap">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="filterNatural"
                checked={filterNaturalOnly}
                onChange={(e) => setFilterNaturalOnly(e.target.checked)}
              />
              <label className="form-check-label small fw-semibold" htmlFor="filterNatural">
                🌿 Chỉ hoa tự nhiên (Natural)
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="filterAttractive"
                checked={filterAttractiveOnly}
                onChange={(e) => setFilterAttractiveOnly(e.target.checked)}
              />
              <label className="form-check-label small fw-semibold" htmlFor="filterAttractive">
                ✨ Chỉ hoa quyến rũ (Attractive)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu chính */}
      {filteredOrchids.length === 0 ? (
        <div className="card text-center p-5 shadow-sm border-0 bg-light">
          <div className="display-3 mb-3">🌱</div>
          <h3 className="fw-bold">Không tìm thấy hoa lan phù hợp</h3>
          <p className="text-muted fs-5">Hãy thử thay đổi điều kiện tìm kiếm hoặc bấm đặt lại bộ lọc.</p>
          <div className="mt-3">
            <button
              className="btn btn-primary px-4 py-2 fs-6"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("ALL");
                setFilterNaturalOnly(false);
                setFilterAttractiveOnly(false);
              }}
            >
              Xóa điều kiện tìm kiếm
            </button>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm border-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "70px" }}>ID</th>
                  <th style={{ width: "110px" }}>Hình ảnh</th>
                  <th>Tên hoa lan (Name)</th>
                  <th style={{ width: "180px" }}>Danh mục (Category)</th>
                  <th style={{ width: "140px" }} className="text-center">Tự nhiên</th>
                  <th style={{ width: "140px" }} className="text-center">Quyến rũ</th>
                  <th style={{ width: "200px" }} className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrchids.map((o) => (
                  <tr key={o.orchidId}>
                    <td className="fw-bold text-secondary fs-5">#{o.orchidId}</td>
                    <td>
                      {o.orchidURL ? (
                        <img
                          src={o.orchidURL}
                          alt={o.orchidName}
                          referrerPolicy="no-referrer"
                          className="orchid-thumb"
                          style={{ cursor: "pointer" }}
                          title="Bấm để xem ảnh phóng to"
                          onClick={() => setSelectedImage(o)}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=200&auto=format&fit=crop&q=80";
                          }}
                        />
                      ) : (
                        <div className="orchid-thumb-placeholder">
                          🌸
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="orchid-name">{o.orchidName}</div>
                      {o.orchidDescription && (
                        <div className="orchid-desc text-truncate" style={{ maxWidth: "340px" }}>
                          {o.orchidDescription}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-secondary text-uppercase">{o.orchidCategory || "Chưa phân loại"}</span>
                    </td>
                    <td className="text-center">
                      {o.natural ? (
                        <span className="badge bg-success">🌿 Yes</span>
                      ) : (
                        <span className="badge bg-light text-dark border">🧪 No</span>
                      )}
                    </td>
                    <td className="text-center">
                      {o.attractive ? (
                        <span className="badge bg-warning text-dark">✨ Yes</span>
                      ) : (
                        <span className="badge bg-light text-muted border">No</span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Link className="btn btn-outline-warning btn-sm fw-semibold" to={`/orchids/${o.orchidId}/edit`}>
                          ✏️ Edit
                        </Link>
                        <button className="btn btn-outline-danger btn-sm fw-semibold" onClick={() => handleDelete(o.orchidId, o.orchidName)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL MỞ RỘNG: XEM ẢNH PHÓNG TO VÀ THÔNG TIN CHI TIẾT */}
      {selectedImage && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content shadow-lg border-0 overflow-hidden">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  🌸 #{selectedImage.orchidId} - {selectedImage.orchidName}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedImage(null)}></button>
              </div>
              <div className="modal-body text-center p-4">
                <img
                  src={selectedImage.orchidURL}
                  alt={selectedImage.orchidName}
                  referrerPolicy="no-referrer"
                  className="img-fluid rounded shadow-sm mb-3"
                  style={{ maxHeight: "480px", objectFit: "contain" }}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=600&auto=format&fit=crop&q=80";
                  }}
                />
                <h5 className="fw-bold mb-2">{selectedImage.orchidName}</h5>
                <p className="text-muted fs-6 mb-2">{selectedImage.orchidDescription || "Không có mô tả chi tiết."}</p>
                <div className="d-flex justify-content-center gap-2">
                  <span className="badge bg-secondary text-uppercase">{selectedImage.orchidCategory || "Không rõ loại"}</span>
                  {selectedImage.natural ? <span className="badge bg-success">🌿 Tự nhiên</span> : <span className="badge bg-secondary">🧪 Nhân tạo</span>}
                  {selectedImage.attractive && <span className="badge bg-warning text-dark">✨ Quyến rũ</span>}
                </div>
              </div>
              <div className="modal-footer bg-light">
                <Link to={`/orchids/${selectedImage.orchidId}/edit`} className="btn btn-warning">
                  ✏️ Chỉnh sửa hoa lan này
                </Link>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedImage(null)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
