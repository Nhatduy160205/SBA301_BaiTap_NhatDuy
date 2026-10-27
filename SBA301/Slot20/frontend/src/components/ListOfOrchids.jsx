import React, { useState, useEffect } from "react";
import { getOrchids, deleteOrchid } from "../api/orchidApi";

export default function ListOfOrchids({ onOpenCreate, onOpenEdit, onShowToast }) {
  // Step 4 & Section 2.4 - Request state model
  const [orchids, setOrchids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchOrchids = () => {
    setLoading(true);
    setError(null);
    getOrchids(searchKeyword)
      .then((res) => {
        setOrchids(res.data);
      })
      .catch((err) => {
        setError(err.friendlyMessage || "Không thể tải danh sách hoa lan từ server.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrchids();
  }, [searchKeyword]);

  const handleDelete = (id, name) => {
    deleteOrchid(id)
      .then(() => {
        onShowToast(`Đã xóa thành công Orchid "${name}"!`, "success");
        setDeleteConfirmId(null);
        fetchOrchids();
      })
      .catch((err) => {
        onShowToast(`Lỗi khi xóa: ${err.friendlyMessage}`, "error");
      });
  };

  // Extract unique category names
  const categories = ["ALL", ...new Set(orchids.map((o) => o.orchidCategory?.categoryName).filter(Boolean))];

  const filteredOrchids = orchids.filter((o) => {
    if (selectedCategory === "ALL") return true;
    return o.orchidCategory?.categoryName === selectedCategory;
  });

  return (
    <div>
      {/* Control Bar: Search, Category Filter, and Add Button */}
      <div className="control-bar">
        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm hoa lan theo tên..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-chip ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "ALL" ? "Tất cả" : cat}
            </button>
          ))}
        </div>

        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={fetchOrchids} title="Tải lại dữ liệu">
            🔄 Làm mới
          </button>
          <button className="btn btn-primary" onClick={onOpenCreate}>
            ➕ Thêm mới Orchid
          </button>
        </div>
      </div>

      {/* Error alert with retry button */}
      {error && (
        <div className="alert alert-danger">
          <div>
            <strong>⚠️ Lỗi tải dữ liệu:</strong> {error}
          </div>
          <button className="btn btn-secondary" onClick={fetchOrchids} style={{ padding: "6px 12px" }}>
            Thử lại
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div className="spinner" style={{ width: "36px", height: "36px", borderColor: "rgba(99,102,241,0.2)", borderTopColor: "#6366f1" }}></div>
          <p style={{ marginTop: "16px", color: "var(--text-muted)", fontSize: "14px" }}>
            Đang tải dữ liệu từ Backend Spring Boot (<code>GET http://localhost:8080/orchids/</code>)...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredOrchids.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
          <div style={{ fontSize: "56px", marginBottom: "12px" }}>🌱</div>
          <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>Không tìm thấy Orchid nào</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "16px" }}>
            Thử thay đổi từ khóa tìm kiếm hoặc bấm Thêm mới Orchid để tạo bản ghi đầu tiên.
          </p>
          <button className="btn btn-primary" onClick={onOpenCreate}>
            Thêm mới ngay
          </button>
        </div>
      )}

      {/* Orchid Cards Grid */}
      {!loading && !error && filteredOrchids.length > 0 && (
        <div className="orchid-grid">
          {filteredOrchids.map((orchid) => (
            <div key={orchid.orchidID} className="orchid-card">
              <div className="card-image-wrapper">
                <img
                  src={orchid.orchidURL || "https://images.unsplash.com/photo-1566999573210-9ecb5bc7f4ff?w=600&auto=format&fit=crop&q=80"}
                  alt={orchid.orchidName}
                  className="card-img"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=600&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="card-badges">
                  {orchid.isNatural ? (
                    <span className="badge badge-natural">🌿 Tự Nhiên</span>
                  ) : (
                    <span className="badge badge-hybrid">🧪 Lai Tạo</span>
                  )}
                  {orchid.isAttractive && (
                    <span className="badge badge-attractive">✨ Quyến Rũ</span>
                  )}
                </div>
                <div className="badge-category">
                  {orchid.orchidCategory?.categoryName || "Chưa phân loại"}
                </div>
              </div>

              <div className="card-body">
                <h3 className="card-title">{orchid.orchidName}</h3>
                <p className="card-desc">
                  {orchid.orchidDescription || "Chưa có mô tả chi tiết cho giống lan này."}
                </p>

                <div className="card-footer">
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    ID: #{orchid.orchidID}
                  </span>
                  <div className="card-actions">
                    <button
                      className="btn-icon"
                      title="Chỉnh sửa Orchid"
                      onClick={() => onOpenEdit(orchid)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon delete"
                      title="Xóa Orchid"
                      onClick={() => setDeleteConfirmId(orchid.orchidID)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: "420px" }}>
            <div className="modal-header">
              <h3 className="modal-title">Xác nhận xóa Orchid</h3>
              <button className="modal-close" onClick={() => setDeleteConfirmId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn xóa bản ghi Orchid này không? Thao tác này sẽ gửi request <code>DELETE /orchids/{deleteConfirmId}</code> tới Spring Boot backend và xóa vĩnh viễn khỏi SQL Server.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>Hủy</button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  const target = orchids.find((o) => o.orchidID === deleteConfirmId);
                  handleDelete(deleteConfirmId, target?.orchidName || "");
                }}
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
